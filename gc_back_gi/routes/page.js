const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { verifyJWT } = require('../middlewares');
const { sendHomeData, sendMoreAdData, sendMoreAnythingData, sendFeedData, sendMypageData, checkApply, modifyProfile, sendPostPageData, sendNoticePageData } = require('../controllers/page');

const router = express.Router();

try {
    fs.readdirSync('uploads3');
} catch (error) {
    console.error('uploads3 폴더가 없어 uploads3 폴더를 생성합니다.');
    fs.mkdirSync('uploads3');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            //cb(null, 'uploads/');
            const reqUserID = req.url.split("/")[2];
            const uploadPath = `uploads3/${reqUserID}`;
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

// 유저의 메인 페이지 렌더링을 위해 데이터를 전송
// GET /page/home/:userId
router.get('/home/:userId', verifyJWT, sendHomeData);

// 메인 페이지에서 동아리 홍보글 더보기를 클릭했을 때
// GET /page/home/:userId/more-club-ad
router.get('/home/:userId/more-club-ad', verifyJWT, sendMoreAdData);

// 메인 페이지에서 동아리 이모저모 더보기를 클릭했을 때
// GET /page/home/:userId/more-club-anything
router.get('/home/:userId/more-club-anything', verifyJWT, sendMoreAnythingData);

// 네비바에서 피드 탭을 선택했을 때
// GET /page/feed/:userId
router.get('/feed/:userId', verifyJWT, sendFeedData);

// 네비바에서 마이페이지 탭을 선택했을 때
// GET /page/mypage/:userId
router.get('/mypage/:userId', verifyJWT, sendMypageData);

// 마이페이지 탭에서 신청내역 확인을 선택했을 때
// GET /page/check-apply/:userId
router.get('/check-apply/:userId', verifyJWT, checkApply);

// 마이페이지에서 프로필 사진 수정
// PUT /page/modify-profile/:userId
router.put('/modify-profile/:userId', verifyJWT, (req, res, next) => {
        upload.single('img')(req, res, (err) => {
            // 이미지 업로드 실패했을 때
            if (err) {
                console.error(err);
                return res.status(400).send({ error: err.message || '이미지 업로드 실패' });
            }
            next();
        });
    },
    modifyProfile
);

// 게시판 글들을 포함한 동아리 메인 페이지를 제공(동아리 정보도 함께 포함) - ?lastTimestamp=값 해서 쿼리문 보내주셔야 해요
// GET /page/:userId/:clanId/club/post
router.get('/:userId/:clanId/club/post', verifyJWT, sendPostPageData);

// 공지사항 글들을 포함한 동아리 메인 페이지를 제공(동아리 정보도 함께 포함) - ?lastTimestamp=값 해서 쿼리문 보내주셔야 해요
// GET /page/:userId/:clanId/club/notice
router.get('/:userId/:clanId/club/notice', verifyJWT, sendNoticePageData);

module.exports = router;