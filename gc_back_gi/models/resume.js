const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resume', {
    idx: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    collage: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userLesson: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    etc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'clan',
        key: 'clanId'
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userPhone: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    result: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'resume',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
      {
        name: "FK_Clan_TO_resume_1",
        using: "BTREE",
        fields: [
          { name: "clanId" },
        ]
      },
    ]
  });
};
