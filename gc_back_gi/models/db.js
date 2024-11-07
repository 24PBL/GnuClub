var Sequelize = require("sequelize");
var sequelize;

sequelize = new Sequelize("DB이름", "root", "DB비밀번호", {
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

db.users = sequelize.import(__dirname + "/users.js")
db.tempUsers = sequelize.import(__dirname + "/temp_users.js")

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;