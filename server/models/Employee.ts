import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Company from './Company';
import Team from './Team';

interface EmployeeAttributes {
  id: number;
  company_id: number;
  team_id: number | null;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'employee';
  position: string;
  hire_date: Date;
  timezone: string;
  avatar_url: string | null;
  privacy_settings: object;
  is_active: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'team_id' | 'avatar_url' | 'last_login_at' | 'created_at' | 'updated_at'> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public company_id!: number;
  public team_id!: number | null;
  public email!: string;
  public password_hash!: string;
  public first_name!: string;
  public last_name!: string;
  public role!: 'admin' | 'manager' | 'employee';
  public position!: string;
  public hire_date!: Date;
  public timezone!: string;
  public avatar_url!: string | null;
  public privacy_settings!: object;
  public is_active!: boolean;
  public last_login_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'employee'),
      defaultValue: 'employee',
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC',
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    privacy_settings: {
      type: DataTypes.JSON,
      defaultValue: {
        share_productivity_data: true,
        share_wellbeing_data: true,
        anonymous_benchmarks: true,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    underscored: true,
  }
);

export default Employee;