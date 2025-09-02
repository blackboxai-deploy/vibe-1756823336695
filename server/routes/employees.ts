import express from 'express';
import { Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Employee, Team, Company } from '../models';

const router = express.Router();

// Get all employees (admin/manager only)
router.get('/', authenticateToken, requireRole(['admin', 'manager']), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    const employees = await Employee.findAll({
      where: { company_id: user.company_id },
      attributes: { exclude: ['password_hash'] },
      include: [
        { association: 'team' },
        { association: 'company' }
      ],
      order: [['first_name', 'ASC']]
    });

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// Get employee by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Only allow access to own data or if admin/manager
    if (user.role === 'employee' && user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const employee = await Employee.findOne({
      where: { 
        id: parseInt(id),
        company_id: user.company_id
      },
      attributes: { exclude: ['password_hash'] },
      include: [
        { association: 'team' },
        { association: 'company' }
      ]
    });

    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ employee });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

// Update employee
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const updateData = req.body;

    // Only allow self-update or admin/manager update
    if (user.role === 'employee' && user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Remove sensitive fields that can't be updated via this endpoint
    delete updateData.password_hash;
    delete updateData.email;
    delete updateData.company_id;
    if (user.role !== 'admin') {
      delete updateData.role;
    }

    const employee = await Employee.findOne({
      where: { 
        id: parseInt(id),
        company_id: user.company_id
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    await employee.update(updateData);

    const updatedEmployee = await Employee.findByPk(employee.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { association: 'team' },
        { association: 'company' }
      ]
    });

    res.json({ employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

export default router;