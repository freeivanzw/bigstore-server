const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const { Device } = require('../models/models');

class DeviceController {
  async create(req, res) {
    try {
      const {name, price, rating, TypeId, BrandId} = req.body;
      const {image} = req.files;
      let fileName = '';

      const validation = validationResult(req);

      if (validation.errors.length !== 0) {
        return res.status(400).json(validation)
      }

      const isPhoto = (fileName) => {
        const ext = path.extname(fileName);

        const whiteList = ['.png', '.jpg', '.jpeg'];
        const isValidFormat = whiteList.some((format) => ext.toLowerCase() === format )

        return isValidFormat;
      }

      if (image && isPhoto(image.name)) {

        fileName = uuid.v4() + path.extname(image.name);

        image.mv(path.resolve(__dirname, '../', 'upload', 'products', fileName))
      }


      const device = await Device.create({
        name,
        price: +price,
        rating: +rating,
        image: fileName,
        TypeId,
        BrandId
      })

      res.json(device)
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message
      })
    }

  }
}

module.exports = new DeviceController();