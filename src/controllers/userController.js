const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

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

      const basketCreate = await Basket.create({
        userId: userCreated.id,
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
  async login(req, res) {
    try {
      const {email, password} = req.body;
      const validation = validationResult(req);

      if (validation.errors.length !== 0) {
        return res.status(401).json({
          success: false,
          message: 'login data not correct',
          errors: validation.errors
        })
      }

      const userData = await User.findOne({
        where: {
          email
        }
      })

      const checkPassword = await bcrypt.compare(password, userData.password);

      if (checkPassword) {
        const token = jwt.sign({
          id: userData.id,
          email: userData.email,
          name: userData.name,
        }, process.env.JWT_KEY,{ expiresIn: '12h' })

        return res.json({
          success: true,
          id: userData.id,
          email: userData.email,
          name: userData.name,
          token
        })
      } else {
        return res.status(500).json({
          success: false,
          message: 'password not correct'
        })
      }

    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message
      })
    }
  }
  auth(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = jwt.decode(token, process.env.JWT_KEY);

      const newToken = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      }, process.env.JWT_KEY)


      res.json({
        success: true,
        id: user.id,
        email: user.email,
        name: user.name,
        token: newToken
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new UserController();