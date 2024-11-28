const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');

router.post('/address/create', AddressController.createAddress);

module.exports = router;
