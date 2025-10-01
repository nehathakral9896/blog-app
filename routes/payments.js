const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
// Body: { user, amount, method, orderId, stripeToken }
router.post('/', paymentController.createPayment);

// Get all payments
router.get('/', paymentController.getPayments);

// Get a single payment by ID
router.get('/:id', paymentController.getPaymentById);

// Update a payment
router.put('/:id', paymentController.updatePayment);

// Delete a payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
