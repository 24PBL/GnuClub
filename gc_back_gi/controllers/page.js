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
        // 1. 요청 사용자 정보 가져오기
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        // 2. 현재 로그인한 사용자와 일치 여부 확인
        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근", user: user });
        }

        // 3. 동아리 홍보글 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음)
        const { selectedIds = [] } = req.body; // 클라이언트에서 전송된 selectedIds

        const randomClubAd = await db.notice.findAll({
            where: {
                isPublic: 1,
                id: { [Sequelize.Op.notIn]: selectedIds }, // 이전에 선택된 ID 제외
            },
            include: [
                {
                    model: db.clan,
                    attributes: ['clanclass'],
                    as: 'clan',
                },
                {
                    model: db.noticeImg, // 연결된 noticeImg 모델 포함
                    attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                    as: 'noticeimgs',
                    required: true, // `INNER JOIN` 효과, `db.noticeImg`가 없는 데이터 제외
                }
            ],
            group: ['clan.clanclass', 'notice.noticeId'], // 분과별로 그룹화해서 가져옴
            order: Sequelize.literal('RAND()'),
            limit: 12,
        });

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: randomClubAd, user: user });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendMoreAnythingData = async (req, res, next) => {
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

        // 3. 동아리 이모저모 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음)
        const { selectedIds = [] } = req.body; // 클라이언트에서 전송된 selectedIds

        const randomClubAnything = await db.post.findAll({
            where: {
                isPublic: 1,
                id: { [Sequelize.Op.notIn]: selectedIds }, // 이전에 선택된 ID 제외
            },
            include: [{
                model: db.postImg, // 연결된 postImg 모델 포함
                attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                as: 'postimgs',
                required: true, // `INNER JOIN` 효과, `db.postImg`가 없는 데이터 제외
            }],
            order: Sequelize.literal('RAND()'),
            limit: 8,
        });

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: randomClubAnything, user: user });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

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

        // 3. 내 동아리 피드들 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음) - 항상 8개를 보장하지는 못함(역필터링이라서), 프론트에서 length를 통해 적절히 렌더링
        const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간
        const myClubFeeds = await db.post.findAll({
            where: {
                createAt: { [Sequelize.Op.lt]: lastTimestamp }, // 조건: 특정 시간 이전 게시물
            },
            include: [
                {
                    model: db.clan, // post -> clan
                    as: 'clan',
                    include: [{
                        model: db.userInClan, // clan -> userInClan
                        where: { userId: reqUserID }, // 사용자가 속한 동아리
                        required: true, // 반드시 userInClan 조건을 만족해야 함
                        as: 'userinclans'
                    }]
                },
                {
                    model: db.postImg, // post -> postImg
                    as: 'postimgs',
                }
            ],
            order: [['createAt', 'DESC']], // 최신순 정렬
            limit: 8, // 최대 8개의 게시물
        });

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myClubFeeds, user: user, myClub: myClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

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

        const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간
        const postList = await db.post.findAll({
            where: {
                clanID: reqClanID,
                createAt: { [Sequelize.Op.lt]: lastTimestamp }, // lastTimestamp 이전 데이터만 가져오기
            },
            order: [['createAt', 'DESC']], // 최신순 정렬
            limit: 8, // 한 번에 최대 8개 데이터
        });

        return res.status(200).send({ success: 200, result: postList, user: user, club: exClub });
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

        const lastTimestamp = req.query.lastTimestamp || new Date().toISOString(); // 기본값: 현재 시간
        const noticeList = await db.notice.findAll({
            where: {
                clanID: reqClanID,
                createAt: { [Sequelize.Op.lt]: lastTimestamp }, // lastTimestamp 이전 데이터만 가져오기
            },
            order: [['createAt', 'DESC']], // 최신순 정렬
            limit: 8, // 한 번에 최대 8개 데이터
        });

        return res.status(200).send({ success: 200, result: noticeList, user: user, club: exClub });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}
