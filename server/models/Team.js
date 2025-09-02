module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    goals: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        collaborationTracking: true,
        meetingAnalysis: true,
        productivityGoals: {
          tasksPerWeek: 10,
          hoursPerWeek: 40,
          meetingHoursLimit: 10
        }
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'teams',
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['managerId']
      },
      {
        fields: ['name', 'companyId']
      }
    ]
  });

  return Team;
};