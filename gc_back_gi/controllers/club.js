// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

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

        // 3. 이미지 저장 경로 작성
        const imgPath = `/uploads2/${reqUserID}/${req.file.filename}`

        // 4. 프론트로 전달
        return res.status(201).send({
            success: 201,
            result: { img: req.file, imgPath: imgPath },
        });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.createClub = async (req, res, next) => {
    let { clanName, clanIntro, clanclass, imgPath, recruitPeriod, people, fee, interview } = req.body;
    try {
        // 요청 url에서 user-id 추출
        const reqUserID = req.url.split("/")[1];
        const user = await db.user.findOne({ where: { userId: reqUserID } });
        if (!user) {
            return res.status(404).send({ success: 404, result: "사용자를 찾을 수 없습니다" });
        }

        if (user.userId.toString() !== req.user.id.toString()) {
            return res.status(401).send({ success: 401, result: "잘못된 접근" });
        }

        if ( imgPath ) {
            const imgOwner = imgPath.split("/")[1];

            if (reqUserID.toString() !== imgOwner.toString()) {
                return res.status(403).send({ success: 403, result: "해당 이미지 사용 권한 없음" });
            }
        } else {
            imgPath = "/public/default_club_image.png"
        }

        const newClub = await db.clan.create({
            clanName: clanName,
            clanIntro: clanIntro,
            clanclass: clanclass,
            clanImg: imgPath || "/public/default_club_image.png",
            recruitPeriod: recruitPeriod,
            people: people,
            fee: fee,
            interview: interview
        });

        await db.userInClan.create({
            userId: reqUserID,
            clanId: newClub.clanId,
            part: 0
        });

        return res.status(201).send({ success: 201, result: "동아리 생성 성공" });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.modifyClubInfo = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];

    const { recruitPeriod, people, fee, interview } = req.body

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

        // 4. 해당 동아리의 리더인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "리더만 수정 가능." });
        }
        if (memPart.part !== 0) {
            return res.status(403).send({ success: 403, result: "리더만 수정 가능." });
        }

        // 9. 모든 무결성 검증 후 이상 없으면 포스팅 수정
        const postResult = await db.post.update({
            recruitPeriod: recruitPeriod,
            people: people,
            fee: fee,
            interview: interview
        }, {where: { clanId: reqClanID }})

        return res.status(200).send({ success: 200, result: "동아리 정보 수정 성공" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
}

exports.beforeApply = async (req, res, next) => {
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

        // 3. 해당 사용자가 이미 동아리에 가입되어 있는지 확인
        const exMember = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (exMember) {
            return res.status(403).send({ success: 403, result: "이미 가입된 회원" });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 이미 신청서를 제출한 회원인지 확인
        const exResume = await db.resume.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (exResume) {
            return res.status(403).send({ success: 403, result: "이미 제출함. 승인 대기 중" });
        }

        return res.status(200).send({ success: 200, result: "입부 신청 가능" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.applyClub = async (req, res, next) => {
    const { etc } = req.body;

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

        // 3. 해당 사용자가 이미 동아리에 가입되어 있는지 확인
        const exMember = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (exMember) {
            return res.status(403).send({ success: 403, result: "이미 가입된 회원" });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 이미 신청서를 제출한 회원인지 확인
        const exResume = await db.resume.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (exResume) {
            return res.status(403).send({ success: 403, result: "이미 제출함. 승인 대기 중" });
        }


        // 6. 입부신청 완료
        await db.resume.create({
            userId: reqUserID,
            clanId: reqClanID,
            userName: user.userName,
            collage: user.collage,
            userLesson: user.userLesson,
            userPhone: user.userPhone,
            etc: etc
        });

        return res.status(201).send({ success: 201, result: "입부 신청 완료" });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.applyList = async (req, res, next) => {
    const { etc } = req.body;

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

        // 3. 해당 동아리의 리더인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "리더만 볼 수 있음." });
        }
        if (memPart.part !== 0) {
            return res.status(403).send({ success: 403, result: "리더만 볼 수 있음." });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 신청서 리스트 데이터를 보냄(오래된 것부터 정렬)
        const resumeList = await db.resume.findAll({ order: [['createdAt', 'ASC']], where: { clanId: reqClanID } });

        // 모든 userId를 한 번에 추출
        const userIds = resumeList.map((resume) => resume.userId);

        // user 데이터를 한 번에 조회
        const userInfoMap = await db.user.findAll({
            where: { userId: userIds },
            attributes: ['userId', 'userImg'],
        }).then((users) => {
        // userId를 키로, userImg를 값으로 매핑
            return users.reduce((map, user) => {
                map[user.userId] = user.userImg;
                return map;
                }, {});
        });

        // userImg를 resume 객체에 추가
        resumeList.forEach((resume) => {
            resume.userImg = userInfoMap[resume.userId] || null; // 이미지가 없을 경우 null
        });

        return res.status(200).send({ success: 200, result: resumeList });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.resumeInfo = async (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const resumeID = req.url.split("/")[4];

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

        // 3. 해당 동아리의 리더인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "리더만 볼 수 있음." });
        }
        if (memPart.part !== 0) {
            return res.status(403).send({ success: 403, result: "리더만 볼 수 있음." });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 존재하는 신청서인지 확인
        const resume = await db.resume.findOne({ where: { clanId: reqClanID, idx: resumeID } });
        if (!resume) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 신청서" });
        }

        // 6. 입부 신청서 상세 정보를 위한 데이터 전송
        return res.status(200).send({ success: 200, result: resume });
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};

exports.decideResume = async (req, res, next) => {
    // 승인은 1, 거절은 2
    const { decision } = req.body;

    const reqUserID = req.url.split("/")[1];
    const reqClanID = req.url.split("/")[2];
    const resumeID = req.url.split("/")[3];

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

        // 3. 해당 동아리의 리더인지 검증
        const memPart = await db.userInClan.findOne({
            where: { [Op.and]: [{ userId: reqUserID }, { clanId: reqClanID }] },
        });
        if (!memPart) {
            return res.status(403).send({ success: 403, result: "리더만 승인 가능" });
        }
        if (memPart.part !== 0) {
            return res.status(403).send({ success: 403, result: "리더만 승인 가능" });
        }

        // 4. 동아리가 존재하는지 확인
        const exClub = await db.clan.findOne({ where: { clanId: reqClanID } });
        if (!exClub) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 동아리" });
        }

        // 5. 존재하는 신청서인지 확인
        const resume = await db.resume.findOne({ where: { clanId: reqClanID, idx: resumeID } });
        if (!resume) {
            return res.status(404).send({ success: 404, result: "존재하지 않는 신청서" });
        }

        // 6. 리더의 결정에 따라 승인 또는 거절
        if (parseInt(decision) === 1) {
            await db.userInClan.create({
                userId: resume.userId,
                clanId: resume.clanId,
                part: 3
            });

            //await db.resume.destroy({ where: { idx: resumeID } });
            await db.resume.update({result: 1}, {where: { idx: resumeID }})

            return res.status(200).send({ success: 201, result: "입부 승인" });
        } else if (parseInt(decision) === 2) {
            //await db.resume.destroy({ where: { idx: resumeID } });
            await db.resume.update({result: 2}, {where: { idx: resumeID }})

            return res.status(200).send({ success: 200, result: "입부 거절" });
        } else {
            return res.status(404).send({ success: 404, result: "유효하지 않은 결정" });
        }
    } catch (error) {
        console.error(error);
        return next(error); // Express 에러 핸들러로 전달
    }
};