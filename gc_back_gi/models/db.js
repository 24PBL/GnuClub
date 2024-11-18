var Sequelize = require("sequelize");
var sequelize;

sequelize = new Sequelize("DB이름", "root", "비밀번호", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    timezone: "+09:00",
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
        freezeTableName: true
    }
})

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
db.postComment = sequelize.import(__dirname + "/postcomment.js")
db.notice = sequelize.import(__dirname + "/notice.js")
db.noticeImg = sequelize.import(__dirname + "/noticeImg.js")
db.noticeComment = sequelize.import(__dirname + "/noticecomment.js")
db.userInClan = sequelize.import(__dirname + "/userinclan.js")
db.user4fpw = sequelize.import(__dirname + "/user4fpw.js")

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;