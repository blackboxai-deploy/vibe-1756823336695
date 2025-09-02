import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Employee, Company } from '../models';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      });
    }

    const employee = await Employee.findOne({
      where: { email, is_active: true },
      include: [
        { association: 'company' },
        { association: 'team' }
      ]
    });

    if (!employee || !await bcrypt.compare(password, employee.password_hash)) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas' 
      });
    }

    // Update last login
    await employee.update({ last_login_at: new Date() });

    const token = jwt.sign(
      { 
        id: employee.id, 
        email: employee.email,
        role: employee.role,
        company_id: employee.company_id
      },
      process.env.JWT_SECRET || 'remote-team-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: employee.id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        position: employee.position,
        company: employee.company,
        team: employee.team,
        avatar_url: employee.avatar_url,
        privacy_settings: employee.privacy_settings,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      position,
      company_name,
      company_domain 
    } = req.body;

    if (!email || !password || !first_name || !last_name || !position || !company_name || !company_domain) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios' 
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ 
        error: 'Email já está em uso' 
      });
    }

    // Find or create company
    let company = await Company.findOne({ where: { domain: company_domain } });
    if (!company) {
      company = await Company.create({
        name: company_name,
        domain: company_domain,
        subscription_plan: 'basic'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create employee (first employee becomes admin)
    const employeeCount = await Employee.count({ where: { company_id: company.id } });
    const role = employeeCount === 0 ? 'admin' : 'employee';

    const employee = await Employee.create({
      email,
      password_hash,
      first_name,
      last_name,
      role,
      position,
      company_id: company.id,
      hire_date: new Date(),
      timezone: 'America/Sao_Paulo'
    });

    const token = jwt.sign(
      { 
        id: employee.id, 
        email: employee.email,
        role: employee.role,
        company_id: employee.company_id
      },
      process.env.JWT_SECRET || 'remote-team-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: employee.id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        position: employee.position,
        company: company,
        privacy_settings: employee.privacy_settings,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByPk((req as any).user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { association: 'company' },
        { association: 'team' }
      ]
    });

    if (!employee) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: employee });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};