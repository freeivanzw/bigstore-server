const nodemailer = require("nodemailer");
const { Basket, BasketDevice, Device} = require('../models/models')

class BasketController {
  async addDevice(req, res) {
    const userId = req.user.id;
    const deviceId = req.params.id;

    try {
      const basket = await Basket.findOne({
        where: {
          UserId: userId,
        }
      })

      const device = await Device.findOne({
        where: {
          id: deviceId
        }
      })

      if (!basket || !device) {
        return res.status(404).json({
          success: false,
          message: 'basket or device not found',
        })
      }

      const basketDevice = await BasketDevice.create({
        DeviceId: deviceId,
        BasketId: basket.id
      })

      return res.json({
        success: true,
        basketDevice
      })
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message,
      })
    }
  }
  async getBasketProducts(req, res) {
    try {
      const UserBasket = await Basket.findOne({
        where: {
          UserId: req.user.id
        }
      })

      const BasketProducts = await BasketDevice.findAndCountAll({
        where: {
          BasketId: UserBasket.id,
        }
      })

      const ProductList = [];


      for (const BasketElem of BasketProducts.rows) {
        const productData = await Device.findOne({
          where: {
            id: BasketElem.DeviceId
          }
        })

        ProductList.push({
          id: productData.id,
          basketDeviceId: BasketElem.id,
          name: productData.name,
          price: productData.price,
          image: productData.image
        })
      }

      res.json({
        success: true,
        count: BasketProducts.count,
        rows: ProductList
      })
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message,
      })
    }

  }
  async removeBasketProduct(req, res) {
    try {
      const basketDevice = await BasketDevice.findOne({
        where: {
          id: req.params.id
        }
      })

      if (basketDevice) {
        await basketDevice.destroy();

        res.json({
          success: true,
        })
      }
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message,
      })
    }
  }
  async createOrder(req, res) {
    try {
      const order = req.body.order;
      const email = req.body.email;

      let orderPrice = 0;

      let HTML = `
        <table>
            <thead>
                <tr><b>Ваше замовлення прийнято в обробку. З Вами звяжеться менеджер для уточнення інформації.</b></tr>
                <tr>
                    <td>Назва</td>
                    <td>Кількість</td>
                    <td>Ціна</td>
                </tr>
            </thead>
            <tbody>       
      `

      for (const orderItem of order) {

        const device = await Device.findOne({
          where: {
            id: orderItem.id
          }
        })

        orderPrice = (device.price * orderItem.count) + orderPrice;

        HTML += `<tr>
            <td>${device.name}</td>
            <td>${orderItem.count}</td>
            <td>${device.price} грн</td>
        </tr>
        `
      }

      HTML += `<tr><td>Загальна сума ${orderPrice} грн</td></tr>
            </tbody>
        </table>
      `

      const transporter = nodemailer.createTransport({
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
          user: 'ivanfromlviv@ukr.net',
          pass: 'mAEJ22ms4aHTZNol'
        }
      });





      let HTMLAdmin = `
        <table>
            <thead>
                <tr><b>Нове замовлення від ${email}</b></tr>
                <tr>
                    <td>Назва</td>
                    <td>Кількість</td>
                    <td>Ціна</td>
                </tr>
            </thead>
            <tbody>       
      `

      for (const orderItem of order) {

        const device = await Device.findOne({
          where: {
            id: orderItem.id
          }
        })

        orderPrice = (device.price * orderItem.count) + orderPrice;

        HTMLAdmin += `<tr>
            <td>${device.name}</td>
            <td>${orderItem.count}</td>
            <td>${device.price} грн</td>
        </tr>
        `
      }

      HTMLAdmin += `<tr><td>Загальна сума ${orderPrice} грн</td></tr>
            </tbody>
        </table>
      `
      const mailOptions = {
        from: 'ivanfromlviv@ukr.net',
        to: email,
        subject: 'Замовлення від BigStore',
        html: HTML
      };

      const adminMailOptions = {
        from: 'ivanfromlviv@ukr.net',
        to: process.env.ADMIN_EMAIL,
        subject: 'Нове замовлення з магазину BigStore',
        html: HTMLAdmin
      }

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res.json({
            success: false,
          })
        }
        const userBasket = await Basket.findOne({
          where: {
            UserId: req.user.id
          }
        })

        await BasketDevice.destroy({
          where: {
            BasketId: userBasket.id,
          }
        })

        transporter.sendMail(adminMailOptions, async (error, info) => {
          if (error) {
            return res.json({
              success: false,
            })
          }

          return res.json({
            success: true,
          })
        })
      });




    } catch (e) {
      res.status(500).json({
        message: e.message
      })
    }


  }
}

module.exports = new BasketController();