require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const conn = require('./db/conn');

const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use('/', userRoutes);
app.use('/', addressRoutes);

conn.sync().then(() => {
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
}).catch(console.error);
