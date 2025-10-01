// Customer requests a return
exports.requestReturn = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const order = await require('../models/order').findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.returnRequest = { requested: true, reason, status: 'pending' };
    await order.save();
    res.json({ message: 'Return requested', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Customer requests an exchange
exports.requestExchange = async (req, res) => {
  try {
    const { orderId, reason, newProduct } = req.body;
    const order = await require('../models/order').findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.exchangeRequest = { requested: true, reason, status: 'pending', newProduct };
    await order.save();
    res.json({ message: 'Exchange requested', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Order = require('../models/order');

// When an order is created, an OTP is generated and sent to the user. Delivery boy must enter OTP to mark order as delivered.
exports.createOrder = async (req, res) => {
  try {
    // Generate OTP for delivery
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const orderData = { ...req.body, otp };
    const order = await Order.create(orderData);
    // Notify user with OTP
    const Notification = require('../models/notification');
    await Notification.create({
      user: order.customer,
      message: `Your order has been placed. OTP for delivery: ${otp}`
    });

    // Referral points logic: 100 points for first order if registered via referral
    const User = require('../models/user');
    const user = await User.findById(order.customer);
    if (user && user.referredBy) {
      // Check if this is user's first order
      const orderCount = await Order.countDocuments({ customer: user._id });
      if (orderCount === 1) {
        user.points += 100;
        await user.save();
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.tracking.push({ status });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
