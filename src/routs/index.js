const router = require('express').Router();
const userRouter = require('./userRouter');
const deviceRouter = require('./deviceRouter');
const typeRouter = require('./typeRouter');
const brandRouter = require('./brandRouter');
const basketRouter = require('./basketRouter');

router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/basket', basketRouter)

module.exports = router;