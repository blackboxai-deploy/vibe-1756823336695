const express = require('express');
const { Employee, Team, Company } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all employees in company
router.get('/', authenticateToken, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { companyId: req.user.companyId },
      attributes: { exclude: ['password'] },
      include: [
        { model: Team, as: 'team', attributes: ['id', 'name'] },
        { model: Company, as: 'company', attributes: ['id', 'name'] }
      ]
    });

    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

module.exports = router;