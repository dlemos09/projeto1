const Address = require('../models/Address');

module.exports = {
    async createAddress(req, res) {
        try {
            const { UserId, street, number, city } = req.body;

            await Address.create({ street, number, city, UserId });
            res.redirect(`/users/${UserId}`);
        } catch (error) {
            res.status(500).send('Erro ao criar endereço');
        }
    },
};
