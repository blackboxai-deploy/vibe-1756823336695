import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Company from './Company';

interface TeamAttributes {
  id: number;
  company_id: number;
  name: string;
  description: string;
  manager_id: number;
  settings: object;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: number;
  public company_id!: number;
  public name!: string;
  public description!: string;
  public manager_id!: number;
  public settings!: object;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Team.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
    underscored: true,
  }
);

export default Team;