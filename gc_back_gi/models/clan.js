const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clan', {
    clanId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    clanName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    clanclass: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'class',
        key: 'classId'
      }
    },
    clanIntro: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    clanImg: {
      type: DataTypes.TEXT,
      defaultValue: "/public/default_club_image.png",
      allowNull: false
    },
    recruitPeriod: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    people: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    fee: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    interview: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "clanId" },
        ]
      },
      {
        name: "FK_Class_TO_Clan_1",
        using: "BTREE",
        fields: [
          { name: "clanclass" },
        ]
      },
    ]
  });
};
