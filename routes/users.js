const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/', userController.getUsers);

module.exports = router;