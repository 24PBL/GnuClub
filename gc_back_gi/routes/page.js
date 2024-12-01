const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { verifyJWT } = require('../middlewares');
const { sendHomeData, sendMoreAdData, sendMoreAnythingData, sendFeedData, sendMypageData, checkApply } = require('../controllers/page');

const router = express.Router();

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

module.exports = router;