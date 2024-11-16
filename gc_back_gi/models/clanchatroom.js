const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clanchatroom', {
    chatId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    chatName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clanchatroom',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chatId" },
        ]
      },
    ]
  });
};
