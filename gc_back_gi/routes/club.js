const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { verifyJWT } = require('../middlewares');
const { afterUploadImage, modifyClubInfo, beforeApply, applyClub, applyList, resumeInfo, decideResume, showMemberList, leaveClub, kickMember, searchClub, createClub } = require('../controllers/club');

const router = express.Router();

try {
    fs.readdirSync('uploads2');
} catch (error) {
    console.error('uploads2 폴더가 없어 uploads2 폴더를 생성합니다.');
    fs.mkdirSync('uploads2');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            //cb(null, 'uploads/');
            const reqUserID = req.url.split("/")[1];
            const reqClanID = req.url.split("/")[2];
            const uploadPath = `uploads2/${reqUserID}/${reqClanID}`;
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    fileFilter(req, file, cb) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        // 허용되지 않는 파일 형식 첨부했을 때
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('허용되지 않는 파일 형식입니다.'));
        }
        cb(null, true);
    },
    // 크기 제한(10MB, 1080 * 1080 px까지로 제한)
    limits: { fileSize: 10 * 1024 * 1024 },
});

const upload2 = multer();

// 동아리 정보 수정 중 이미지 업로드 요청 시 업로드된 이미지에 대한 정보를 클라이언트로 보냄
// POST /club/:userId/:clanId/modify-club-info/upload-image
router.post('/:userId/:clanId/modify-club-info/upload-image', verifyJWT, (req, res, next) => {
        upload.single('img')(req, res, (err) => {
            // 이미지 업로드 실패했을 때
            if (err) {
                console.error(err);
                return res.status(400).send({ error: err.message || '이미지 업로드 실패' });
            }
            next();
        });
    },
    afterUploadImage
);

/*
// 이미지 업로드를 포함하여 최종 동아리 생성 양식을 완성하고 생성하기를 눌렀을 때
// POST /club/:userId/create-club/fill-info/submit
router.post('/:userId/create-club/fill-info/submit', verifyJWT, upload2.none(), createClub);
*/

// 동아리 정보 수정을 위한 라우터
// afterUploadImage로 이미지 수정 이후 동아리 정보 변경하는 서순
// 이미지 변경이 없을 때는 afterUploadImage를 거치지 않고 원래의 clanImg 값을 그대로 보내주면 됨.
// PUT /club/:userId/:clanId/modify-club-info
router.put('/:userId/:clanId/modify-club-info', verifyJWT, upload2.none(), modifyClubInfo);

// 입부 신청 클릭했을 때 입부 신청 가능한지 검증
// GET /club/:userId/:clanId/before-apply
router.get('/:userId/:clanId/before-apply', verifyJWT, beforeApply);

// POST /club/:userId/:clanId/apply-club
router.post('/:userId/:clanId/apply-club', verifyJWT, applyClub);

// GET /club/:userId/:clanId/apply-list
router.get('/:userId/:clanId/apply-list', verifyJWT, applyList);

// GET /club/:userId/:clanId/show-resume/:resumeId
router.get('/:userId/:clanId/show-resume/:resumeId', verifyJWT, resumeInfo);

// POST /club/:userId/:clanId/:resumeId/decide-apply
router.post('/:userId/:clanId/:resumeId/decide-apply', verifyJWT, decideResume);

// GET /club/:userId/:clanId/member-list
router.get('/:userId/:clanId/member-list', verifyJWT, showMemberList);

// DELETE /club/:userId/:clanId/leave-club
router.delete('/:userId/:clanId/leave-club', verifyJWT, leaveClub);

// DELETE /club/:userId/:clanId/:targetId/kick-member
router.delete('/:userId/:clanId/leave-club', verifyJWT, kickMember);

// GET /club/:userId/search-club
router.get('/:userId/:clanId/member-list', verifyJWT, searchClub);

// POST /club/:userId/create-club
router.post('/:userId/create-club', verifyJWT, createClub);

module.exports = router;