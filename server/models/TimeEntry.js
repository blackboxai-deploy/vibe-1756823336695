module.exports = (sequelize, DataTypes) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('focus', 'meeting', 'communication', 'break', 'admin', 'other'),
      defaultValue: 'focus',
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'coding', 'design', 'planning', 'review'
    },
    isManual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    source: {
      type: DataTypes.ENUM('manual', 'automatic', 'integration'),
      defaultValue: 'manual',
    },
    integrationData: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isProductive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'time_entries',
    indexes: [
      {
        fields: ['employeeId']
      },
      {
        fields: ['taskId']
      },
      {
        fields: ['startTime']
      },
      {
        fields: ['category']
      },
      {
        fields: ['employeeId', 'startTime']
      }
    ]
  });

  return TimeEntry;
};