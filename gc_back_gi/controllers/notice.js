const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');


// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');

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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 해당 동아리의 부원인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "부원만 작성할 수 있음" });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 이미지 저장 경로와 작성자, 동아리 Id를 noticeimg 테이블에 저장
        const imgInfo = await db.noticeImg.create({
            img: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`,
            userId: reqUserID,
            clanId: reqClanID
        });

        // 6. 프론트로 전달
        return res.status(201).send({
            success: 201,
            result: { img: req.file, imgPath: imgInfo.img },
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.uploadNotice = async (req, res, next) => {
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 해당 동아리의 부원인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "부원만 작성할 수 있음" });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 없는 이미지 데이터 사용(악의적인 url 사용 방지)
        const imgPath = req.body.imgPath;
        const exNoticeImg = await db.noticeImg.findOne({ where: { img: imgPath } });
        if ( !exNoticeImg ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 이미지 리소스" });
        }

        // 6. 포스팅하려는 이미지가 내가 권한을 가진 이미지인지 검증
        if ( exNoticeImg.userId !== parseInt(reqUserID) || exNoticeImg.clanId !== parseInt(reqClanID) ) {
            return res.status(403).send({ success: 403, result: "해당 이미지 사용 권한 없음" });
        }

        // 7. 잘못된 전체공개, 부원공개 값
        const isPublic = parseInt(req.body.isPublic);
        if (isPublic !== 0 && isPublic !== 1) {
            return res.status(404).send({ success: 404, result: "유효하지 않은 결정" });
        }

        // 8. 모든 무결성 검증 후 notice 테이블 생성
        const noticetResult = await db.notice.create({
            userId: reqUserID,
            clanId: reqClanID,
            postHead: req.body.postHead,
            postBody: req.body.postBody,
            isPublic: req.body.isPublic
        })

        // 9. noticeimg 테이블의 noticeId 값을 배정
        if (!imgPath) {
            return res.status(200).send({ success: 200, result: "포스팅 성공" });
        } else {
            await db.noticeImg.update({noticeId: noticetResult.noticeId}, {where: { img: imgPath }});
        }

        return res.status(200).send({ success: 200, result: "포스팅 성공" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendNoticeData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqNoticeID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 4. 존재하는 포스팅인지 확인
        const exNotice = await db.notice.findOne({ where: { noticeId: reqNoticeID },
                                                   include: [
                                                    {
                                                        model: db.user,
                                                        attributes: ['userId', 'username', 'userImg']
                                                    }
                                                ] });

        if ( !exNotice ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅" });
        }

        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        // 5. 포스팅이 전체 공개인지 부원 공개인지 확인 후 부원 공개면 부원인지 아닌지 판정
        if( exNotice.isPublic === 0 && !memPart ) {
            return res.status(403).send({ success: 403, result: "해당 게시글 열람 권한 없음" });
        }

        // 6. 포스팅에 이미지가 포함되어 있는지 확인 후 있으면 exNotice 객체에 추가
        const exNoticeImg = await db.noticeImg.findOne({ where: { noticeId: reqNoticeID } });

        if (exNoticeImg) {
            exNotice.dataValues.noticeImg = exNoticeImg;
        }

        // 7. 모든 무결성 검증 후 이상 없으면 프론트에 해당 포스트 데이터 전달
        return res.status(200).send({ success: 200, result: exNotice });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyImg = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqNoticeID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 4. 존재하는 포스팅인지 확인
        const exNotice = await db.notice.findOne({ where: { noticeId: reqNoticeID } });
        if ( !exNotice ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅" });
        }

        // 5. 수정하려는 포스팅에 대한 권한을 가지고 있는지 확인
        if (exNotice.userId !== parseInt(reqUserID) || exNotice.clanId !== parseInt(reqClanID)) {
            return res.status(403).send({ success: 403, result: "해당 게시글 수정 권한 없음" });
        }

        // 6. 과거 이미지 정보 임시 저장
        const pastNoticeImg = await db.noticeImg.findOne({ where: { noticeId: reqNoticeID } });

        // 7. 모든 무결성 검증 후 noticeimg 테이블의 이미지 저장 경로 수정
        const imgInfo = await db.noticeImg.update({
            img: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`,
        }, {where: { noticeId: reqNoticeID }} );

        // 8. 프론트로 전달
        return res.status(201).send({
            success: 200,
            result: { img: req.file, imgPath: `/uploads/${reqUserID}/${reqClanID}/${req.file.filename}`, pastImgPath: pastNoticeImg.img },
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyNotice = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqNoticeID = req.url.split("/")[3];

    const { postHead, postBody, isPublic, pastImgPath } = req.body

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 4. 존재하는 포스팅인지 확인
        const exNotice = await db.notice.findOne({ where: { noticeId: reqNoticeID } });
        if ( !exNotice ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅" });
        }

        // 5. 수정하려는 포스팅에 대한 권한을 가지고 있는지 확인
        if (exNotice.userId !== parseInt(reqUserID) || exNotice.clanId !== parseInt(reqClanID)) {
            return res.status(403).send({ success: 403, result: "해당 게시글 수정 권한 없음" });
        }

        // 6. 없는 이미지 데이터 사용(악의적인 url 사용 방지)
        const imgPath = req.body.imgPath;
        const exNoticeImg = await db.noticeImg.findOne({ where: { img: imgPath } });
        if ( !exNoticeImg ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 이미지 리소스" });
        }

        // 7. 포스팅하려는 이미지가 내가 권한을 가진 이미지인지 검증
        if ( exNoticeImg.userId !== parseInt(reqUserID) || exNoticeImg.clanId !== parseInt(reqClanID) ) {
            return res.status(403).send({ success: 403, result: "해당 이미지 사용 권한 없음" });
        }

        // 8. 잘못된 전체공개, 부원공개 값
        const isPublic = parseInt(req.body.isPublic);
        if (isPublic !== 0 && isPublic !== 1) {
            return res.status(404).send({ success: 404, result: "유효하지 않은 결정" });
        }

        // 9. 모든 무결성 검증 후 이상 없으면 포스팅 수정
        const noticeResult = await db.notice.update({
            userId: reqUserID,
            clanId: reqClanID,
            postHead: postHead,
            postBody: postBody,
            isPublic: isPublic
        }, {where: { noticeId: reqNoticeID }})

        // 10. noticeimg 테이블의 수정 사항 반영
        if (!imgPath) {
            await db.noticeImg.destroy({where: { noticeId: reqNoticeID }});
        } else {
            await db.noticeImg.update({ img: imgPath }, {where: { noticeId: reqNoticeID }});
        }

        // 11. 과거 이미지파일 삭제
        if(pastImgPath) {
            const filePath = path.join(__dirname, '../', pastImgPath);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('파일 삭제 중 오류 발생:', err);
                return res.status(500).send({ success: 500, result: "파일 삭제 중 오류가 발생했습니다." });
            }
        }

        return res.status(200).send({ success: 200, result: "포스팅 수정 성공" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.deleteNotice = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const reqNoticeID = req.url.split("/")[3];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 4. 존재하는 포스팅인지 확인
        const exNotice = await db.notice.findOne({ where: { noticeId: reqNoticeID } });
        if ( !exNotice ) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 포스팅" });
        }

        // 5. 삭제하려는 포스팅에 대한 권한을 가지고 있는지 확인
        if (exNotice.userId !== parseInt(reqUserID) || exNotice.clanId !== parseInt(reqClanID)) {
            return res.status(403).send({ success: 403, result: "해당 게시글 삭제 권한 없음" });
        }

        // 6. 포스팅에 이미지가 포함되어 있는지 확인 후 있으면 noticeImg 테이블과 이미지 파일 삭제
        const exNoticeImg = await db.noticeImg.findOne({ where: { noticeId: reqNoticeID } });
        if (exNoticeImg) {
            await db.noticeImg.destroy({ where: { noticeId: reqNoticeID } });

            // 이미지파일 삭제
            const filePath = path.join(__dirname, '../', exNoticeImg.img);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('파일 삭제 중 오류 발생:', err);
                return res.status(500).send({ success: 500, result: "파일 삭제 중 오류가 발생했습니다." });
            }
        }

        await db.notice.destroy({ where: { noticeId: reqNoticeID } });

        return res.status(200).send({ success: 200, result: "포스팅 삭제 성공" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}