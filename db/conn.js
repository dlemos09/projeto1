require('dotenv').config();
const { Sequelize } = require('sequelize');
const moment = require('moment-timezone'); 

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        timezone: process.env.DB_TIMEZONE,
        dialectOptions: {
            useUTC: false,
        },
    }
);

// Testando a conexão com o banco de dados
try {
    sequelize.authenticate();
    console.log('Conectamos com sucesso ao Sequelize');
} catch (err) {
    console.log('Não foi possível conectar: ', err);
}

module.exports = sequelize;
