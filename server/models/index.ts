import sequelize from '../config/database';
import Company from './Company';
import Team from './Team';
import Employee from './Employee';
import ProductivityMetric from './ProductivityMetric';
import WellbeingScore from './WellbeingScore';
import Survey from './Survey';
import Goal from './Goal';

// Define associations
Company.hasMany(Team, { foreignKey: 'company_id', as: 'teams' });
Company.hasMany(Employee, { foreignKey: 'company_id', as: 'employees' });

Team.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Team.hasMany(Employee, { foreignKey: 'team_id', as: 'members' });
Team.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Team.hasMany(Goal, { foreignKey: 'team_id', as: 'goals' });

Employee.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Employee.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });
Employee.hasMany(ProductivityMetric, { foreignKey: 'employee_id', as: 'productivityMetrics' });
Employee.hasMany(WellbeingScore, { foreignKey: 'employee_id', as: 'wellbeingScores' });
Employee.hasMany(Survey, { foreignKey: 'employee_id', as: 'surveys' });
Employee.hasMany(Goal, { foreignKey: 'employee_id', as: 'goals' });

ProductivityMetric.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

WellbeingScore.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

Survey.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

Goal.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Goal.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });

export {
  sequelize,
  Company,
  Team,
  Employee,
  ProductivityMetric,
  WellbeingScore,
  Survey,
  Goal,
};

export default {
  sequelize,
  Company,
  Team,
  Employee,
  ProductivityMetric,
  WellbeingScore,
  Survey,
  Goal,
};