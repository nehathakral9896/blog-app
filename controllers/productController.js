exports.redeemPoints = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await require('../models/user').findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return res.status(404).json({ error: 'User or product not found' });
    if (user.points < product.points) return res.status(400).json({ error: 'Not enough points' });
    // Deduct points
    user.points -= product.points;
    await user.save();
    // Here you can create a free order for the product
    res.json({ message: 'Product redeemed for free', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Product = require('../models/product');

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
