const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { createClub } = require('../controllers/club');

const router = express.Router();

// POST /club/{user-id}/create-club/fill-info
router.post('/:userId/create-club/fill-info', isLoggedIn, createClub);

module.exports = router;