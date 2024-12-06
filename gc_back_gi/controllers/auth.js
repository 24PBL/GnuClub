const bcrypt = require('bcrypt');
const passport = require('passport');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');

exports.verifyLoginStatus = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            success: false,
            message: 'Access Token이 필요합니다.',
        });
    }

    const token = authHeader.split(' ')[1]; // Bearer <access_token>

    try {
        // Access Token 검증
        const decoded = jwt.verify(token, SECRET_KEY);

        // 토큰이 유효한 경우 사용자 정보 반환
        return res.status(200).send({
            success: true,
            message: '로그인 상태입니다.',
            user: decoded, // 토큰에 포함된 사용자 정보
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                success: false,
                message: 'Access Token이 만료되었습니다.',
            });
        }
        return res.status(401).send({
            success: false,
            message: '유효하지 않은 Access Token입니다.',
        });
    }
};

// 이메일 체크 후 인증코드 생성을 위한 컨트롤러
exports.check_email = async (req, res, next) => {
    const input_email = req.body.email;
    try {

        // 중복 확인
        const exUser = await db.user.findOne({ where: { userEmail: input_email } });
        if (exUser) {
            return res.status(403).send({ success: 403, result: "이미 가입한 유저" });
        }

        // 해당 이메일로 요청을 보낸 횟수를 확인하기 위해 리스트로 다 가져옴.
        const reqTime = await db.tempUser.findAll({ where: { email: input_email } });
        // 인증코드가 소멸되기 전까지 5번 이상의 요청을 할 경우 횟수 초과 응답을 보냄.
        if (reqTime.length >= 5) {
            return res.status(429).send({ success: 429, result: "인증 요청 횟수 초과" });
        }

        // 인증코드 6자리 생성(10만 단위의 랜덤 수를 생성함.)
        let authentiCode = parseInt(Math.random() * 999999);

        async function sendMail() {
            var transporter =  nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "clubgnu1@gmail.com",
                    pass: "gnfugmuuufidmgow"
                }
            });

            const mailOptions = {
                from: '"Club Gnu" <clubgnu1@gmail.com>',
                to: input_email,
                subject: "GC 앱 이메일 인증코드입니다.",
                html: `<p>인증코드는 <strong>${authentiCode}</strong>입니다.</p>`,
            };

            return transporter.sendMail(mailOptions);
        }

        await sendMail();
        const savedAuthCode = await db.tempUser.create({ email: input_email, authentiCode: authentiCode });

        // 3분 후 인증코드 소멸
        setTimeout(async () => {
            try {
                await db.tempUser.destroy({ where: { idx: savedAuthCode.idx, email: savedAuthCode.email, } });
            } catch (error) {
                console.error("인증코드 삭제 실패:", error);
            }
        }, 3 * 60 * 1000);

        // 응답 성공 신호(200), 이메일을 프론트로 보냄. 프론트에서 이메일 값을 받아서 이메일 입력 칸에 다시 넣어주세요.
        return res.status(200).send({ success: 200, email: input_email });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 입력된 인증코드를 검증하는 컨트롤러
exports.check_auth_code = async (req, res, next) => {
    const input_email = req.body.email;
    const authCode = req.body.authCode;

    try {
        // 최대 4번까지 요청할 수 있는 이메일 요청 데이터를 일단 리스트로 모두 들고옴.
        const target_email = await db.tempUser.findAll({ where: { email: input_email } });

        // 인증 데이터가 없는 경우
        if (target_email.length === 0) {
            return res.status(404).send({ success: 404, result: "인증 데이터가 존재하지 않음" });
        }

        // 인증할 때는 가장 최근에 받은 인증코드와 대조함.
        for (let i = 0; i < target_email.length; i++) {
            if (i == target_email.length - 1) {
                if(input_email == target_email[i].email && authCode == target_email[i].authentiCode) {
                    await db.tempUser.destroy({ where: { email: input_email } });
                    return res.status(200).send({ success: 200, result: "이메일 인증 성공" });   
                } else {
                    return res.status(401).send({ success: 401, result: "인증코드가 유효하지 않음" });
                }
            }
        }
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 인증 코드 검증 완료 후 회원 가입 페이지(userId와 createAt 필드는 자동 생성, 현재 collage, userLesson, userImg 필드만 Null 허용,
// Field 필드의 경우 임시로 남자는 3, 여자는 4(주민번호 뒷부분 첫자리 규율대로 임시 테스트 예정.).
// 비밀번호와 비밀번호 확인의 값이 같은지는 프론트에서 검증해주세요.)
exports.fill_user_info = async (req, res, next) => {
    const { userName, userEmail, userPassword, userNum, userPhone, collage, userLesson } = req.body;
    try {
        const hash = await bcrypt.hash(userPassword, 12);
        await db.user.create({ userName: userName, userEmail: userEmail, userPassword: hash, userNum: userNum, userPhone: userPhone, collage: collage, userLesson: userLesson });
        return res.status(201).send({success:201, result:"회원가입성공"});
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 비밀번호 찾기 과정에서의 이메일 검증
exports.check_email_4_fpw = async (req, res, next) => {
    const input_email = req.body.email;
    try {
        // 존재하는 회원인지 확인
        const exUser = await db.user.findOne({ where: { userEmail: input_email } });
        if (!exUser) {
            return res.status(403).send({ success: 403, result: "존재하지 않는 회원입니다." });
        }

        // 해당 이메일로 요청을 보낸 횟수를 확인하기 위해 리스트로 다 가져옴.
        const reqTime = await db.user4fpw.findAll({ where: { email: input_email } });
        // 인증코드가 소멸되기 전까지 5번 이상의 요청을 할 경우 횟수 초과 응답을 보냄.
        if (reqTime.length >= 5) {
            return res.status(429).send({ success: 429, result: "인증 요청 횟수 초과" });
        }

        // 인증코드 6자리 생성(10만 단위의 랜덤 수를 생성함.)
        let authentiCode = parseInt(Math.random() * 99999);

        async function sendMail4fpw() {
            var transporter =  nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "clubgnu1@gmail.com",
                    pass: "gnfugmuuufidmgow"
                }
            });

            const mailOptions = {
                from: '"Club Gnu" <clubgnu1@gmail.com>',
                to: input_email,
                subject: "GC 앱 이메일 인증코드입니다.",
                html: `<p>인증코드는 <strong>${authentiCode}</strong>입니다.</p>`,
            };

            return transporter.sendMail(mailOptions);
        }

        await sendMail4fpw();
        const savedAuthCode = await db.user4fpw.create({ email: input_email, authentiCode: authentiCode });

        // 3분 후 인증코드 소멸
        setTimeout(async () => {
            try {
                await db.user4fpw.destroy({ where: { idx: savedAuthCode.idx, email: savedAuthCode.email, } });
            } catch (error) {
                console.error("인증코드 삭제 실패:", error);
            }
        }, 3 * 60 * 1000);

        // 응답 성공 신호(200), 이메일을 프론트로 보냄. 프론트에서 이메일 값을 받아서 이메일 입력 칸에 다시 넣어주세요.
        return res.status(200).send({ success: 200, email: input_email });
            
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 비밀번호 찾기 과정에서의 인증코드 검증
exports.check_auth_code_4_fpw = async (req, res, next) => {
    const input_email = req.body.email;
    const authCode = req.body.authCode;

    try {
        // 최대 4번까지 요청할 수 있는 이메일 요청 데이터를 일단 리스트로 모두 들고옴.
        const target_email = await db.user4fpw.findAll({ where: { email: input_email } });

        // 인증 데이터가 없는 경우
        if (target_email.length === 0) {
            return res.status(404).send({ success: 404, result: "인증 데이터가 존재하지 않음" });
        }

        // 인증할 때는 가장 최근에 받은 인증코드와 대조함.
        for (let i = 0; i < target_email.length; i++) {
            if (i == target_email.length - 1) {
                if(input_email == target_email[i].email && authCode == target_email[i].authentiCode) {
                    await db.user4fpw.destroy( {where:{ email: input_email } })
                    return res.status(200).send({ success: 200, result: "이메일 인증 성공" });
                } else {
                    return res.status(401).send({ success: 401, result: "인증코드가 유효하지 않음" });
                }
            }
        }
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 비밀번호 찾기 - 이메일 인증 후 비밀번호 수정 단계(역시 서버에서는 이메일과 패스워드만 받습니다. 비밀번호, 비밀번호 확인의 값이 같은지는 프론트에서 검증)
exports.modify_user_pw = async (req, res, next) => {
    const { userEmail, userPassword } = req.body;
    try {
        const hash = await bcrypt.hash(userPassword, 12);
        await db.user.update({userPassword: hash}, {where: { userEmail: userEmail }});
        return res.status(200).send({ success: 200, result: "비밀번호 변경 성공" });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

// 로그인 컨트롤러
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.status(401).send({success:401, result: info.message});
        }

        const { accessToken } = info; // JWT 토큰

        res.status(200).send({ success:200, result: "로그인 성공", accessToken });

        /*
        req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            res.status(200).send({success:200, result: "로그인 성공", accessToken, refreshToken});
        });
        */
    })(req, res, next);
};

// 로그아웃 컨트롤러
exports.logout = (req, res) => {
    req.logout(() => {
        res.status(200).send({success:200, result: "로그아웃 성공"});
    });
};
