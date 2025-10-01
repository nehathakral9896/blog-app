const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/tracking', orderController.updateTracking);

router.post('/return', orderController.requestReturn);
router.post('/exchange', orderController.requestExchange);

module.exports = router;
