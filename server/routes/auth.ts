import express from 'express';

const router = express.Router();

// Simple mock authentication for testing
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Mock user data
  const mockUser = {
    id: 1,
    email: email,
    first_name: 'João',
    last_name: 'Silva',
    role: 'admin',
    position: 'CEO',
    company: {
      id: 1,
      name: 'Empresa Demo',
      domain: 'demo.com'
    },
    team: {
      id: 1,
      name: 'Equipe Principal'
    },
    privacy_settings: {
      share_productivity_data: true,
      share_wellbeing_data: true,
      anonymous_benchmarks: true,
    }
  };

  const mockToken = 'mock-jwt-token-' + Date.now();

  res.json({
    token: mockToken,
    user: mockUser
  });
});

router.post('/register', (req, res) => {
  const userData = req.body;
  
  if (!userData.email || !userData.password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const mockUser = {
    id: 2,
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: 'admin',
    position: userData.position,
    company: {
      id: 1,
      name: userData.company_name,
      domain: userData.company_domain
    },
    privacy_settings: {
      share_productivity_data: true,
      share_wellbeing_data: true,
      anonymous_benchmarks: true,
    }
  };

  const mockToken = 'mock-jwt-token-' + Date.now();

  res.status(201).json({
    token: mockToken,
    user: mockUser
  });
});

router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const mockUser = {
    id: 1,
    email: 'joao@demo.com',
    first_name: 'João',
    last_name: 'Silva',
    role: 'admin',
    position: 'CEO',
    company: {
      id: 1,
      name: 'Empresa Demo',
      domain: 'demo.com'
    },
    team: {
      id: 1,
      name: 'Equipe Principal'
    },
    privacy_settings: {
      share_productivity_data: true,
      share_wellbeing_data: true,
      anonymous_benchmarks: true,
    }
  };

  res.json({ user: mockUser });
});

export default router;