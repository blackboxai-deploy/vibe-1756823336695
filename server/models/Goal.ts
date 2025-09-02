import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';
import Team from './Team';

interface GoalAttributes {
  id: number;
  employee_id: number | null;
  team_id: number | null;
  title: string;
  description: string;
  goal_type: 'individual' | 'team' | 'company';
  target_value: number;
  current_value: number;
  unit: string;
  start_date: Date;
  end_date: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  completion_percentage: number;
  key_results: object;
  created_at: Date;
  updated_at: Date;
}

interface GoalCreationAttributes extends Optional<GoalAttributes, 'id' | 'employee_id' | 'team_id' | 'current_value' | 'completion_percentage' | 'created_at' | 'updated_at'> {}

class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: number;
  public employee_id!: number | null;
  public team_id!: number | null;
  public title!: string;
  public description!: string;
  public goal_type!: 'individual' | 'team' | 'company';
  public target_value!: number;
  public current_value!: number;
  public unit!: string;
  public start_date!: Date;
  public end_date!: Date;
  public priority!: 'low' | 'medium' | 'high';
  public status!: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  public completion_percentage!: number;
  public key_results!: object;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Team,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    goal_type: {
      type: DataTypes.ENUM('individual', 'team', 'company'),
      allowNull: false,
    },
    target_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    current_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'not_started',
    },
    completion_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    key_results: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Goal',
    tableName: 'goals',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['employee_id'],
      },
      {
        fields: ['team_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['end_date'],
      },
    ],
  }
);

export default Goal;