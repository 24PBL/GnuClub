// 데이터베이스 연결은 models 폴더에서 각 데이터베이스에 대한 파일이 있고, 그 데이터베이스들을 모아놓은 것이 db.js,
// 사용할 때는 db 파일에 연결된 변수를 사용(db.user, db.tempUser 등) 이때 db.user, db.tempUser에는 각 DB 테이블에 해당하는 js파일이 연결됨.
const db = require('../models/db');

exports.createClub = async (req, res, next) => {
    const { clanName, clanIntro, clanclass } = req.body;
    try {
        // 요청 url에서 user-id 추출
        const reqUserID = req.url.split("/")[1];

        /* 테스트 코드
        const userDb = db.user.findOne({ where:{userId: reqUserID} }).then(function(result){
            res.send({success:201, result: result});
            //return res.redirect('/');
        });
        */

        db.user.findOne({ where:{userId: reqUserID} })
            .then(function(result) {
                if (result.userId === req.user.userId) {
                    // return res.send({success:201, result: "로그인 정보와 url 일치"});
                    db.clan.create({ clanName: clanName, clanIntro: clanIntro, clanclass: clanclass }).then(function(result){
                        db.userInClan.create({ userId: reqUserID, clanId: result.clanId, part: 0 }).then(function(result){
                            res.send({success:201, result:"동아리 생성 성공"});
                            //return res.redirect('/');
                        })
                    })
                } else {
                    return res.send({success:401, result: result});
                }
            })
            .catch(function(error) {
                return res.send({success:401, result: error});
            });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}