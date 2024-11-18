const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    userId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(250),
      allwNull: false
    },
    userName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    userNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userPhone: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    /*
    collage: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    userLesson: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    */
    Field: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    /*
    userImg: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    */
    createAt: {
      type: DataTypes.DATE,
      // 생성일자 자동 생성
      defaultValue: Sequelize.NOW,
      allowNull: true
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
