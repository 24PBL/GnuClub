module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users', {
        idx: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allwNull: false
        },
        nickname: {
            type: DataTypes.STRING(250)
        },
        email: {
            type: DataTypes.STRING(250)
        },
        password: {
            type: DataTypes.STRING(250)
        }
    })
}