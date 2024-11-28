const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/users/create', (req, res) => res.render('users/adduser'));
router.post('/users/create', UserController.createUser);
router.get('/users/listauser', UserController.listUsers);
router.get('/users/:id', UserController.getUser);
router.delete('/users/delete/:id', UserController.deleteUser);

module.exports = router;
