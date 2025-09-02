import express from 'express';

const router = express.Router();

// Mock wellbeing survey submission
router.post('/wellbeing', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const surveyData = req.body;
  
  // Mock response - in real app this would save to database
  res.json({ 
    wellbeingScore: {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...surveyData
    }
  });
});

// Mock employee analytics
router.get('/employee/:id?', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const { period = '30d' } = req.query;

  // Generate mock data
  const generateProductivityData = () => {
    const data = [];
    const now = new Date();
    const daysBack = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      data.push({
        date: date.toISOString().split('T')[0],
        productivity_score: Math.round((70 + Math.random() * 25) * 100) / 100,
        tasks_completed: Math.floor(Math.random() * 8) + 2,
        active_hours: Math.round((6 + Math.random() * 3) * 100) / 100,
        focus_time: Math.round((4 + Math.random() * 2) * 100) / 100,
        collaboration_score: Math.round((60 + Math.random() * 30) * 100) / 100
      });
    }
    return data;
  };

  const generateWellbeingData = () => {
    const data = [];
    const now = new Date();
    const daysBack = Math.min(period === '7d' ? 7 : period === '90d' ? 90 : 30, 10); // Limit wellbeing data
    
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000)); // Weekly data
      const stress = Math.round((20 + Math.random() * 40) * 100) / 100;
      const satisfaction = Math.round((60 + Math.random() * 35) * 100) / 100;
      const workLifeBalance = Math.round((55 + Math.random() * 35) * 100) / 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        overall_score: Math.round((satisfaction + workLifeBalance + (100 - stress)) / 3 * 100) / 100,
        stress_level: stress,
        satisfaction_level: satisfaction,
        work_life_balance: workLifeBalance,
        burnout_risk: stress > 60 ? 'high' : stress > 35 ? 'medium' : 'low'
      });
    }
    return data;
  };

  const productivityData = generateProductivityData();
  const wellbeingData = generateWellbeingData();

  const avgProductivity = productivityData.reduce((sum, item) => sum + item.productivity_score, 0) / productivityData.length;
  const avgWellbeing = wellbeingData.reduce((sum, item) => sum + item.overall_score, 0) / wellbeingData.length;

  res.json({
    employee: {
      id: 1,
      name: 'João Silva',
      position: 'CEO'
    },
    summary: {
      avgProductivityScore: Math.round(avgProductivity * 100) / 100,
      avgWellbeingScore: Math.round(avgWellbeing * 100) / 100,
      totalMetrics: productivityData.length,
      period
    },
    productivity: productivityData,
    wellbeing: wellbeingData
  });
});

export default router;