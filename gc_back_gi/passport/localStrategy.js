const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const db = require('../models/db');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userEmail',
        passwordField: 'userPassword',
        passReqToCallback: false,
    }, async (userEmail, userPassword, done) => {
        try {
            const exUser = await db.user.findOne({ where: { userEmail } });
            if (exUser) {
                const result = await bcrypt.compare(userPassword, exUser.userPassword);
                if (result) {
                    // Access Token 생성
                    const accessToken = jwt.sign(
                        { id: exUser.userId, email: exUser.userEmail },
                        SECRET_KEY,
                        { expiresIn: '365d' }
                    );
                    return done(null, exUser, { accessToken });
                } else {
                    return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                return done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};