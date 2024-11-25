const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { createClub, applyClub, applyList, resumeInfo, decideResume } = require('../controllers/club');

const router = express.Router();

// POST /club/:userId/create-club/fill-info
router.post('/:userId/create-club/fill-info', isLoggedIn, createClub);

// POST /club/:userId/:clanId/apply-club
router.post('/:userId/:clanId/apply-club', isLoggedIn, applyClub);

// GET /club/:userId/:clanId/apply-list
router.get('/:userId/:clanId/apply-list', isLoggedIn, applyList);

// GET /club/:userId/:clanId/show-resume/:resumeId
router.get('/:userId/:clanId/show-resume/:resumeId', isLoggedIn, resumeInfo);

// POST /club/:userId/:clanId/:resumeId/decide-apply
router.post('/:userId/:clanId/:resumeId/decide-apply', isLoggedIn, decideResume);

module.exports = router;