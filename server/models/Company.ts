import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CompanyAttributes {
  id: number;
  name: string;
  domain: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  settings: object;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public domain!: string;
  public subscription_plan!: 'basic' | 'premium' | 'enterprise';
  public settings!: object;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subscription_plan: {
      type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
      defaultValue: 'basic',
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    underscored: true,
  }
);

export default Company;