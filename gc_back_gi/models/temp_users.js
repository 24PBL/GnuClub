module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TempUsers', {
        idx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allwNull: false
        },
        email: {
            type: DataTypes.STRING(250),
            allwNull: false
        },
        authentiCode: {
            type: DataTypes.INTEGER,
            allwNull: false
        }
    })
}