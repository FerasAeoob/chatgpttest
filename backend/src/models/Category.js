const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true, unique: true, trim: true },
    nameHe: { type: String, default: '', trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
