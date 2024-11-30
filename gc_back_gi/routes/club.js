const express = require('express');

const { isLoggedIn, verifyJWT } = require('../middlewares');
const { createClub, applyClub, applyList, resumeInfo, decideResume } = require('../controllers/club');

const router = express.Router();

// POST /club/:userId/create-club/fill-info
router.post('/:userId/create-club/fill-info', verifyJWT, createClub);

// POST /club/:userId/:clanId/apply-club
router.post('/:userId/:clanId/apply-club', verifyJWT, applyClub);

// GET /club/:userId/:clanId/apply-list
router.get('/:userId/:clanId/apply-list', verifyJWT, applyList);

// GET /club/:userId/:clanId/show-resume/:resumeId
router.get('/:userId/:clanId/show-resume/:resumeId', verifyJWT, resumeInfo);

// POST /club/:userId/:clanId/:resumeId/decide-apply
router.post('/:userId/:clanId/:resumeId/decide-apply', verifyJWT, decideResume);

module.exports = router;