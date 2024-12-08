const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('noticeimg', {
    imgId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    noticeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'notice',
        key: 'noticeId'
      }
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'noticeimg',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "imgId" },
        ]
      },
      {
        name: "FK_notice_TO_noticeimg_1",
        using: "BTREE",
        fields: [
          { name: "noticeId" },
        ]
      },
    ]
  });
};
