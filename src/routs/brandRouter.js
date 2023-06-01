const router = require('express').Router();
const { body, query } = require('express-validator');
const BrandController = require('../controllers/brandController');
const roelMiddleware = require('../middleware/roelMiddleware');

router.post('/', [
  body('name').trim().notEmpty(),
], roelMiddleware('ADMIN'), BrandController.register)
router.delete('/', [
  query('id').trim().notEmpty(),
], roelMiddleware('ADMIN'), BrandController.remove);
router.get('/', BrandController.getAll)

module.exports = router;