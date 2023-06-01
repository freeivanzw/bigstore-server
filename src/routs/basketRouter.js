const router = require('express').Router();
const BasketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add/:id', authMiddleware,  BasketController.addDevice);
router.post('/order', authMiddleware, BasketController.createOrder);
router.get('/', authMiddleware, BasketController.getBasketProducts);
router.delete('/:id', authMiddleware, BasketController.removeBasketProduct);

module.exports = router;