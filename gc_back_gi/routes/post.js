const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { beforePost, afterUploadImage, uploadPost, sendPostData, modifyImg, modifyPost, deletePost, uploadComment, modifyComment, deleteComment } = require('../controllers/post');
const { isLoggedIn, verifyJWT } = require('../middlewares');

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
            //cb(null, 'uploads/');
            const reqUserID = req.url.split("/")[1];
            const reqClanID = req.url.split("/")[2];
            const uploadPath = `uploads/${reqUserID}/${reqClanID}`;
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

// 게시글 작성 버튼 눌렀을 때 게시글 작성 가능한지 검증
// GET /post/:userId/:clanId/before-post
router.get('/:userId/:clanId/before-post', verifyJWT, beforePost);

// 글 작성 중 이미지 업로드 요청 시 업로드된 이미지에 대한 정보를 클라이언트로 보냄
// POST /post/:userId/:clanId/create-post/upload-image
router.post('/:userId/:clanId/create-post/upload-image', verifyJWT, (req, res, next) => {
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

// 이미지 업로드를 포함하여 최종 글 작성을 완료하고 게시 버튼을 눌렀을 때 포스팅을 완료시키는 라우터
// POST /post/:userId/:clanId/create-post/upload-post
router.post('/:userId/:clanId/create-post/upload-post', verifyJWT, upload2.none(), uploadPost);

// 게시글 하나를 클릭했을 때 해당 게시글 페이지를 렌더링하기 위한 데이터들을 제공
// GET /post/:userId/:clanId/:postId
router.get('/:userId/:clanId/:postId', verifyJWT, sendPostData);

// 게시글 수정 과정에서 이미지 수정
// PUT /post/:userId/:clanId/:postId/modify-image
router.put('/:userId/:clanId/:postId/modify-image', verifyJWT, (req, res, next) => {
        upload.single('img')(req, res, (err) => {
            // 이미지 업로드 실패했을 때
            if (err) {
                console.error(err);
                return res.status(400).send({ error: err.message || '이미지 업로드 실패' });
            }
            next();
        });
    },
    modifyImg
);

// 포스팅 수정을 위한 라우터
// PUT /post/:userId/:clanId/:postId/modify-post
router.put('/:userId/:clanId/:postId/modify-post', verifyJWT, upload2.none(), modifyPost);

// 포스팅을 삭제하는 라우터
// delete /post/:userId/:clanId/:postId/delete-post
router.delete('/:userId/:clanId/:postId/delete-post', verifyJWT, deletePost);

// 댓글 작성 라우터
// POST /post/:userId/:clanId/:postId/upload-comment
router.post('/:userId/:clanId/:postId/upload-comment', verifyJWT, upload2.none(), uploadComment);

// 댓글 수정을 위한 라우터
// PUT /post/:userId/:clanId/:postId/:commentId/modify-comment
router.put('/:userId/:clanId/:postId/:commentId/modify-comment', verifyJWT, upload2.none(), modifyComment);

// 댓글을 삭제하는 라우터
// delete /post/:userId/:clanId/:postId/delete-comment
router.delete('/:userId/:clanId/:postId/:commentId/delete-comment', verifyJWT, deleteComment);

module.exports = router;