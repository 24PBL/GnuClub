const express = require('express');
const helmet = require('helmet');
const ejs = require('ejs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

// 테스트를 위한 라우터(값 확인)
const testRouter = require('./routes/test');

const db = require('./models/db') 
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(helmet());
app.use(morgan('dev'));
app.use('/public', express.static(__dirname + './public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);

// 테스트를 위한 라우터(값 확인)
app.use('/test', testRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), function(req, res) {
    console.log(app.get('port'), '번 포트에서 대기 중');
    db.sequelize.sync({force:false});
})