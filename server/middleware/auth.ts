import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Employee } from '../models';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'remote-team-secret') as any;
    const employee = await Employee.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { association: 'company' },
        { association: 'team' }
      ]
    });

    if (!employee || !employee.is_active) {
      return res.status(403).json({ error: 'Usuário não encontrado ou inativo' });
    }

    req.user = employee;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissão insuficiente' });
    }

    next();
  };
};

export const requireCompanyAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { company_id } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  if (req.user.company_id !== parseInt(company_id)) {
    return res.status(403).json({ error: 'Acesso negado a dados de outra empresa' });
  }

  next();
};