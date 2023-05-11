const router = require('express').Router();
const DeviceController = require('../controllers/deviceController');
const { body } = require('express-validator');

router.post('/', [
  body('name').trim().notEmpty(),
  body('price').trim().notEmpty(),
], DeviceController.create)

module.exports = router;