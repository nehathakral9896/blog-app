  // ...existing code...
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const deliveryAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true }
});

const trackingSchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [orderItemSchema],
  deliveryAddress: deliveryAddressSchema,
  tracking: [trackingSchema],
  total: { type: Number, required: true },
  otp: { type: String },
  deliveryProof: {
    signature: String,
    photo: String // URL or file name
  },
  paymentMethod: { type: String }, // e.g. COD, online
  codPayment: {
    collected: { type: Boolean, default: false },
    amount: Number,
    collectedAt: Date
  },
  assignment: {
    status: { type: String, enum: ['pending', 'assigned', 'accepted', 'rejected', 'picked', 'out-for-delivery', 'delivered', 'failed', 'returned'], default: 'pending' },
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy' }
  },
  failedReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
