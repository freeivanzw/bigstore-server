const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

class UserController {
  async register(req, res) {
    try {
      const {name, email, password} = req.body;
      const validation = validationResult(req);

      if (validation.errors.length !== 0) {
        return res.status(401).json({
          success: false,
          message: 'register data not correct',
          errors: validation.errors
        })
      }

      const hashPassword = await bcrypt.hash(password, 10)

      const userCreated = await User.create({
        name,
        email,
        password: hashPassword
      })

      const token = jwt.sign({
        id: userCreated.id,
        email: userCreated.email,
        name: userCreated.name,
      }, process.env.JWT_KEY,{ expiresIn: '12h' })

      res.json({
        success: true,
        id: userCreated.id,
        email: userCreated.email,
        name: userCreated.name,
        token
      })
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message
      })
    }


  }
}

module.exports = new UserController();