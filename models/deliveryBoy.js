const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kyc: {
    aadhaar: String,
    pan: String,
    drivingLicense: String
  },
  vehicle: {
    type: String,
    number: String
  },
  documents: [String], // URLs or file names
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  location: {
    lat: Number,
    long: Number,
    updatedAt: Date
  }
});

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);
