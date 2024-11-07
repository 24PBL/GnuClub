const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { check_email, check_auth_code, fill_user_info, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join/check_email
router.post('/join/check_email', isNotLoggedIn, check_email);

// POST /auth/join/check_auth_code
router.post('/join/check_auth_code', isNotLoggedIn, check_auth_code);

// POST /auth/join/fill_user_info
router.post('/join/fill_user_info', isNotLoggedIn, fill_user_info);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

module.exports = router;