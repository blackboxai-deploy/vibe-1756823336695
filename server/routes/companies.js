const express = require('express');
const { Company, Employee, Team } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get company details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.companyId !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const company = await Company.findByPk(id, {
      include: [
        { 
          model: Team, 
          as: 'teams',
          include: [{ model: Employee, as: 'employees', attributes: ['id', 'firstName', 'lastName'] }]
        },
        { 
          model: Employee, 
          as: 'employees',
          attributes: ['id', 'firstName', 'lastName', 'role', 'position']
        }
      ]
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company' });
  }
});

module.exports = router;