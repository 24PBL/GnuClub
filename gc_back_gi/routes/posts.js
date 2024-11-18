const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/posts');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // 크기 제한(10MB, 1920 * 1080 px까지로 제한)
    limits: { fileSize: 10 * 1920 * 1080 },
});

// 글 작성 중 이미지 업로드 요청 시 업로드된 이미지에 대한 정보를 클라이언트로 보냄
// POST /posts/{user-id}/{clan-id}/create-post/upload-images
router.post('/:user-id/:clan-id/create-post/upload-image', isLoggedIn, upload.array('many'), afterUploadImage);

// 이미지 업로드를 포함하여 최종 글 작성을 완료하고 게시 버튼을 눌렀을 때 포스팅을 완료시키는 라우터
// POST /posts/{user-id}/{clan-id}/create-post/upload-post
router.post('/:user-id/:clan-id/create-post/upload-post', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;