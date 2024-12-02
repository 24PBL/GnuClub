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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
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
                as: 'noticeimgs'
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
                as: 'postimgs'
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리 홍보글 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음)
        let selectedIds = [];   // 이미 선택된 ID를 저장하는 배열

        const randomClubAd = await db.notice.findAll({
            where: {
                isPublic: 1,
                id: { [Sequelize.Op.notIn]: selectedIds }, // 이전에 선택된 ID 제외
            },
            include: [{
                model: db.noticeImg, // 연결된 noticeImg 모델 포함
                attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                as: 'noticeimgs'
            }],
            order: Sequelize.literal('RAND()'),
            limit: 8,
        });

        // 선택된 ID를 저장
        selectedIds.push(...randomClubAd.flatMap(feed => 
            feed.clan.posts.map(post => post.id)
        ));

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: randomClubAd, userImg: user.userImg });
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 동아리 이모저모 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음)
        let selectedIds = [];   // 이미 선택된 ID를 저장하는 배열

        const randomClubAnything = await db.post.findAll({
            where: {
                isPublic: 1,
                id: { [Sequelize.Op.notIn]: selectedIds }, // 이전에 선택된 ID 제외
            },
            include: [{
                model: db.postImg, // 연결된 postImg 모델 포함
                attributes: ['imgId', 'img'], // 필요한 필드만 가져오기
                as: 'postimgs'
            }],
            order: Sequelize.literal('RAND()'),
            limit: 8,
        });

        // 선택된 ID를 저장
        selectedIds.push(...randomClubAnything.flatMap(feed => 
            feed.clan.posts.map(post => post.id)
        ));

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: randomClubAnything, userImg: user.userImg });
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 내 동아리 피드들 정보를 8개씩 보냄(8개 안되면 되는만큼 보내짐, 중복 안되도록 해놓음)
        let selectedIds = [];   // 이미 선택된 ID를 저장하는 배열

        const myClubFeeds = await db.userInClan.findAll({
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // clan 테이블 데이터
                include: [{
                    model: db.post, // clan과 연결된 post 테이블 데이터
                    as: 'posts',
                    where: {
                        id: { [Sequelize.Op.notIn]: selectedIds }, // 중복 방지 조건
                    },
                    include: [{
                        model: db.postImg, // post와 연결된 postImg 테이블 데이터
                        as: 'postimgs'
                    }]
                }]
            }],
            order: Sequelize.literal('RAND()'),
            limit: 8,
        });

        // 선택된 ID를 저장
        selectedIds.push(...myClubFeeds.flatMap(feed => 
            feed.clan.posts.map(post => post.id)
        ));

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myClubFeeds, userImg: user.userImg });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.sendMypageData = async (req, res, next) => {
    const reqUserID = req.url.split("/")[2];

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

        // 3. 내 동아리 정보
        const myClub = await db.userInClan.findAll({
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // 조인된 clan 데이터 가져오기
                as: 'clan'
            }]
        });

        const myPageIngo = {
            user: user,
            myClubInfo: myClub
        }

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myPageIngo });
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        const myResumeList = await db.resume.findAll({
            order: [['createdAt', 'ASC']],
            where: { userId: reqUserID },
            include: [{
                model: db.clan, // clan 테이블 데이터
                as: 'clan'
            }],
        });

        // 4. 프론트에 데이터 전송
        return res.status(200).send({ success: 200, result: myResumeList });
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
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        // 3. 프로필 사진 수정(테이블 수정)
        if(!req.file) {
            res.status(400).send({ success: 400, result: "이미지 없음" });
        } else {
            const imgInfo = await db.user.update({
                userImg: `/uploads3/${reqUserID}/${req.file.filename}`,
            }, {where: { userId: reqUserID }} );
        }

        // 4. 프론트로 전달
        return res.status(200).send({ success: 200, result: "프로필 수정 성공", imgPath: `/uploads3/${reqUserID}/${req.file.filename}` });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}