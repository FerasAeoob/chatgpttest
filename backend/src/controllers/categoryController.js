const Category = require('../models/Category');

exports.getCategories = async (_, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch categories.', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nameEn, nameHe, slug, isActive } = req.body;

    if (!nameEn || !slug) {
      return res.status(400).json({ message: 'nameEn and slug are required.' });
    }

    const category = await Category.create({ nameEn, nameHe, slug, isActive });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create category.', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update category.', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete category.', error: error.message });
  }
};
