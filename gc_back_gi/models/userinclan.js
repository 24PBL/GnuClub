const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userinclan', {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userId'
      }
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    memberId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'userinclan',
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
