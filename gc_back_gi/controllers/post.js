const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');


// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');

exports.beforePost = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 3. 해당 동아리의 부원인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "부원만 작성할 수 있음", user: user, club: exClub });
        }

        return res.status(200).send({ success: 200, result: "포스트 작성 가능", user: user, club: exClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.afterUploadImage = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 3. 해당 동아리의 부원인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "부원만 작성할 수 있음", user: user, club: exClub });
        }

        // 5. 이미지 저장 경로와 작성자, 동아리 Id를 postimg 테이블에 저장
        const imgInfo = await db.postImg.create({
            img: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`,
            userId: reqUserID,
            clanId: reqClanID
        });

        // 6. 프론트로 전달
        return res.status(201).send({
            success: 201,
            result: { img: req.file, imgPath: imgInfo.img },
            user: user, club: exClub
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.uploadPost = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

         // 4. 동아리가 존재하는지 확인
         const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
         if (!exClub) {
             return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
         }

        // 3. 해당 동아리의 부원인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "부원만 작성할 수 있음", user: user, club: exClub });
        }

        const imgPath = req.body.imgPath;

        if(imgPath) {
            // 5. 없는 이미지 데이터 사용(악의적인 url 사용 방지)
            const exPostImg = await db.postImg.findOne({ where: { img: imgPath } });
            
            if ( !exPostImg ) {
                return res.status(404).send({ success: 404, result: "존재하지 않는 이미지 리소스", user: user, club: exClub });
            }

            // 6. 포스팅하려는 이미지가 내가 권한을 가진 이미지인지 검증
            if ( exPostImg.userId !== parseInt(reqUserID) || exPostImg.clanId !== parseInt(reqClanID) ) {
                return res.status(403).send({ success: 403, result: "해당 이미지 사용 권한 없음", user: user, club: exClub });
            }
        }

        // 7. 잘못된 전체공개, 부원공개 값
        const isPublic = parseInt(req.body.isPublic);
        if (isPublic !== 0 && isPublic !== 1) {
            return res.status(404).send({ success: 404, result: "유효하지 않은 결정", user: user, club: exClub });
        }

        if (req.body.postHead === undefined || req.body.postHead === null || req.body.postHead === '') {
            return res.status(200).send({ success: 400, result: "제목을 작성해주세요.", user: user, club: exClub });
        }

        if (req.body.postBody === undefined || req.body.postBody === null || req.body.postBody === '') {
            return res.status(200).send({ success: 400, result: "본문을 작성해주세요.", user: user, club: exClub });
        } 

        // 8. 모든 무결성 검증 후 post 테이블 생성
        const postResult = await db.post.create({
            userId: reqUserID,
            clanId: reqClanID,
            postHead: req.body.postHead,
            postBody: req.body.postBody,
            isPublic: req.body.isPublic
        })

        // 9. postimg 테이블의 postId 값을 배정
        if (!imgPath) {
            return res.status(200).send({ success: 200, result: "포스팅 성공", user: user, club: exClub, post: postResult });
        } else {
            await db.postImg.update({postId: postResult.postId}, {where: { img: imgPath }});
            const postImgInfo = await db.postImg.findOne({where: { img: imgPath }});
            return res.status(200).send({ success: 200, result: "포스팅 성공", user: user, club: exClub, post: postResult, postImg: postImgInfo });
        }
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendPostData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID },
                                               include: [
                                                {
                                                    model: db.user,
                                                    attributes: ['userId', 'username', 'userImg'],
                                                    as: 'user'
                                                }
                                            ] });
                                            
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 5. 포스팅이 전체 공개인지 부원 공개인지 확인 후 부원 공개면 부원인지 아닌지 판정
        if( exPost.isPublic === 0 && !memPart ) {
            return res.status(403).send({ success: 403, result: "해당 게시글 열람 권한 없음", user: user, club: exClub });
        }

        // 6. 포스팅에 이미지가 포함되어 있는지 확인 후 있으면 exPost 객체에 추가
        const exPostImg = await db.postImg.findOne({ where: { postId: reqPostID } });

        if (exPostImg) {
            exPost.dataValues.postImg = exPostImg;
        }

        // 7. 포스트와 연동된 comment 객체들의 리스트를 추가
        const commentList = await db.comment.findAll({ order: [['createdAt', 'DESC']],
                                                        where: { postId: reqPostID },
                                                        include: [
                                                            {
                                                                model: db.user,
                                                                attributes: ['userId', 'userName', 'userImg'],
                                                                as: 'user'
                                                            }
                                                        ]});

        // 7. 모든 무결성 검증 후 이상 없으면 프론트에 해당 포스트 데이터 전달
        return res.status(200).send({ success: 200, resultPost: exPost, resultComment: commentList, user: user, club: exClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyImg = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        // 5. 수정하려는 포스팅에 대한 권한을 가지고 있는지 확인
        if (exPost.userId !== parseInt(reqUserID) || exPost.clanId !== parseInt(reqClanID)) {
            return res.status(403).send({ success: 403, result: "해당 게시글 수정 권한 없음", user: user, club: exClub });
        }

        // 6. 모든 무결성 검증 후 postimg 테이블의 이미지 저장 경로 수정
        const imgInfo = await db.postImg.update({
            img: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`,
        }, {where: { postId: reqPostID }} );

        // 8. 프론트로 전달
        return res.status(201).send({
            success: 200,
            result: { imgPath: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`,user: user, club: exClub, post: exPost} });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyPost = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];

    const { postHead, postBody, isPublic, imgPath } = req.body

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        // 5. 수정하려는 포스팅에 대한 권한을 가지고 있는지 확인
        if (exPost.userId !== parseInt(reqUserID) || exPost.clanId !== parseInt(reqClanID)) {
            return res.status(403).send({ success: 403, result: "해당 게시글 수정 권한 없음", user: user, club: exClub });
        }

        if(imgPath) {
            // 6. 없는 이미지 데이터 사용(악의적인 url 사용 방지)
            const exPostImg = await db.postImg.findOne({ where: { img: imgPath } });
            
            if ( !exPostImg ) {
                return res.status(404).send({ success: 404, result: "존재하지 않는 이미지 리소스", user: user, club: exClub });
            }

            // 7. 포스팅하려는 이미지가 내가 권한을 가진 이미지인지 검증
            if ( exPostImg.userId !== parseInt(reqUserID) || exPostImg.clanId !== parseInt(reqClanID) ) {
                return res.status(403).send({ success: 403, result: "해당 이미지 사용 권한 없음", user: user, club: exClub });
            }
        }

        // 8. 잘못된 전체공개, 부원공개 값
        const isPublic = parseInt(req.body.isPublic);
        if (isPublic !== 0 && isPublic !== 1) {
            return res.status(404).send({ success: 404, result: "유효하지 않은 결정", user: user, club: exClub });
        }

        //await db.post.update({ postHead: postHead, postBody: postBody, isPublic: isPublic }, {where: { postId: reqPostID }});

        // 9. 모든 무결성 검증 후 이상 없으면 포스팅 수정
        const postResult = await db.post.update({
            userId: reqUserID,
            clanId: reqClanID,
            postHead: postHead,
            postBody: postBody,
            isPublic: isPublic
        }, {where: { postId: reqPostID }})

        // 10. postimg 테이블의 수정 사항 반영
        if (!imgPath) {
            const pastImg = await db.postImg.findOne({where: { postId: reqPostID }});

            // 11. 과거 이미지파일 삭제
            if(pastImg) {
                const filePath = path.join(__dirname, '../', pastImg.img);
                try {
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error('파일 삭제 중 오류 발생:', err);
                    return res.status(500).send({ success: 500, result: "파일 삭제 중 오류가 발생했습니다.", user: user, club: exClub });
                }
            }
            
            await db.postImg.destroy({where: { postId: reqPostID }});
        } else {
            await db.postImg.update({ img: imgPath }, {where: { postId: reqPostID }});
        }

        const currPost = await db.post.findOne({ where: { postId: reqPostID }, include: [{model: db.postImg, as: 'postimgs',},], });

        // 12. 포스트와 연동된 comment 객체들의 리스트를 추가
        const commentList = await db.comment.findAll({ order: [['createdAt', 'DESC']],
            where: { postId: reqPostID },
            include: [
                {
                    model: db.user,
                    attributes: ['userId', 'userName', 'userImg'],
                    as: 'user'
                }
            ]});

        return res.status(200).send({ success: 200, result: "포스팅 수정 성공", user: user, club: exClub, post: currPost, comment: commentList });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.deletePost = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 5. 삭제하려는 포스팅에 대한 권한을 가지고 있는지 확인(리더는 모든 글 삭제 가능)
        if (exPost.userId !== parseInt(reqUserID) || exPost.clanId !== parseInt(reqClanID)) {
            if(memPart !== 1) {
                return res.status(403).send({ success: 403, result: "해당 게시글 삭제 권한 없음", user: user, club: exClub });
            }
        }

        // 6. 포스팅에 이미지가 포함되어 있는지 확인 후 있으면 postImg 테이블과 이미지 파일 삭제
        const exPostImg = await db.postImg.findOne({ where: { postId: reqPostID } });
        if (exPostImg) {
            await db.postImg.destroy({ where: { postId: reqPostID } });

            // 이미지파일 삭제
            const filePath = path.join(__dirname, '../', exPostImg.img);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('파일 삭제 중 오류 발생:', err);
                return res.status(500).send({ success: 500, result: "파일 삭제 중 오류가 발생했습니다.", user: user, club: exClub });
            }
        }

        await db.post.destroy({ where: { postId: reqPostID } });

        return res.status(200).send({ success: 200, result: "포스팅 삭제 성공", user: user, club: exClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.uploadComment = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];

    const comment = req.body.comment

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 5. 포스팅이 전체 공개인지 부원 공개인지 확인 후 부원 공개면 부원인지 아닌지 판정
        if( exPost.isPublic === 0 && !memPart ) {
            return res.status(403).send({ success: 403, result: "해당 게시글 열람 권한 없음", user: user, club: exClub });
        }

        // 6. 모든 무결성 검증 후 comment 테이블 생성
        const commentResult = await db.comment.create({
            userId: reqUserID,
            // clanId: reqClanID,
            postId: reqPostID,
            comment: comment
        })

        const currPost = await db.post.findOne({ where: { postId: reqPostID }, include: [{model: db.postImg, as: 'postimgs',},], });

        // 7. 포스트와 연동된 comment 객체들의 리스트를 추가
        const commentList = await db.comment.findAll({ order: [['createdAt', 'DESC']],
            where: { postId: reqPostID },
            include: [
                {
                    model: db.user,
                    attributes: ['userId', 'userName', 'userImg'],
                    as: 'user'
                }
            ]});

        return res.status(201).send({ success: 201, result: "댓글 작성 성공", user: user, club: exClub, post: currPost, comment: commentList });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyComment = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];
    const reqCommentID = req.url.split("/")[4];

    const comment = req.body.comment;

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        // 5. 존재하는 댓글인지 확인
        const exComment = await db.comment.findOne({ where: { commentId: reqCommentID } });
        if ( !exComment ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 댓글", user: user, club: exClub, post: exPost });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 6. 포스팅이 전체 공개인지 부원 공개인지 확인 후 부원 공개면 부원인지 아닌지 판정
        if( exPost.isPublic === 0 && !memPart ) {
            return res.status(403).send({ success: 403, result: "해당 게시글 열람 권한 없음", user: user, club: exClub });
        }

        // 7. 수정하려는 댓글에 대한 권한을 가지고 있는지 확인
        if (exComment.userId !== parseInt(reqUserID) || exComment.commentId !== parseInt(reqCommentID)) {
            return res.status(403).send({ success: 403, result: "해당 댓글 수정 권한 없음", user: user, club: exClub, post: exPost });
        }

        // 8. 모든 무결성 검증 후 이상 없으면 포스팅 수정
        const commentResult = await db.comment.update({ comment: comment }, {where: { commentId: reqCommentID }});

        const currPost = await db.post.findOne({ where: { postId: reqPostID }, include: [{model: db.postImg, as: 'postimgs',},], });

        // 9. 포스트와 연동된 comment 객체들의 리스트를 추가
        const commentList = await db.comment.findAll({ order: [['createdAt', 'DESC']],
            where: { postId: reqPostID },
            include: [
                {
                    model: db.user,
                    attributes: ['userId', 'userName', 'userImg'],
                    as: 'user'
                }
            ]});

        return res.status(200).send({ success: 200, result: "댓글 수정 성공", user: user, club: exClub, post: currPost, comment: commentList });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.deleteComment = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqPostID = req.url.split("/")[3];
    const reqCommentID = req.url.split("/")[4];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 존재하는 포스팅인지 확인
        const exPost = await db.post.findOne({ where: { postId: reqPostID } });
        if ( !exPost ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅", user: user, club: exClub });
        }

        // 5. 존재하는 댓글인지 확인
        const exComment = await db.comment.findOne({ where: { commentId: reqCommentID } });
        if ( !exComment ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 댓글", user: user, club: exClub, post: exPost });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 6. 포스팅이 전체 공개인지 부원 공개인지 확인 후 부원 공개면 부원인지 아닌지 판정
        if( exPost.isPublic === 0 && !memPart ) {
            return res.status(403).send({ success: 403, result: "해당 게시글 열람 권한 없음", user: user, club: exClub });
        }

        // 7. 삭제하려는 댓글에 대한 권한을 가지고 있는지 확인(리더는 모든 댓글 삭제 가능 + 포스팅 작성자도 댓글 삭제 가능)
        if (exComment.userId !== parseInt(reqUserID) || exComment.commentId !== parseInt(reqCommentID)) {
            if(memPart !== 1 && exPost.userId !== parseInt(reqUserID)) {
                return res.status(403).send({ success: 403, result: "해당 댓글 삭제 권한 없음", user: user, club: exClub, post: exPost });
            }
        }

        await db.comment.destroy({ where: { commentId: reqCommentID } });

        const currPost = await db.post.findOne({ where: { postId: reqPostID }, include: [{model: db.postImg, as: 'postimgs',},], });

        // 9. 포스트와 연동된 comment 객체들의 리스트를 추가
        const commentList = await db.comment.findAll({ order: [['createdAt', 'DESC']],
            where: { postId: reqPostID },
            include: [
                {
                    model: db.user,
                    attributes: ['userId', 'userName', 'userImg'],
                    as: 'user'
                }
            ]});

        return res.status(200).send({ success: 200, result: "댓글 삭제 성공", user: user, club: exClub, post: currPost, comment: commentList });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}