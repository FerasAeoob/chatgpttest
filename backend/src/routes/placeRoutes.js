const express = require('express');
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placeController');
const authRequired = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]);

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', authRequired, uploadFields, createPlace);
router.put('/:id', authRequired, uploadFields, updatePlace);
router.delete('/:id', authRequired, deletePlace);

module.exports = router;
