const User = require('../models/User');
const Address = require('../models/Address');
const moment = require('moment-timezone');

module.exports = {
    async createUser(req, res) {
        try {
            const formattedDate = moment.tz(req.body.date_of_birth, 'YYYY-MM-DD', 'America/Sao_Paulo').toDate();
            const { name, occupation, newsletter } = req.body;

            await User.create({
                name,
                occupation,
                date_of_birth: formattedDate,
                newsletter: newsletter === 'on',
            });

            res.redirect('/users/listauser');
        } catch (error) {
            res.status(500).send('Erro ao criar usuário');
        }
    },

    async listUsers(req, res) {
        try {
            const users = await User.findAll({ raw: true });
            res.render('users/listauser', { users });
        } catch (error) {
            res.status(500).send('Erro ao carregar usuários');
        }
    },

    async getUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
                include: { model: Address, as: 'Addresses' },
                raw: true,
            });

            if (!user) return res.status(404).send('Usuário não encontrado');
            res.render('users/userunique', { user });
        } catch (error) {
            res.status(500).send('Erro ao buscar usuário');
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).send('Usuário não encontrado');

            await User.destroy({ where: { id: req.params.id } });
            res.redirect('/users/listauser');
        } catch (error) {
            res.status(500).send('Erro ao excluir usuário');
        }
    },
};
