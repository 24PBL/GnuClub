const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('noticeimg', {
    imgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(255),
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
    ]
  });
};
