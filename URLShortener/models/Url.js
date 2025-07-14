const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortcode: { type: String, unique: true },
  expiry: Date,
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema],
  clickCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Url', urlSchema);
