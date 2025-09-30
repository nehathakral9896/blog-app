const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  age: { type: Number, min: 18 },
  points: { type: Number, default: 0 },
  provider: {
    type: String,
    enum: ['local', 'facebook', 'instagram', 'google'],
    default: 'local'
  },
  providerId: {
    type: String
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

userSchema.virtual('info').get(function() {
  return `${this.name} (${this.email})`;
});

userSchema.pre('save', function(next){
  console.log(`Saving user: ${this.name}`);
  next();
});

module.exports = mongoose.model('User', userSchema);