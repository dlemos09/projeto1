const { DataTypes } = require('sequelize'); 
const db = require('../db/conn');
const User = require('./User');

// Definindo o modelo Address
const Address = db.define('Address', {
    street: {
        type: DataTypes.STRING, 
        allowNull: false,      
    },
    number: {
        type: DataTypes.STRING, 
    },
    city: {
        type: DataTypes.STRING, 
    }
});

 // Estabelecendo o relacionamento entre Address e User
 User.hasMany(Address, { foreignKey: 'UserId', as: 'Addresses' });
 Address.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

// // Estabelecendo o relacionamento entre Address e User
// Address.belongsTo(User);

// Exportando o modelo
module.exports = Address;
