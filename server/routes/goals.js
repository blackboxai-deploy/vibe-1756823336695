const express = require('express');
const { Goal, Employee } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get goals for employee
router.get('/:employeeId', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ goals });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
});

// Create goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      employeeId: req.user.id
    });

    res.status(201).json({ goal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal' });
  }
});

module.exports = router;