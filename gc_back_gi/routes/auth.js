const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn, verifyJWT } = require('../middlewares');
const { verifyLoginStatus, check_email, check_auth_code, fill_user_info, check_email_4_fpw, check_auth_code_4_fpw, modify_user_pw, login, logout } = require('../controllers/auth');

const router = express.Router();

// GET /auth/verify-login-status
router.get('/verify-login-status', verifyLoginStatus);

// POST /auth/join/check-email
router.post('/join/check-email', isNotLoggedIn, check_email);

// POST /auth/join/check-auth-code
router.post('/join/check_auth_code', isNotLoggedIn, check_auth_code);

// POST /auth/join/fill-user-info
router.post('/join/fill-user-info', isNotLoggedIn, fill_user_info);

// POST /auth/find-password/check-email-4-fpw
router.post('/find-password/check-email-4-fpw', isNotLoggedIn, check_email_4_fpw);

// POST /auth/find-password/check-auth-code-4-fpw
router.post('/find-password/check-auth-code-4-fpw', isNotLoggedIn, check_auth_code_4_fpw);

// PUT /auth/find-password/modify-password
router.post('/find-password/modify-password', isNotLoggedIn, modify_user_pw);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', verifyJWT, logout);

module.exports = router;