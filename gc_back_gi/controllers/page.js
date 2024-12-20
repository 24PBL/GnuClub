// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

exports.sendHomeData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

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

        // 3. 내 동아리 정보
        const myClub = await db.userInClan.findAll({
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // 조인된 clan 데이터 가져오기
                as: 'clan'
            }]
        });

        // 4. 동아리 홍보글 정보
        const randomClubAd = await db.notice.findAll({
            where: {
                isPublic: 1, // isPublic 필터
            },
            include: [{
                model: db.noticeImg, // 연결된 noticeImg 모델 포함
                attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                as: 'noticeimgs',
                required: true, // `INNER JOIN` 효과, `db.noticeImg`가 없는 데이터 제외
            }],
            order: Sequelize.literal('RAND()'), // 랜덤 정렬
            limit: 8, // 최대 8개의 레코드 가져오기
        });

        // 5. 동아리 이모저모 정보
        const randomClubAnything = await db.post.findAll({
            where: {
                isPublic: 1, // isPublic 필터
            },
            include: [{
                model: db.postImg, // 연결된 noticeImg 모델 포함
                attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                as: 'postimgs',
                required: true, // `INNER JOIN` 효과, `db.postImg`가 없는 데이터 제외
            }],
            order: Sequelize.literal('RAND()'), // 랜덤 정렬
            limit: 8, // 최대 8개의 레코드 가져오기
        });

        // 6. 프론트에 보낼 데이터 취합
        const homeData = {
            user: user,
            banner: "/public/default_banner.png",
            myClub: myClub,
            randomClubAd: randomClubAd,
            randomClubAnything: randomClubAnything
        }

        // 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: homeData });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendMoreAdData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

    try {
        // 1. 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, message: "사용자를 찾을 수 없습니다." });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 데이터 조회 및 분과별 그룹화
        const randomClubAd = await db.notice.findAll({
            where: { isPublic: 1 },
            include: [
                {
                    model: db.clan,
                    attributes: ['clanclass'],
                    as: 'clan',
                },
                {
                    model: db.noticeImg,
                    attributes: ['imgId', 'img'],
                    as: 'noticeimgs',
                    required: true, // `INNER JOIN` 효과, `db.noticeImg`가 없는 데이터 제외
                },
            ],
            //order: [['createAt', 'DESC']], // 최신 순으로 정렬
        });

        // 4. 분과별로 데이터 그룹화
        const resultAdData = randomClubAd.reduce((result, ad) => {
            const clanClass = ad.clan?.clanclass || '기타'; // 분과 정보 없으면 '기타'로 설정
            if (!result[clanClass]) {
                result[clanClass] = [];
            }
            if (result[clanClass].length < 6) { // 최대 6개 제한
                result[clanClass].push(ad);
            }
            return result;
        }, {});

        // 5. 결과 반환
        return res.status(200).send({
            success: 200,
            user: user,
            result: resultAdData,
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.sendMoreAnythingData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, message: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, message: "잘못된 접근", user });
        }

        // 3. 모든 게시글 데이터 가져오기
        const allPosts = await db.post.findAll({
            where: {
                isPublic: 1,
            },
            include: [
                {
                    model: db.postImg,
                    attributes: ['imgId', 'img'],
                    as: 'postimgs',
                    required: true,
                },
                {
                    model: db.clan,
                    attributes: ['clanclass'], // 분과 정보 포함
                    as: 'clan',
                },
            ],
            order: Sequelize.literal('RAND()'), // 랜덤 정렬
        });

        // 5. 분과별로 데이터 그룹화
        const resultAnyData = allPosts.reduce((result, post) => {
            const clanClass = post.clan?.clanclass || '기타'; // 분과 정보 없으면 '기타'로 처리
            if (!result[clanClass]) {
                result[clanClass] = [];
            }
            if (result[clanClass].length < 6) { // 각 분과에서 최대 6개 제한
                result[clanClass].push(post);
            }
            return result;
        }, {});

        // 6. 결과 반환
        return res.status(200).send({
            success: 200,
            user: user,
            result: resultAnyData,
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.sendFeedData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

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

        // 3. 내 동아리 정보
        const myClub = await db.userInClan.findAll({
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // 조인된 clan 데이터 가져오기
                as: 'clan'
            }]
        });

        // 4. 내 동아리 피드들 정보를 8개씩 보냄
        const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간

        // 'lastTimestamp' 이후 게시물들
        const myClubFeeds = await db.post.findAll({
            where: {
                createAt: { [Sequelize.Op.gte]: lastTimestamp },
            },
            include: [
                {
                    model: db.clan,
                    as: 'clan',
                    required: true,
                    include: [{
                        model: db.userInClan,
                        where: { userId: reqUserID },
                        required: true,
                        as: 'userinclans'
                    }]
                },
                {
                    model: db.postImg,
                    as: 'postimgs',
                }
            ],
            order: [['createAt', 'DESC']],
        });

        // 'lastTimestamp' 이전 게시물들
        const newMyClubFeeds = await db.post.findAll({
            where: {
                createAt: { [Sequelize.Op.lt]: lastTimestamp },
            },
            include: [
                {
                    model: db.clan,
                    as: 'clan',
                    include: [{
                        model: db.userInClan,
                        where: { userId: reqUserID },
                        required: true,
                        as: 'userinclans'
                    }]
                },
                {
                    model: db.postImg,
                    as: 'postimgs',
                }
            ],
            order: [['createAt', 'DESC']],
            limit: 8,
        });

        // 기존 myClubFeeds와 newMyClubFeeds를 합치기
        const combinedFeeds = myClubFeeds.concat(newMyClubFeeds);

        // 중복된 게시물 제거 (Map을 사용하여 중복 제거)
        const uniqueFeedsMap = new Map();
        combinedFeeds.forEach(feed => {
            uniqueFeedsMap.set(feed.postId, feed); // feed.id를 키로 사용하여 중복을 제거
        });

        // Map에서 값만 추출하여 배열로 변환
        const uniqueFeeds = Array.from(uniqueFeedsMap.values());

        // 5. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: uniqueFeeds, user: user, myClub: myClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.sendMypageData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

    try {
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID },
            include: [{
                model: db.collage, // 조인된 clan 데이터 가져오기
                as: 'collage_collage',
            }]
         });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 내 동아리 정보
        const myClub = await db.userInClan.findAll({
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // 조인된 clan 데이터 가져오기
                as: 'clan',
                include: [
                    {
                        model: db.class_, // clan과 연결된 class 데이터 가져오기
                        as: 'clanclass_class' // class 테이블의 별칭
                    }
                ]
            }]
        });

        const myPageInfo = {
            user: user,
            myClubInfo: myClub
        }

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myPageInfo });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.checkApply = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

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

        const myResumeList = await db.resume.findAll({
            order: [['createAt', 'ASC']],
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // clan 테이블 데이터
                as: 'clan'
            }],
        });

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myResumeList, user: user });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.modifyProfile = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

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

        // 3. 프로필 사진 수정(테이블 수정)
        if(!req.file) {
            res.status(400).send({ success: 400, result: "이미지 없음", user: user });
        } else {
            const imgInfo = await db.user.update({
                userImg: `/uploads3/${reqUserID}/${req.file.filename}`,
            }, {where: { userId: reqUserID }} );
        }

        // 4. 프론트로 전달
        return res.status(200).send({ success: 200, result: "프로필 수정 성공", imgPath: `/uploads3/${reqUserID}/${req.file.filename}`, user: user });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendPostPageData = async (req, res, next) => {
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

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 동아리 부원인지 확인
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        //const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간
        const postList = await db.post.findAll({
            where: {
                clanID: reqClanID,
                //createAt: { [Sequelize.Op.lt]: lastTimestamp }, // lastTimestamp 이전 데이터만 가져오기
            },
            order: [['createAt', 'DESC']], // 최신순 정렬
            //limit: 8, // 한 번에 최대 8개 데이터
        });

        return res.status(200).send({ success: 200, result: postList, user: user, club: exClub, memPart: memPart });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendNoticePageData = async (req, res, next) => {
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

        // 3. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리", user: user });
        }

        // 4. 동아리 부원인지 확인
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });

        //const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간
        const noticeList = await db.notice.findAll({
            where: {
                clanID: reqClanID,
                //createAt: { [Sequelize.Op.lt]: lastTimestamp }, // lastTimestamp 이전 데이터만 가져오기
            },
            order: [['createAt', 'DESC']], // 최신순 정렬
            //limit: 8, // 한 번에 최대 8개 데이터
        });

        return res.status(200).send({ success: 200, result: noticeList, user: user, club: exClub, memPart: memPart });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}
