module.exports = (sequelize, DataTypes) => {
  const ProductivityMetric = sequelize.define('ProductivityMetric', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Overall productivity score (0-100)
    productivityScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    // Time-based metrics
    hoursWorked: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    focusTimeHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    meetingHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    // Task-based metrics
    tasksCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tasksCreated: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Communication metrics
    messagessent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    collaborationScore: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    // Code metrics (for developers)
    codeCommits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    codeReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Additional metrics
    additionalMetrics: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    // Calculated metrics
    efficiencyScore: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    qualityScore: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
  }, {
    tableName: 'productivity_metrics',
    indexes: [
      {
        unique: true,
        fields: ['employeeId', 'date']
      },
      {
        fields: ['date']
      },
      {
        fields: ['employeeId']
      },
      {
        fields: ['productivityScore']
      }
    ]
  });

  return ProductivityMetric;
};