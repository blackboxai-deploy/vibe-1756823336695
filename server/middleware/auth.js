const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.employeeId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: require('../models').Company, as: 'company' },
        { model: require('../models').Team, as: 'team' }
      ]
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = employee;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware to check if user belongs to specific company
const requireCompany = (req, res, next) => {
  const companyId = req.params.companyId || req.body.companyId || req.query.companyId;
  
  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  if (req.user.companyId !== parseInt(companyId)) {
    return res.status(403).json({ message: 'Access denied to this company' });
  }

  next();
};

// Middleware to check if user can access specific employee data
const requireSelfOrManager = async (req, res, next) => {
  const targetEmployeeId = req.params.employeeId || req.body.employeeId || req.query.employeeId;
  
  if (!targetEmployeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  const targetId = parseInt(targetEmployeeId);

  // Users can always access their own data
  if (req.user.id === targetId) {
    return next();
  }

  // Admins can access any employee in their company
  if (req.user.role === 'admin') {
    return next();
  }

  // Managers can access their team members' data
  if (req.user.role === 'manager') {
    try {
      const { Team, Employee } = require('../models');
      const team = await Team.findOne({
        where: { managerId: req.user.id },
        include: [{
          model: Employee,
          as: 'employees',
          where: { id: targetId },
          required: false
        }]
      });

      if (team && team.employees.length > 0) {
        return next();
      }
    } catch (error) {
      console.error('Error checking manager permissions:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  }

  return res.status(403).json({ message: 'Access denied to this employee data' });
};

// Utility function to generate JWT token
const generateToken = (employee) => {
  const payload = {
    employeeId: employee.id,
    email: employee.email,
    role: employee.role,
    companyId: employee.companyId
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Utility function to decode token without verification (for info extraction)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireCompany,
  requireSelfOrManager,
  generateToken,
  decodeToken
};