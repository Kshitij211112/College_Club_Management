const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  applyToPosition,
  updateApplicationStatus
} = require('../controllers/recruitmentController');

router.get('/', getPositions);
router.post('/', protect, createPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);
router.post('/:id/apply', protect, applyToPosition);
router.put('/:id/applications/:appId', protect, updateApplicationStatus);

module.exports = router;
