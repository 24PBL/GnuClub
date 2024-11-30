const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
//const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

// 테스트를 위한 라우터(값 확인)
const testRouter = require('./routes/test');

const clubRouter = require('./routes/club');

const postRouter = require('./routes/post');

const noticeRouter = require('./routes/notice');

const db = require('./models/db') 
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
//app.use('/public', express.static(__dirname + './public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
//app.use('/post/:userId/:clanId/create-post/upload-image', express.static(path.join(__dirname, 'uploads')));
//app.use('/notice/:userId/:clanId/create-notice/upload-image', express.static(path.join(__dirname, 'uploads')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 배포시 uploads 폴더의 무단 접근을 막기위한 코드, 개발 중에는 테스트를 위해 일단 열어놓음
/*
app.use('/uploads/:userId/:clanId', (req, res, next) => {
    const reqUserID = req.url.split("/")[1];
    //if (req.user.id !== reqUserID) {
        //return res.status(403).send('권한이 없습니다.');
    //}
    next();
}, express.static(path.join(__dirname, 'uploads')));
*/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
/*
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
*/

app.use(passport.initialize());
//app.use(passport.session());

// app.use('/', pageRouter);
app.use('/auth', authRouter);

// 테스트를 위한 라우터(값 확인)
app.use('/test', testRouter);

app.use('/club', clubRouter);

app.use('/post', postRouter);

app.use('/notice', noticeRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    //res.send({success:500, result: "error"});
    res.send({success:500, result: err.message});
    //res.render('error');
});

app.listen(app.get('port'), function(req, res) {
    console.log(app.get('port'), '번 포트에서 대기 중');
    db.sequelize.sync({force:false});
})