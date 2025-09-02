import express from 'express';

const router = express.Router();

// Mock dashboard data
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const { period = '7d' } = req.query;

  // Generate mock productivity trends for the last 7 days
  const generateTrends = () => {
    const trends = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      trends.push({
        date: date.toISOString().split('T')[0],
        score: Math.round((70 + Math.random() * 25) * 100) / 100
      });
    }
    return trends;
  };

  const mockDashboardData = {
    summary: {
      totalEmployees: 12,
      avgProductivityScore: 82.5,
      avgWellbeingScore: 76.8,
      burnoutRisks: {
        low: 8,
        medium: 3,
        high: 1
      },
      period
    },
    trends: {
      productivity: generateTrends()
    },
    teamPerformance: [
      {
        id: 1,
        name: 'Desenvolvimento',
        memberCount: 6,
        avgProductivityScore: 85.2
      },
      {
        id: 2,
        name: 'Design',
        memberCount: 3,
        avgProductivityScore: 78.9
      },
      {
        id: 3,
        name: 'Marketing',
        memberCount: 3,
        avgProductivityScore: 81.7
      }
    ]
  };

  res.json(mockDashboardData);
});

export default router;