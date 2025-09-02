const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { Employee, Company } = require('../models');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('companyName').optional().trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName, companyName, companyId } = req.body;

    // Check if user already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    let company;
    
    if (companyId) {
      // Join existing company
      company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
    } else if (companyName) {
      // Create new company
      company = await Company.create({
        name: companyName,
        domain: email.split('@')[1], // Extract domain from email
      });
    } else {
      return res.status(400).json({ message: 'Either companyId or companyName is required' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create employee
    const employee = await Employee.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyId: company.id,
      role: companyId ? 'employee' : 'admin', // First user of new company becomes admin
    });

    // Generate token
    const token = generateToken(employee);

    // Return user data without password
    const { password: _, ...employeeData } = employee.toJSON();

    res.status(201).json({
      message: 'User registered successfully',
      user: employeeData,
      company: company,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user with company and team data
    const employee = await Employee.findOne({
      where: { email, isActive: true },
      include: [
        { model: Company, as: 'company' },
        { model: require('../models').Team, as: 'team' }
      ]
    });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, employee.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last active timestamp
    await employee.update({ lastActiveAt: new Date() });

    // Generate token
    const token = generateToken(employee);

    // Return user data without password
    const { password: _, ...employeeData } = employee.toJSON();

    res.json({
      message: 'Login successful',
      user: employeeData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Company, as: 'company' },
        { model: require('../models').Team, as: 'team' }
      ]
    });

    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: employee
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Update user profile
router.put('/me', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('position').optional().trim(),
  body('timezone').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, position, timezone, settings } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (position !== undefined) updateData.position = position;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (settings !== undefined) updateData.settings = settings;

    await req.user.update(updateData);

    const updatedEmployee = await Employee.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Company, as: 'company' },
        { model: require('../models').Team, as: 'team' }
      ]
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedEmployee
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const employee = await Employee.findByPk(req.user.id);
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, employee.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await employee.update({ password: hashedPassword });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Failed to change password', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Logout (token invalidation would be handled on client side)
router.post('/logout', authenticateToken, (req, res) => {
  // In a more sophisticated setup, you might maintain a token blacklist
  // For now, we'll just return a success message
  res.json({
    message: 'Logged out successfully'
  });
});

module.exports = router;