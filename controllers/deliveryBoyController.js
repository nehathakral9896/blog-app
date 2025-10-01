// Get delivery boy earnings
exports.getEarnings = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const orders = await Order.find({ 'assignment.deliveryBoy': deliveryBoyId, 'assignment.status': 'delivered' });
    // Example: Rs. 50 per delivery
    const commissionPerDelivery = 50;
    const totalDeliveries = orders.length;
    const totalEarnings = totalDeliveries * commissionPerDelivery;
    res.json({ totalDeliveries, totalEarnings, commissionPerDelivery });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get delivery boy completed deliveries history
exports.getHistory = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const orders = await Order.find({ 'assignment.deliveryBoy': deliveryBoyId, 'assignment.status': 'delivered' })
      .populate('customer')
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Mark order as failed delivery
exports.failedDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'failed';
    order.tracking.push({ status: 'Failed Delivery', updatedAt: new Date() });
    order.failedReason = reason;
    await order.save();
    res.json({ message: 'Order marked as failed delivery', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mark order as returned to seller
exports.returnToSeller = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'returned';
    order.tracking.push({ status: 'Returned to Seller', updatedAt: new Date() });
    await order.save();
    res.json({ message: 'Order returned to seller', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Confirm cash collection for COD order
exports.confirmCODPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.paymentMethod || order.paymentMethod !== 'COD') {
      return res.status(400).json({ error: 'Order is not COD' });
    }
    order.codPayment = { collected: true, amount, collectedAt: new Date() };
    await order.save();
    res.json({ message: 'COD payment confirmed', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Mark order as out-for-delivery
exports.outForDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'out-for-delivery';
    order.tracking.push({ status: 'Out for Delivery' });
    await order.save();
    res.json({ message: 'Order marked as out for delivery', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mark order as delivered with OTP, signature, photo
const Notification = require('../models/notification');
exports.delivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp, signature, photo } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // Verify OTP if required
    if (order.otp && order.otp !== otp) {
      order.assignment.status = 'pending';
      await order.save();
      return res.status(400).json({ error: 'Invalid OTP. Order status set to pending.' });
    }
    order.assignment.status = 'delivered';
    order.tracking.push({ status: 'Delivered' });
    order.deliveryProof = { signature, photo };
    await order.save();
    // Notify user order delivered
    await Notification.create({
      user: order.customer,
      message: `Your order ${orderId} has been delivered successfully.`
    });
    res.json({ message: 'Order delivered', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Update delivery boy location
exports.updateLocation = async (req, res) => {
  try {
    const { deliveryBoyId, lat, long } = req.body;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    deliveryBoy.location = { lat, long, updatedAt: new Date() };
    await deliveryBoy.save();
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get delivery boy location for an order
exports.getLocationByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order || !order.assignment.deliveryBoy) return res.status(404).json({ error: 'Order or delivery boy not found' });
    const deliveryBoy = await DeliveryBoy.findById(order.assignment.deliveryBoy);
    if (!deliveryBoy || !deliveryBoy.location) return res.status(404).json({ error: 'Location not found' });
    res.json(deliveryBoy.location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get assigned orders for delivery boy
exports.getAssignedOrdersList = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const orders = await Order.find({ 'assignment.deliveryBoy': deliveryBoyId, 'assignment.status': 'accepted' })
      .populate('customer')
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Confirm pickup of order
exports.confirmPickup = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'picked';
    order.tracking.push({ status: 'Picked' });
    await order.save();
    res.json({ message: 'Pickup confirmed', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Order = require('../models/order');
// Get available orders for assignment
exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'assignment.status': 'pending' }).populate('customer');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Accept order assignment
exports.acceptOrder = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'accepted';
    order.assignment.deliveryBoy = deliveryBoyId;
    await order.save();
    // Assign order to delivery boy
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (deliveryBoy && !deliveryBoy.assignedOrders.includes(orderId)) {
      deliveryBoy.assignedOrders.push(orderId);
      await deliveryBoy.save();
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reject order assignment
exports.rejectOrder = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.assignment.status = 'rejected';
    order.assignment.deliveryBoy = deliveryBoyId;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const DeliveryBoy = require('../models/deliveryBoy');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, kyc, vehicle, documents } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const deliveryBoy = await DeliveryBoy.create({
      name, phone, email, password: hashedPassword, kyc, vehicle, documents
    });
    res.status(201).json(deliveryBoy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryBoy = await DeliveryBoy.findOne({ email });
    if (!deliveryBoy) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, deliveryBoy.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: deliveryBoy._id, email: deliveryBoy.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find();
    res.json(deliveryBoys);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.assignOrder = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    deliveryBoy.assignedOrders.push(orderId);
    await deliveryBoy.save();
    res.json(deliveryBoy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delivery boy updates order status to delivered
exports.markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.body;
    const Order = require('../models/order');
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.tracking.push({ status: 'Delivered' });
    await order.save();
    res.json({ message: 'Order marked as delivered', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delivery boy views assigned orders with address and tracking
exports.getAssignedOrders = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const DeliveryBoy = require('../models/deliveryBoy');
    const Order = require('../models/order');
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found' });
    const orders = await Order.find({ _id: { $in: deliveryBoy.assignedOrders } })
      .populate('customer')
      .lean();
    res.json(orders.map(order => ({
      orderId: order._id,
      customer: order.customer,
      deliveryAddress: order.deliveryAddress,
      tracking: order.tracking
    })));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
