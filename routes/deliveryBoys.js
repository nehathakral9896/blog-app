const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');

router.get('/earnings/:deliveryBoyId', deliveryBoyController.getEarnings);
router.get('/orders/history/:deliveryBoyId', deliveryBoyController.getHistory);
router.post('/orders/failed/:orderId', deliveryBoyController.failedDelivery);
router.post('/orders/return/:orderId', deliveryBoyController.returnToSeller);
router.post('/orders/payment/:orderId', deliveryBoyController.confirmCODPayment);
router.post('/orders/out-for-delivery/:orderId', deliveryBoyController.outForDelivery);
router.post('/orders/delivered/:orderId', deliveryBoyController.delivered);
router.post('/location/update', deliveryBoyController.updateLocation);
router.get('/location/:orderId', deliveryBoyController.getLocationByOrder);
router.get('/orders/assigned/:deliveryBoyId', deliveryBoyController.getAssignedOrdersList);
router.post('/orders/pickup/:orderId', deliveryBoyController.confirmPickup);
router.get('/orders/available', deliveryBoyController.getAvailableOrders);
router.post('/orders/accept/:orderId', (req, res) => {
  req.body.orderId = req.params.orderId;
  deliveryBoyController.acceptOrder(req, res);
});
router.post('/orders/reject/:orderId', (req, res) => {
  req.body.orderId = req.params.orderId;
  deliveryBoyController.rejectOrder(req, res);
});
router.post('/register', deliveryBoyController.register);
router.post('/login', deliveryBoyController.login);
router.get('/', deliveryBoyController.getDeliveryBoys);
router.post('/assign', deliveryBoyController.assignOrder);
router.post('/mark-delivered', deliveryBoyController.markOrderDelivered);
router.get('/:deliveryBoyId/orders', deliveryBoyController.getAssignedOrders);

module.exports = router;
