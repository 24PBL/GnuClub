var Sequelize = require("sequelize");
const initModels = require("./init-models"); // initModels 함수를 가져옴
var sequelize;

sequelize = new Sequelize("gc8", "root", "parkplanet@7799", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
        charset: 'utf8mb4',
    },
    define: {
        //charset: "utf8",
        //collate: "utf8_general_ci",
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        freezeTableName: true
    }
})

/*
const models = initModels(sequelize); // initModels 함수 호출

var db = {};

db.user = sequelize.import(__dirname + "/user.js")
db.tempUser = sequelize.import(__dirname + "/tempuser.js")
db.chatMessage = sequelize.import(__dirname + "/chatmessage.js")
db.clan = sequelize.import(__dirname + "/clan.js")
db.clanChatRoom = sequelize.import(__dirname + "/clanchatroom.js")
db.class = sequelize.import(__dirname + "/class.js")
db.collage = sequelize.import(__dirname + "/collage.js")
db.post = sequelize.import(__dirname + "/post.js")
db.postImg = sequelize.import(__dirname + "/postimg.js")
db.comment = sequelize.import(__dirname + "/comment.js")
db.notice = sequelize.import(__dirname + "/notice.js")
db.noticeImg = sequelize.import(__dirname + "/noticeimg.js")
db.userInClan = sequelize.import(__dirname + "/userinclan.js")
db.user4fpw = sequelize.import(__dirname + "/userFpw.js")
db.resume = sequelize.import(__dirname + "/resume.js")

db = {
    ...models, // 모델 포함
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/
// initModels를 호출하여 모든 모델 초기화
const models = initModels(sequelize);

// `db` 객체 생성
const db = {
    ...models, // 모델 추가
    sequelize, // Sequelize 인스턴스 추가
    Sequelize, // Sequelize 클래스 추가
};

module.exports = db;