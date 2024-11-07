const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderCheckEmail, renderCheckAuthCode, renderFillUserInfo, renderLogin } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    next();
});

router.get('/', renderMain);

router.get('/auth/join/check_email', isNotLoggedIn, renderCheckEmail);

router.get('/auth/join/check_auth_code', isNotLoggedIn, renderCheckAuthCode);

router.get('/auth/join/fill_user_info', isNotLoggedIn, renderFillUserInfo);

router.get('/auth/login', isNotLoggedIn, renderLogin);

module.exports = router;