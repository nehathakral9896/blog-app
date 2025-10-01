const Admin = require('../models/admin');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const admin = await Admin.create({ name, email, password, phone });
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Help/Call back request
exports.helpRequest = async (req, res) => {
  try {
    const { userId, message } = req.body;
    // Notify admin (could be via notification, email, etc.)
    // For now, just return a response
    res.json({ message: 'Admin will call back soon', userId, request: message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Simple chat (store messages)
let chatMessages = [];
exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body; // from: user/admin, to: user/admin
    chatMessages.push({ from, to, text, time: new Date() });
    res.json({ message: 'Message sent', chat: chatMessages });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = chatMessages.filter(msg => msg.from === userId || msg.to === userId);
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
