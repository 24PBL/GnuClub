const passport = require('passport');
const local = require('./localStrategy');
//const kakao = require('./kakaoStrategy');
const db = require('../models/db');

module.exports = () => {
    // 로그인 시 실행됨
    /*
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    // 요청이 있을 때마다 실행됨. passport.session 미들웨어가 이 메소드를 호출함.
    passport.deserializeUser((id, done) => {
        // db.user.findOne({ where: { email } })
        db.user.findOne({ where:{userId: id} })
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    */
    local();
    //kakao();
};