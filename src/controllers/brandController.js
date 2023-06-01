const { Brand } = require('../models/models');
const { validationResult } = require('express-validator');

class BrandController {
  async register(req, res) {
    const validation = validationResult(req);

    if (validation.errors.length !== 0) {
      return res.status(400).json(validation)
    }

    try {
      const { name } = req.body;

      const brand = await Brand.create({
        name
      })
      console.log('test2')

      return res.json({
        success: true,
        brand
      })
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
      const brand = await Brand.findOne({
        where: {
          id: req.query.id
        }
      })

      if (!brand) {
        return res.json({
          success: false,
          message: 'id not found'
        });
      }

      await brand.destroy();

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
  async getAll(req, res) {
    try {
      const allBrands = await Brand.findAll();

      return res.json({
        success: true,
        brands: allBrands
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message,
      })
    }
  }
}

module.exports = new BrandController();