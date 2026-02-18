const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleHe: { type: String, default: '', trim: true },
    mainImage: { type: String, required: true },
    gallery: [{ type: String }],
    descriptionEn: { type: String, required: true },
    descriptionHe: { type: String, default: '' },
    locationName: { type: String, required: true, trim: true },
    googleMapsEmbed: { type: String, required: true, trim: true },
    openingHours: { type: String, default: 'Check before arrival' },
    contactInfo: { type: String, default: 'N/A' },
    priceInfo: { type: String, default: 'Free / Varies' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', placeSchema);
