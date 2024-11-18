const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clan', {
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    clanName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    clanclass: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    clanIntro: {
      type: DataTypes.STRING(225),
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
    ]
  });
};
