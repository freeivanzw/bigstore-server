const router = require('express').Router();
const { body } = require('express-validator');
const DeviceController = require('../controllers/deviceController');
const roelMiddleware = require('../middleware/roelMiddleware')

router.post('/', [
  body('name').trim().notEmpty(),
  body('price').trim().notEmpty(),
], roelMiddleware('ADMIN'), DeviceController.create)
router.delete('/:id', roelMiddleware('ADMIN'), DeviceController.delete)
router.get('/:id', DeviceController.getById)
router.get('/', DeviceController.getProducts)

module.exports = router;