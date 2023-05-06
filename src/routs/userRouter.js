const router = require('express').Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');

router.post('/register', [
  body('name').notEmpty().withMessage('name must not be empty'),
  body('email').notEmpty().isEmail().withMessage('email not correct'),
  body('password').isLength({ min: 6 }).withMessage('password length min 6'),
], userController.register);

module.exports = router;