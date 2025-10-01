const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.post('/help', adminController.helpRequest);
router.post('/chat', adminController.sendMessage);
router.get('/chat/:userId', adminController.getChat);

module.exports = router;
