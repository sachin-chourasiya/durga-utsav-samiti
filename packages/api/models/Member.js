const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  month: String,
  status: { type: String, enum: ['paid','pending'], default:'pending' },
  amount: { type: Number, default: 100 }
});

const memberSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin','member'], default:'member' },
  payments: [paymentSchema],
});

module.exports = mongoose.model('Member', memberSchema);