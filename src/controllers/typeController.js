const { Type } = require('../models/models');
const { validationResult } = require('express-validator');

class TypeController {
  async register(req, res) {
    const validation = validationResult(req);

    if (validation.errors.length !== 0) {
      return res.status(400).json(validation)
    }

    try {
      const { name } = req.body;

      const type = await Type.create({
        name
      })

      return res.json({type})
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message,
      })
    }
  }
  async remove(req, res) {
    const validation = validationResult(req);

    if (validation.errors.length !== 0) {
      return res.status(400).json(validation)
    }

    try {
      const type = await Type.findOne({
        where: {
          id: req.query.id
        }
      })

      if (!type) {
        return res.json({
          success: false,
          message: 'id not found'
        });
      }

      await type.destroy();

      return res.json({
        success: true,
      })
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message,
      })
    }
  }
}

module.exports = new TypeController();