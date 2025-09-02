const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const { ProductivityMetric, Employee, Team } = require('../models');
const { authenticateToken, requireSelfOrManager } = require('../middleware/auth');

const router = express.Router();

// Get productivity metrics for an employee
router.get('/productivity/:employeeId', authenticateToken, requireSelfOrManager, [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
  query('period').optional().isIn(['day', 'week', 'month']).withMessage('Period must be day, week, or month'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { employeeId } = req.params;
    const { startDate, endDate, period = 'week' } = req.query;

    // Calculate date range
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.date[Op.lte] = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { [Op.gte]: thirtyDaysAgo };
    }

    const metrics = await ProductivityMetric.findAll({
      where: {
        employeeId: parseInt(employeeId),
        ...dateFilter
      },
      order: [['date', 'DESC']],
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['firstName', 'lastName', 'position']
      }]
    });

    // Calculate aggregated metrics
    const aggregatedMetrics = calculateAggregatedMetrics(metrics);

    res.json({
      metrics,
      aggregated: aggregatedMetrics,
      period,
      dateRange: dateFilter
    });

  } catch (error) {
    console.error('Get productivity metrics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch productivity metrics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Create or update daily productivity metric
router.post('/productivity', authenticateToken, [
  body('employeeId').isInt().withMessage('Employee ID must be an integer'),
  body('date').isISO8601().toDate().withMessage('Date must be valid ISO date'),
  body('hoursWorked').optional().isFloat({ min: 0, max: 24 }).withMessage('Hours worked must be between 0 and 24'),
  body('tasksCompleted').optional().isInt({ min: 0 }).withMessage('Tasks completed must be non-negative integer'),
  body('meetingHours').optional().isFloat({ min: 0 }).withMessage('Meeting hours must be non-negative'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { employeeId, date, ...metricData } = req.body;

    // Check if user can update this employee's data
    if (req.user.id !== employeeId && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to update this employee data' });
    }

    // Calculate productivity score based on various factors
    const productivityScore = calculateProductivityScore(metricData);

    const [metric, created] = await ProductivityMetric.upsert({
      employeeId,
      date: new Date(date).toISOString().split('T')[0], // Ensure date only
      productivityScore,
      ...metricData
    }, {
      returning: true
    });

    res.status(created ? 201 : 200).json({
      message: created ? 'Productivity metric created' : 'Productivity metric updated',
      metric
    });

  } catch (error) {
    console.error('Create/update productivity metric error:', error);
    res.status(500).json({ 
      message: 'Failed to save productivity metric', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Get team productivity overview
router.get('/team/:teamId/productivity', authenticateToken, [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { teamId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if user has access to this team
    const team = await Team.findByPk(teamId, {
      include: [{
        model: Employee,
        as: 'employees',
        attributes: ['id', 'firstName', 'lastName', 'position']
      }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check permissions
    const hasAccess = req.user.role === 'admin' || 
                     req.user.role === 'manager' || 
                     team.employees.some(emp => emp.id === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this team' });
    }

    // Calculate date range
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.date[Op.lte] = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.date = { [Op.gte]: thirtyDaysAgo };
    }

    const metrics = await ProductivityMetric.findAll({
      where: {
        employeeId: { [Op.in]: team.employees.map(emp => emp.id) },
        ...dateFilter
      },
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'firstName', 'lastName', 'position']
      }],
      order: [['date', 'DESC']]
    });

    // Group metrics by employee and calculate team averages
    const teamMetrics = calculateTeamMetrics(metrics, team.employees);

    res.json({
      team: {
        id: team.id,
        name: team.name,
        employeeCount: team.employees.length
      },
      metrics: teamMetrics,
      dateRange: dateFilter
    });

  } catch (error) {
    console.error('Get team productivity error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch team productivity', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Get productivity insights and recommendations
router.get('/insights/:employeeId', authenticateToken, requireSelfOrManager, async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Get last 30 days of metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const metrics = await ProductivityMetric.findAll({
      where: {
        employeeId: parseInt(employeeId),
        date: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['date', 'DESC']]
    });

    if (metrics.length === 0) {
      return res.json({
        insights: [],
        recommendations: ['Start tracking your daily activities to get personalized insights']
      });
    }

    const insights = generateProductivityInsights(metrics);

    res.json({
      insights,
      recommendations: generateRecommendations(insights),
      basedOnDays: metrics.length
    });

  } catch (error) {
    console.error('Get productivity insights error:', error);
    res.status(500).json({ 
      message: 'Failed to generate insights', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Utility functions
function calculateProductivityScore(metricData) {
  const {
    hoursWorked = 0,
    focusTimeHours = 0,
    tasksCompleted = 0,
    meetingHours = 0,
    collaborationScore = 0
  } = metricData;

  // Basic productivity score calculation (0-100)
  let score = 0;

  // Hours worked factor (0-30 points)
  if (hoursWorked >= 6 && hoursWorked <= 10) {
    score += 30;
  } else if (hoursWorked >= 4) {
    score += 20;
  } else if (hoursWorked >= 2) {
    score += 10;
  }

  // Focus time ratio (0-25 points)
  const focusRatio = hoursWorked > 0 ? (focusTimeHours / hoursWorked) : 0;
  if (focusRatio >= 0.6) score += 25;
  else if (focusRatio >= 0.4) score += 18;
  else if (focusRatio >= 0.2) score += 10;

  // Tasks completed (0-25 points)
  if (tasksCompleted >= 8) score += 25;
  else if (tasksCompleted >= 5) score += 20;
  else if (tasksCompleted >= 3) score += 15;
  else if (tasksCompleted >= 1) score += 10;

  // Meeting balance (0-10 points) - not too many, not too few
  const meetingRatio = hoursWorked > 0 ? (meetingHours / hoursWorked) : 0;
  if (meetingRatio >= 0.1 && meetingRatio <= 0.3) score += 10;
  else if (meetingRatio <= 0.5) score += 5;

  // Collaboration score (0-10 points)
  score += Math.min(collaborationScore / 10, 10);

  return Math.min(Math.max(score, 0), 100);
}

function calculateAggregatedMetrics(metrics) {
  if (metrics.length === 0) return {};

  const totals = metrics.reduce((acc, metric) => {
    acc.productivityScore += parseFloat(metric.productivityScore) || 0;
    acc.hoursWorked += parseFloat(metric.hoursWorked) || 0;
    acc.focusTimeHours += parseFloat(metric.focusTimeHours) || 0;
    acc.meetingHours += parseFloat(metric.meetingHours) || 0;
    acc.tasksCompleted += parseInt(metric.tasksCompleted) || 0;
    acc.collaborationScore += parseFloat(metric.collaborationScore) || 0;
    return acc;
  }, {
    productivityScore: 0,
    hoursWorked: 0,
    focusTimeHours: 0,
    meetingHours: 0,
    tasksCompleted: 0,
    collaborationScore: 0
  });

  const count = metrics.length;

  return {
    averageProductivityScore: (totals.productivityScore / count).toFixed(2),
    totalHoursWorked: totals.hoursWorked.toFixed(2),
    averageHoursPerDay: (totals.hoursWorked / count).toFixed(2),
    totalFocusHours: totals.focusTimeHours.toFixed(2),
    totalMeetingHours: totals.meetingHours.toFixed(2),
    totalTasksCompleted: totals.tasksCompleted,
    averageTasksPerDay: (totals.tasksCompleted / count).toFixed(2),
    averageCollaborationScore: (totals.collaborationScore / count).toFixed(2),
    focusTimePercentage: totals.hoursWorked > 0 ? ((totals.focusTimeHours / totals.hoursWorked) * 100).toFixed(1) : '0.0',
    meetingTimePercentage: totals.hoursWorked > 0 ? ((totals.meetingHours / totals.hoursWorked) * 100).toFixed(1) : '0.0'
  };
}

function calculateTeamMetrics(metrics, teamMembers) {
  // Group by employee
  const employeeMetrics = {};
  teamMembers.forEach(emp => {
    employeeMetrics[emp.id] = {
      employee: emp,
      metrics: metrics.filter(m => m.employeeId === emp.id),
      aggregated: null
    };
  });

  // Calculate aggregated metrics for each employee
  Object.keys(employeeMetrics).forEach(empId => {
    const empData = employeeMetrics[empId];
    empData.aggregated = calculateAggregatedMetrics(empData.metrics);
  });

  // Calculate team averages
  const teamAverages = calculateTeamAverages(Object.values(employeeMetrics));

  return {
    employees: employeeMetrics,
    teamAverages
  };
}

function calculateTeamAverages(employeeData) {
  const validEmployees = employeeData.filter(emp => emp.aggregated && Object.keys(emp.aggregated).length > 0);
  
  if (validEmployees.length === 0) return {};

  const totals = validEmployees.reduce((acc, emp) => {
    const agg = emp.aggregated;
    acc.productivityScore += parseFloat(agg.averageProductivityScore) || 0;
    acc.hoursPerDay += parseFloat(agg.averageHoursPerDay) || 0;
    acc.tasksPerDay += parseFloat(agg.averageTasksPerDay) || 0;
    acc.collaborationScore += parseFloat(agg.averageCollaborationScore) || 0;
    acc.focusTimePercentage += parseFloat(agg.focusTimePercentage) || 0;
    return acc;
  }, {
    productivityScore: 0,
    hoursPerDay: 0,
    tasksPerDay: 0,
    collaborationScore: 0,
    focusTimePercentage: 0
  });

  const count = validEmployees.length;

  return {
    averageProductivityScore: (totals.productivityScore / count).toFixed(2),
    averageHoursPerDay: (totals.hoursPerDay / count).toFixed(2),
    averageTasksPerDay: (totals.tasksPerDay / count).toFixed(2),
    averageCollaborationScore: (totals.collaborationScore / count).toFixed(2),
    averageFocusTimePercentage: (totals.focusTimePercentage / count).toFixed(1),
    activeEmployees: count,
    totalEmployees: employeeData.length
  };
}

function generateProductivityInsights(metrics) {
  const insights = [];
  const aggregated = calculateAggregatedMetrics(metrics);

  // Productivity trend analysis
  const recentMetrics = metrics.slice(0, 7); // Last 7 days
  const olderMetrics = metrics.slice(7, 14); // Previous 7 days

  if (recentMetrics.length >= 3 && olderMetrics.length >= 3) {
    const recentAvg = recentMetrics.reduce((sum, m) => sum + parseFloat(m.productivityScore), 0) / recentMetrics.length;
    const olderAvg = olderMetrics.reduce((sum, m) => sum + parseFloat(m.productivityScore), 0) / olderMetrics.length;
    
    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (trend > 10) {
      insights.push({
        type: 'positive',
        title: 'Productivity Improving',
        message: `Your productivity has increased by ${trend.toFixed(1)}% over the past week`
      });
    } else if (trend < -10) {
      insights.push({
        type: 'warning',
        title: 'Productivity Declining',
        message: `Your productivity has decreased by ${Math.abs(trend).toFixed(1)}% over the past week`
      });
    }
  }

  // Focus time analysis
  const avgFocusPercentage = parseFloat(aggregated.focusTimePercentage);
  if (avgFocusPercentage < 40) {
    insights.push({
      type: 'improvement',
      title: 'Low Focus Time',
      message: `Only ${avgFocusPercentage}% of your time is spent in focus mode. Try blocking calendar time for deep work.`
    });
  }

  // Meeting overload check
  const avgMeetingPercentage = parseFloat(aggregated.meetingTimePercentage);
  if (avgMeetingPercentage > 50) {
    insights.push({
      type: 'warning',
      title: 'Meeting Overload',
      message: `${avgMeetingPercentage}% of your time is spent in meetings. Consider declining non-essential meetings.`
    });
  }

  return insights;
}

function generateRecommendations(insights) {
  const recommendations = [];

  insights.forEach(insight => {
    switch (insight.type) {
      case 'warning':
        if (insight.title.includes('Productivity Declining')) {
          recommendations.push('Take a short break and reassess your priorities');
          recommendations.push('Consider time-blocking your calendar for focused work');
        }
        if (insight.title.includes('Meeting Overload')) {
          recommendations.push('Audit your recurring meetings and decline non-essential ones');
          recommendations.push('Suggest shorter meeting durations (25min instead of 30min)');
        }
        break;
      case 'improvement':
        if (insight.title.includes('Low Focus Time')) {
          recommendations.push('Block 2-hour focus sessions in your calendar');
          recommendations.push('Use the Pomodoro technique for better focus management');
        }
        break;
    }
  });

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('Keep up the good work! Your productivity metrics look healthy.');
    recommendations.push('Consider setting weekly goals to maintain momentum.');
  }

  return recommendations;
}

module.exports = router;