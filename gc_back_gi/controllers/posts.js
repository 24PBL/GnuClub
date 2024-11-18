const bcrypt = require('bcrypt');
const passport = require('passport');


// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');

exports.afterUploadImage = async (req, res) => {
    // 요청 url 앞부분 잘라내고 {user-id}/{clan-id}/create-post/upload-images만 남김
    const parsedUrl = req.url.split("posts/")[1];
    // 남은 부분을 /를 기준으로 스플릿
    const userInfo = parsedUrl.split("/")
    const reqUserId = userInfo[0];  // {user-id}
    const clubId = userInfo[1]; // {clan-id}

    const userDb = db.user.findOne({where:{userId: reqUserId}});
}

// 이메일 체크 후 인증코드 생성을 위한 컨트롤러
exports.uploadPost = async (req, res, next) => {
    // url path parameter의 users 다음 부분부터 가져와서 스플릿한 후 필요한 정보들을 사용
    const parsedUrl = req.url.split("users/")[1];
    const userInfo = parsedUrl.split("/")
    const reqUserId = userInfo[0];
    const clubId = userInfo[2];
    const kindOfPost = userInfo[3];

    const userDb = db.user.findOne({where:{userId: reqUserId}});
    // path parameter의 user_id가 현재 로그인 정보의 사용자와 일치하는지 확인(path parameter의 부정 사용 방지를 위한 검증)
    if (userDb.email === req.user.id) {
        if (kindOfPost === "notices") {
            return res.send({success:201, result: "공지글 작성 완료"});
        } else if (kindOfPost === "posts") {
            return res.send({success:201, result: "게시글 작성 완료"});
        }
    } else {
        return res.send({success:401, result: "유저 정보 불일치. 권한 없음"});
    }



    try {

        
    } catch (error) {
        console.error(error);
        return next(error);
    }
}