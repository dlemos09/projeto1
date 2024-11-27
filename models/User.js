const {DataTypes} = require('sequelize')

const db = require('../db/conn')


// criando classe usuário
const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    newsletter: {
        type: DataTypes.BOOLEAN, // Certifique-se de que é BOOLEAN
        allowNull: false,
        defaultValue: false, // Valor padrão caso o campo não seja enviado
    },
});


module.exports = User