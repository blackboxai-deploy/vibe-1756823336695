const express = require('express');
const { Integration } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get company integrations
router.get('/', authenticateToken, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const integrations = await Integration.findAll({
      where: { companyId: req.user.companyId },
      attributes: { exclude: ['credentials', 'accessToken', 'refreshToken'] }
    });

    res.json({ integrations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch integrations' });
  }
});

module.exports = router;