const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authRequired = require('../middleware/auth');

const router = express.Router();

router.get('/', getCategories);
router.post('/', authRequired, createCategory);
router.put('/:id', authRequired, updateCategory);
router.delete('/:id', authRequired, deleteCategory);

module.exports = router;
