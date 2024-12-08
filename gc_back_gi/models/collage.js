const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collage', {
    collageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    collageName: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'collage',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "collageId" },
        ]
      },
    ]
  });
};
