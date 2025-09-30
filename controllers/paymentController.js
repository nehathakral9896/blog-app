
const Payment = require('../models/payment');
const Order = require('../models/order');
const Notification = require('../models/notification');


exports.createPayment = async (req, res) => {
  try {
    const { user, amount, method, orderId } = req.body;
    const payment = new Payment({ user, amount, method });
    await payment.save();
    // Link payment to order
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        // Generate OTP for order
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        order.otp = otp;
        await order.save();
        // Notify user order created with OTP
        await Notification.create({
          user,
          message: `Order created. Your OTP is ${otp}`
        });
      }
    }
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    // If payment completed, notify user
    if (payment.status === 'completed' && req.body.orderId) {
      const order = await Order.findById(req.body.orderId);
      if (order) {
        await Notification.create({
          user: payment.user,
          message: 'Your order has been delivered.'
        });
      }
    }
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
