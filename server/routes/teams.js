const express = require('express');
const { Team, Employee } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get team details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: Employee, as: 'employees', attributes: ['id', 'firstName', 'lastName', 'position'] },
        { model: Employee, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

module.exports = router;