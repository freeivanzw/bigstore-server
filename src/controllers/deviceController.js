const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const { Device, DeviceInfo} = require('../models/models');

class DeviceController {
  async create(req, res) {
    try {
      const {name, price, rating, TypeId, BrandId, infoList} = req.body;

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

      const deviceData = {
        name,
        price: +price,
        rating: +rating,
        image: fileName,
      }

      if (parseInt(TypeId)) {
        deviceData.TypeId = TypeId;
      }
      if (parseInt(BrandId)) {
        deviceData.BrandId = BrandId;
      }

      const device = await Device.create(deviceData)

      if (infoList) {
        JSON.parse(infoList).map( async (info) => {
          await DeviceInfo.create({
            DeviceId: device.id,
            title: info.title,
            description: info.description
          })
        })
      }


      res.json({
        success: true,
        device
      })
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: e.message
      })
    }

  }
  async delete(req, res) {

    try {
      if (!req.params.id) {
        return res.status(404).json({
          success: false,
          message: 'product id not found',
        })
      }

      const device = await Device.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'product id not available',
        })
      }

      if (device.image) {
        const deviceImagePath = path.join(__dirname, '../', 'upload', 'products', device.image)
        fs.unlink(deviceImagePath, (err) => {
          if (err) {
            return res.status(404).json({
              success: false,
              message: err.message,
            })
          }
        });
      }

      const infoList = await DeviceInfo.findAll({
        where: {
          DeviceId: req.params.id
        }
      })


      infoList.forEach((info) => {
        info.destroy()
      })

      device.destroy();

      return res.json({
        success: true,
        message: 'device has deleted'
      })
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message,
      })
    }

  }
  async getById(req, res) {
    try {
      const device = await Device.findOne({
        where: {
          id: req.params.id
        }
      })

      if (device) {
        const infoList = await DeviceInfo.findAll({
          where: {
            DeviceId: device.id
          }
        })


        return res.json({
          success: true,
          device: {
            ...device.dataValues,
            infoList
          }
        })
      }
      return res.status(404).json({
        success: false,
        message: 'device not found',
      })
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message,
      })
    }

  }
  async getProducts(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 8;

    const whereData = {};

    if (req.query.TypeId) {
      whereData.TypeId = req.query.TypeId;
    }

    if (req.query.BrandId) {
      whereData.BrandId = req.query.BrandId;
    }

    try {
      const {count, rows} = await Device.findAndCountAll({
        offset: (page - 1) * limit,
        where: whereData,
        limit,
      });

      return res.json({
        success: true,
        totalProducts: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        products: rows,
      })

    } catch (e) {
      res.status(500).json({
        success: false,
        error: 'error when get products',
      });
    }
  }
}

module.exports = new DeviceController();