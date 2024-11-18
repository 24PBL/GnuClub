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
      allowNull: false,
      references: {
        model: 'clan',
        key: 'clanId'
      }
    },
    part: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'userinclan',
    timestamps: false,
    id: false,
    /*indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]*/
  });
};
