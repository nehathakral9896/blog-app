const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');
const customerRoutes = require('./routes/customers');

const commentRoutes = require('./routes/comments');
const orderRoutes = require('./routes/orders');

const deliveryBoyRoutes = require('./routes/deliveryBoys');
const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;

// MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/payments', paymentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/customers', customerRoutes);


app.use('/comments', commentRoutes);

app.use('/orders', orderRoutes);
app.use('/delivery-boys', deliveryBoyRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
