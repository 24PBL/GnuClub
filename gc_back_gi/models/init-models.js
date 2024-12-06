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
var _resume = require("./resume");
var _tempuser = require("./tempuser");
var _user = require("./user");
var _userfpw = require("./userfpw");
var _userinclan = require("./userinclan");

function initModels(sequelize) {
  var chatMessage = _chatmessage(sequelize, DataTypes);
  var clan = _clan(sequelize, DataTypes);
  var clanChatRoom = _clanchatroom(sequelize, DataTypes);
  var class_ = _class_(sequelize, DataTypes);
  var collage = _collage(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);
  var notice = _notice(sequelize, DataTypes);
  var noticeImg = _noticeimg(sequelize, DataTypes);
  var post = _post(sequelize, DataTypes);
  var postImg = _postimg(sequelize, DataTypes);
  var resume = _resume(sequelize, DataTypes);
  var tempUser = _tempuser(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user4fpw = _userfpw(sequelize, DataTypes);
  var userInClan = _userinclan(sequelize, DataTypes);

  notice.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(notice, { as: "notices", foreignKey: "clanId"});
  post.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(post, { as: "posts", foreignKey: "clanId"});
  resume.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(resume, { as: "resumes", foreignKey: "clanId"});
  userInClan.belongsTo(clan, { as: "clan", foreignKey: "clanId"});
  clan.hasMany(userInClan, { as: "userinclans", foreignKey: "clanId"});
  clan.belongsTo(class_, { as: "clanclass_class", foreignKey: "clanclass"});
  class_.hasMany(clan, { as: "clans", foreignKey: "clanclass"});
  user.belongsTo(collage, { as: "collage_collage", foreignKey: "collage"});
  collage.hasMany(user, { as: "users", foreignKey: "collage"});
  noticeImg.belongsTo(notice, { as: "notice", foreignKey: "noticeId"});
  notice.hasMany(noticeImg, { as: "noticeimgs", foreignKey: "noticeId"});
  comment.belongsTo(post, { as: "post", foreignKey: "postId"});
  post.hasMany(comment, { as: "comments", foreignKey: "postId"});
  postImg.belongsTo(post, { as: "post", foreignKey: "postId"});
  post.hasMany(postImg, { as: "postimgs", foreignKey: "postId"});
  comment.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(comment, { as: "comments", foreignKey: "userId"});
  notice.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(notice, { as: "notices", foreignKey: "userId"});
  post.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(post, { as: "posts", foreignKey: "userId"});
  userInClan.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(userInClan, { as: "userinclans", foreignKey: "userId"});

  return {
    chatMessage,
    clan,
    clanChatRoom,
    class_,
    collage,
    comment,
    notice,
    noticeImg,
    post,
    postImg,
    resume,
    tempUser,
    user,
    user4fpw,
    userInClan,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
