var DataTypes = require("sequelize").DataTypes;
var _chatmessage = require("./chatmessage");
var _clan = require("./clan");
var _clanchatroom = require("./clanchatroom");
var _class_ = require("./class");
var _collage = require("./collage");
var _comment = require("./comment");
var _post = require("./post");
var _postimg = require("./postimg");
var _user = require("./user");
var _userinclan = require("./userinclan");

function initModels(sequelize) {
  var chatmessage = _chatmessage(sequelize, DataTypes);
  var clan = _clan(sequelize, DataTypes);
  var clanchatroom = _clanchatroom(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var collage = _collage(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var post = _post(sequelize, DataTypes);
  var postimg = _postimg(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var userinclan = _userinclan(sequelize, DataTypes);

  userinclan.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasOne(userinclan, { as: "userinclan", foreignKey: "userId"});

  return {
    chatmessage,
    clan,
    clanchatroom,
    class_,
    collage,
    comment,
    post,
    postimg,
    user,
    userinclan,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
