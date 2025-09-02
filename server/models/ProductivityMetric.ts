import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';

interface ProductivityMetricAttributes {
  id: number;
  employee_id: number;
  date: Date;
  productivity_score: number;
  tasks_completed: number;
  active_hours: number;
  focus_time: number;
  collaboration_score: number;
  code_commits: number;
  meetings_attended: number;
  meeting_duration: number;
  late_responses: number;
  quality_score: number;
  raw_data: object;
  created_at: Date;
  updated_at: Date;
}

interface ProductivityMetricCreationAttributes extends Optional<ProductivityMetricAttributes, 'id' | 'created_at' | 'updated_at'> {}

class ProductivityMetric extends Model<ProductivityMetricAttributes, ProductivityMetricCreationAttributes> implements ProductivityMetricAttributes {
  public id!: number;
  public employee_id!: number;
  public date!: Date;
  public productivity_score!: number;
  public tasks_completed!: number;
  public active_hours!: number;
  public focus_time!: number;
  public collaboration_score!: number;
  public code_commits!: number;
  public meetings_attended!: number;
  public meeting_duration!: number;
  public late_responses!: number;
  public quality_score!: number;
  public raw_data!: object;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProductivityMetric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    productivity_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    tasks_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    active_hours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    focus_time: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    collaboration_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    code_commits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    meetings_attended: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    meeting_duration: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    late_responses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quality_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    raw_data: {
      type: DataTypes.JSON,
      defaultValue: {},
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
    modelName: 'ProductivityMetric',
    tableName: 'productivity_metrics',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['employee_id', 'date'],
      },
      {
        fields: ['date'],
      },
      {
        fields: ['productivity_score'],
      },
    ],
  }
);

export default ProductivityMetric;