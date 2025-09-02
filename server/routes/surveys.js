const express = require('express');
const { Survey, SurveyResponse } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get active surveys
router.get('/', authenticateToken, async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      where: { 
        companyId: req.user.companyId,
        isActive: true 
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ surveys });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch surveys' });
  }
});

// Submit survey response
router.post('/:surveyId/response', authenticateToken, async (req, res) => {
  try {
    const response = await SurveyResponse.create({
      surveyId: req.params.surveyId,
      employeeId: req.user.id,
      responses: req.body.responses
    });

    res.status(201).json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

module.exports = router;