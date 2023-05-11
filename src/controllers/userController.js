const { body, validationResult } = require('express-validator');
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
  async auth(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userId = jwt.decode(token, process.env.JWT_KEY).id;
      const user = await User.findOne({
        where: {
          id: userId
        }
      })

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
  async edit(req, res) {

    const validation = validationResult(req);
    const userId = req.user.id
    const {name, email, password} = req.body;

    if (!name && !email && !password) {
      return res.status(404).json({
        success: false,
        message: 'edited data not correct'
      })
    }

    const nameError = validation.errors.find((error) => error.path === 'name')
    const emailError = validation.errors.find((error) => error.path === 'email')
    const passwordError = validation.errors.find((error) => error.path === 'password')

    if (name && nameError) {
      return res.status(404).json({
        success: false,
        message: 'name not correct'
      })
    }

    if (email && emailError) {
      return res.status(404).json({
        success: false,
        message: 'email not correct'
      })
    }

    if (password && passwordError) {
      return res.status(404).json({
        success: false,
        message: 'password not correct'
      })
    }

    try {

      if (name) {
        await User.update({name}, {
          where: {
            id: userId,
          }
        })
      }

      if (email) {
        await User.update({email}, {
          where: {
            id: userId,
          }
        })
      }

      if (password) {

        const hashPassword = await bcrypt.hash(password, 10)
        await User.update({
          password: hashPassword,
        }, {
          where: {
            id: userId,
          }
        })
      }


      if (name || email || password) {
        const userData = await User.findOne({
          where: {
            id: userId,
          }
        })

        return res.json({
          success: true,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          }
        })
      }
    } catch (e) {
      res.status(404).json({
        success: false,
        message: 'edit user error',
      })
    }

  }
}

module.exports = new UserController();