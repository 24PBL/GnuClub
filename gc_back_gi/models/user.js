const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    userId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    userNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userEmail: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    userPassword: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    userPhone: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    userLesson: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userImg: {
      type: DataTypes.TEXT,
      defaultValue: "/public/default_profile.png",
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    collage: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
