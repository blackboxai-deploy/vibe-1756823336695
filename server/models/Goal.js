module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define('Goal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    goalType: {
      type: DataTypes.ENUM('individual', 'team', 'company'),
      defaultValue: 'individual',
    },
    category: {
      type: DataTypes.ENUM('productivity', 'wellbeing', 'skill', 'project', 'okr', 'custom'),
      defaultValue: 'productivity',
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed', 'paused', 'cancelled'),
      defaultValue: 'draft',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    // OKR Structure
    objective: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keyResults: {
      type: DataTypes.JSON,
      defaultValue: [],
      // Example structure:
      // [
      //   {
      //     "id": 1,
      //     "description": "Increase team productivity by 15%",
      //     "target": 15,
      //     "current": 8,
      //     "unit": "percentage",
      //     "completed": false
      //   }
      // ]
    },
    // Progress tracking
    targetValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currentValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'hours', 'tasks', 'percentage', 'points'
    },
    progressPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    // Timeline
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Tracking settings
    autoTracking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    trackingSource: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'productivity_metrics', 'time_entries', 'tasks'
    },
    // Reminders and notifications
    reminderSettings: {
      type: DataTypes.JSON,
      defaultValue: {
        enabled: true,
        frequency: 'weekly',
        reminderDay: 'monday',
        reminderTime: '09:00'
      },
    },
    // Additional metadata
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    milestones: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  }, {
    tableName: 'goals',
    indexes: [
      {
        fields: ['employeeId']
      },
      {
        fields: ['teamId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['category']
      },
      {
        fields: ['dueDate']
      },
      {
        fields: ['goalType']
      }
    ]
  });

  return Goal;
};