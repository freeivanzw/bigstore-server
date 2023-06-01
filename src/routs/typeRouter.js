const router = require('express').Router();
const { body, query } = require('express-validator');
const TypeController = require('../controllers/typeController')
const roelMiddleware = require('../middleware/roelMiddleware');

router.post('/', [
  body('name').trim().notEmpty(),
], roelMiddleware('ADMIN'), TypeController.register)
router.delete('/', [
  query('id').trim().notEmpty(),
], roelMiddleware('ADMIN'), TypeController.remove)
router.get('/', TypeController.getAll)

module.exports = router;