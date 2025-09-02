const express = require('express');
const { WellbeingScore, Employee } = require('../models');
const { authenticateToken, requireSelfOrManager } = require('../middleware/auth');

const router = express.Router();

// Get wellbeing scores
router.get('/:employeeId', authenticateToken, requireSelfOrManager, async (req, res) => {
  try {
    const scores = await WellbeingScore.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['date', 'DESC']],
      limit: 30
    });

    res.json({ scores });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wellbeing scores' });
  }
});

// Create wellbeing score
router.post('/', authenticateToken, async (req, res) => {
  try {
    const score = await WellbeingScore.create({
      ...req.body,
      employeeId: req.user.id
    });

    res.status(201).json({ score });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create wellbeing score' });
  }
});

module.exports = router;