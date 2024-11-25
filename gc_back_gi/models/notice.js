const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notice', {
    noticeId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clan',
        key: 'clanId'
      }
    },
    postHead: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    postBody: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    isPublic: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'notice',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "noticeId" },
        ]
      },
      {
        name: "FK_User_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "FK_Clan_TO_notice_1",
        using: "BTREE",
        fields: [
          { name: "clanId" },
        ]
      },
    ]
  });
};
