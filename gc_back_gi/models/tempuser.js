module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tempuser', {
        idx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        authentiCode: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}