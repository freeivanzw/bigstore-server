const router = require('express').Router();
const { body, query } = require('express-validator');
const TypeController = require('../controllers/typeController')

router.post('/', [
  body('name').trim().notEmpty(),
], TypeController.register)
router.delete('/', [
  query('id').trim().notEmpty(),
], TypeController.remove)

module.exports = router;