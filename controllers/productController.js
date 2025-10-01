
const Product = require('../models/product');

exports.redeemPoints = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const User = require('../models/user');
    const Order = require('../models/order');
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return res.status(404).json({ error: 'User or product not found' });
    if (user.points < product.points) return res.status(400).json({ error: 'Not enough points' });
    // Deduct points
    user.points -= product.points;
    // Add product to redeemedProducts
    user.redeemedProducts.push(product._id);
    await user.save();
    // Optionally, create a free order for the product
    await Order.create({
      customer: user._id,
      items: [{ product: product.name, quantity: 1, price: 0 }],
      deliveryAddress: {},
      tracking: [{ status: 'Redeemed', updatedAt: new Date() }],
      total: 0,
      paymentMethod: 'points',
      assignment: { status: 'pending' }
    });
    res.json({ message: 'Product redeemed for free', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
