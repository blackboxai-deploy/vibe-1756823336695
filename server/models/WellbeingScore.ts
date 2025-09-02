import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';

interface WellbeingScoreAttributes {
  id: number;
  employee_id: number;
  date: Date;
  overall_score: number;
  stress_level: number;
  satisfaction_level: number;
  work_life_balance: number;
  energy_level: number;
  motivation_level: number;
  burnout_risk: 'low' | 'medium' | 'high';
  survey_responses: object;
  created_at: Date;
  updated_at: Date;
}

interface WellbeingScoreCreationAttributes extends Optional<WellbeingScoreAttributes, 'id' | 'created_at' | 'updated_at'> {}

class WellbeingScore extends Model<WellbeingScoreAttributes, WellbeingScoreCreationAttributes> implements WellbeingScoreAttributes {
  public id!: number;
  public employee_id!: number;
  public date!: Date;
  public overall_score!: number;
  public stress_level!: number;
  public satisfaction_level!: number;
  public work_life_balance!: number;
  public energy_level!: number;
  public motivation_level!: number;
  public burnout_risk!: 'low' | 'medium' | 'high';
  public survey_responses!: object;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

WellbeingScore.init(
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
    overall_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    stress_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    satisfaction_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    work_life_balance: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    energy_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    motivation_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    burnout_risk: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'low',
    },
    survey_responses: {
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
    modelName: 'WellbeingScore',
    tableName: 'wellbeing_scores',
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
        fields: ['overall_score'],
      },
      {
        fields: ['burnout_risk'],
      },
    ],
  }
);

export default WellbeingScore;