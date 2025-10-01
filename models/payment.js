const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['googlepay', 'phonepe', 'paytm', 'creditcard', 'debitcard', 'cash', 'bank', 'stripe', 'upi'],
    required: true
  },
  stripePaymentId: { type: String },
  tax: { type: Number, default: 20 },
  codCharge: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
