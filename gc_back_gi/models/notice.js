const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notice', {
    postId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    clanId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    postHead: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    postBody: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'notice',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "postId" },
        ]
      },
    ]
  });
};
