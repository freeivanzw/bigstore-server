const router = require('express').Router();
const { body, query } = require('express-validator');
const BrandController = require('../controllers/brandController');

router.post('/', [
  body('name').trim().notEmpty(),
], BrandController.register)
router.delete('/', [
  query('id').trim().notEmpty(),
], BrandController.remove)

module.exports = router;