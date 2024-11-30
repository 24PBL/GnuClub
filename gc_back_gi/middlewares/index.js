const jwt = require('jsonwebtoken');
const db = require('../models/db');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

/*
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        //res.redirect(`\?error=${message}`);
        res.status(200).send(message);
    }
};
*/

// JWT 검증 미들웨어
exports.verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ success: false, message: 'Access Token이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <토큰>

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // 유효하면 사용자 정보 저장
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ success: false, message: 'Access Token이 만료되었습니다.' });
        }
        return res.status(401).send({ success: false, message: '유효하지 않은 Access Token입니다.' });
    }
};

// JWT 기반 isNotLoggedIn 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(); // Access Token이 없으면 비로그인 상태로 간주
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, SECRET_KEY);
        // Access Token이 유효하면 로그인 상태로 간주
        return res.status(403).send({ success: false, message: '이미 로그인한 상태입니다.' });
    } catch (err) {
        return next(); // Access Token이 없거나 유효하지 않으면 비로그인 상태
    }
};