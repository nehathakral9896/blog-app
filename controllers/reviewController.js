const Review = require('../models/review');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

exports.addReview = async (req, res) => {
  try {
    const { user, product, order, rating, comment } = req.body;
    // Check if order contains the product and belongs to user
    const orderDoc = await Order.findOne({ _id: order, customer: user, 'items.product': product });
    if (!orderDoc) return res.status(400).json({ error: 'Order not found for this user and product' });
    // Add review
    const review = await Review.create({ user, product, order, rating, comment });
    // Add 5 points to user
    await User.findByIdAndUpdate(user, { $inc: { points: 5 } });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
