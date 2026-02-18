const Place = require('../models/Place');

exports.getPlaces = async (req, res) => {
  try {
    const { category, q, published, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (q) filter.titleEn = { $regex: q, $options: 'i' };
    if (published === 'true') filter.isPublished = true;
    if (published === 'false') filter.isPublished = false;
    if (featured === 'true') filter.featured = true;

    const places = await Place.find(filter).populate('category').sort({ createdAt: -1 });
    return res.json(places);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch places.', error: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('category');
    if (!place) return res.status(404).json({ message: 'Place not found.' });
    return res.json(place);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch place.', error: error.message });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || {};

    const mainImage = files.mainImage?.[0]?.filename;
    const gallery = files.gallery?.map((file) => file.filename) || [];

    if (!body.titleEn || !body.descriptionEn || !body.locationName || !body.googleMapsEmbed || !body.category || !mainImage) {
      return res.status(400).json({ message: 'Missing required place fields.' });
    }

    const place = await Place.create({
      ...body,
      featured: body.featured === 'true' || body.featured === true,
      isPublished: body.isPublished !== 'false',
      mainImage,
      gallery
    });

    return res.status(201).json(place);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create place.', error: error.message });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const files = req.files || {};
    const updateData = { ...req.body };

    if (files.mainImage?.[0]?.filename) {
      updateData.mainImage = files.mainImage[0].filename;
    }
    if (files.gallery?.length) {
      updateData.gallery = files.gallery.map((file) => file.filename);
    }

    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    if (updateData.isPublished !== undefined) {
      updateData.isPublished = updateData.isPublished === 'true' || updateData.isPublished === true;
    }

    const place = await Place.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!place) return res.status(404).json({ message: 'Place not found.' });
    return res.json(place);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update place.', error: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found.' });
    return res.json({ message: 'Place deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete place.', error: error.message });
  }
};
