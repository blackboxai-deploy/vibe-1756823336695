import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';

interface SurveyAttributes {
  id: number;
  employee_id: number;
  survey_type: 'weekly' | 'monthly' | 'custom';
  questions: object;
  responses: object;
  completion_date: Date;
  is_anonymous: boolean;
  created_at: Date;
  updated_at: Date;
}

interface SurveyCreationAttributes extends Optional<SurveyAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Survey extends Model<SurveyAttributes, SurveyCreationAttributes> implements SurveyAttributes {
  public id!: number;
  public employee_id!: number;
  public survey_type!: 'weekly' | 'monthly' | 'custom';
  public questions!: object;
  public responses!: object;
  public completion_date!: Date;
  public is_anonymous!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Survey.init(
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
    survey_type: {
      type: DataTypes.ENUM('weekly', 'monthly', 'custom'),
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    responses: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    completion_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'Survey',
    tableName: 'surveys',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['employee_id', 'survey_type'],
      },
      {
        fields: ['completion_date'],
      },
    ],
  }
);

export default Survey;