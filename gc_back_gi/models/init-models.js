var DataTypes = require("sequelize").DataTypes;
var _chatmessage = require("./chatmessage");
var _clan = require("./clan");
var _clanchatroom = require("./clanchatroom");
var _class_ = require("./class");
var _collage = require("./collage");
var _comment = require("./comment");
var _notice = require("./notice");
var _noticeimg = require("./noticeimg");
var _post = require("./post");
var _postimg = require("./postimg");
var _tempuser = require("./tempuser");
var _user = require("./user");
var _userfpw = require("./userfpw");
var _userinclan = require("./userinclan");

function initModels(sequelize) {
  var chatmessage = _chatmessage(sequelize, DataTypes);
  var clan = _clan(sequelize, DataTypes);
  var clanchatroom = _clanchatroom(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var collage = _collage(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var notice = _notice(sequelize, DataTypes);
  var noticeimg = _noticeimg(sequelize, DataTypes);
  var post = _post(sequelize, DataTypes);
  var postimg = _postimg(sequelize, DataTypes);
  var tempuser = _tempuser(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var userfpw = _userfpw(sequelize, DataTypes);
  var userinclan = _userinclan(sequelize, DataTypes);

  notice.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(notice, { as: "notices", foreignKey: "clanId"});
  post.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(post, { as: "posts", foreignKey: "clanId"});
  userinclan.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(userinclan, { as: "userinclans", foreignKey: "clanId"});
  clan.belongsTo(class, { as: "clanclass_class", foreignKey: "clanclass"});
  class.hasMany(clan, { as: "clans", foreignKey: "clanclass"});
  noticeimg.belongsTo(notice, { as: "notice", foreignKey: "noticeId"});
  notice.hasMany(noticeimg, { as: "noticeimgs", foreignKey: "noticeId"});
  comment.belongsTo(post, { as: "post", foreignKey: "postId"});
  post.hasMany(comment, { as: "comments", foreignKey: "postId"});
  postimg.belongsTo(post, { as: "post", foreignKey: "postId"});
  post.hasMany(postimg, { as: "postimgs", foreignKey: "postId"});
  comment.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(comment, { as: "comments", foreignKey: "userId"});
  notice.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(notice, { as: "notices", foreignKey: "userId"});
  post.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(post, { as: "posts", foreignKey: "userId"});
  userinclan.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(userinclan, { as: "userinclans", foreignKey: "userId"});

  return {
    chatmessage,
    clan,
    clanchatroom,
    class_,
    collage,
    comment,
    notice,
    noticeimg,
    post,
    postimg,
    tempuser,
    user,
    userfpw,
    userinclan,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
