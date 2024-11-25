const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    commentId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post',
        key: 'postId'
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "commentId" },
        ]
      },
      {
        name: "FK_User_TO_comment_1",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "FK_post_TO_comment_1",
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
    ]
  });
};
