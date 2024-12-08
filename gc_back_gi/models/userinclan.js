const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userinclan', {
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
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
    part: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'userinclan',
    timestamps: false,
    indexes: [
      {
        name: "FK_Clan_TO_UserInClan_1",
        using: "BTREE",
        fields: [
          { name: "clanId" },
        ]
      },
      {
        name: "FK_User_TO_UserInClan_1",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
