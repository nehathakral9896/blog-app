const User = require('../models/user');
// Send special offer notification to all users
exports.sendFestivalOffer = async (req, res) => {
  try {
    const { festival, offer } = req.body;
    const users = await User.find();
    const notifications = await Promise.all(users.map(user =>
      Notification.create({
        user: user._id,
        message: `Special offer for ${festival}: ${offer}`
      })
    ));
    res.json({ message: `Offer sent to all users for ${festival}`, notifications });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Notification = require('../models/notification');

exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
