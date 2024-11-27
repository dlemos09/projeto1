require('dotenv').config()
const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment-timezone');
const app = express();
const conn = require('./db/conn');
const User = require('./models/User');
const Address = require('./models/Address');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
const port = process.env.PORT || 3000;
app.engine('handlebars', exphbs.engine());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/users/create', (req, res) => {
    res.render('adduser');
});

app.post('/users/create', async (req, res) => {
    try {
        const formattedDate = moment.tz(req.body.date_of_birth, 'YYYY-MM-DD', 'America/Sao_Paulo').toDate();
        const name = req.body.name;
        const occupation = req.body.occupation;
        const date_of_birth = formattedDate;
        const newsletter = req.body.newsletter === 'on';

        await User.create({ name, occupation, date_of_birth, newsletter });
        res.redirect('/users/listauser');
    } catch (error) {
        res.status(500).send('Erro ao criar usuário');
    }
});

app.get('/users/listauser', async (req, res) => {
    try {
        const users = await User.findAll({ raw: true });
        res.render('listauser', { users });
    } catch (error) {
        res.status(500).send('Erro ao carregar a lista de usuários');
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id) || id <= 0) {
            return res.status(400).send('ID inválido');
        }
        const user = await User.findOne({ raw: true, where: { id: id } });
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('userunique', { user });
    } catch (error) {
        res.status(500).send('Erro ao carregar os dados do usuário');
    }
});

app.delete('/users/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }
        await User.destroy({ where: { id: id } });
        res.redirect('/users/listauser');
    } catch (error) {
        res.status(500).send('Erro ao excluir o usuário.');
    }
});

app.get('/users/edituser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }
        const user = await User.findByPk(id, {
            include: {
                model: Address,
                as: 'Addresses',
            },
        });
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.render('edituser', { user: user.toJSON() });
    } catch (error) {
        res.status(500).send('Erro interno do servidor.');
    }
});

app.post('/users/update', async (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const occupation = req.body.occupation;
        const date_of_birth = req.body.date_of_birth;
        let newsletter = req.body.newsletter === 'on';

        if (!id || isNaN(id)) {
            return res.status(400).send('ID inválido.');
        }

        if (!name || !occupation || !date_of_birth) {
            return res.status(400).send('Todos os campos são obrigatórios.');
        }

        const formattedDate = moment(date_of_birth, 'YYYY-MM-DD').toDate();
        const userData = {
            id,
            name,
            occupation,
            date_of_birth: formattedDate,
            newsletter,
        };
        const [affectedRows] = await User.update(userData, {
            where: { id: id },
        });

        if (affectedRows === 0) {
            return res.status(404).send('Usuário não encontrado ou nenhuma alteração realizada.');
        }

        res.redirect('/users/listauser');
    } catch (err) {
        res.status(500).send('Erro ao atualizar o usuário.');
    }
});

app.post('/address/create', function (req, res) {
    const { UserId, street, number, city } = req.body;
    const address = {
        street,
        number,
        city,
        UserId,
    };

    Address.create(address)
        .then(() => res.redirect(`/users/${UserId}`))
        .catch((err) => {
            res.status(500).send('Erro ao criar endereço.');
        });
});

app.get('/', (req, res) => {
    res.render('home');
});

conn.sync().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch((err) => {
    console.log(err);
});
