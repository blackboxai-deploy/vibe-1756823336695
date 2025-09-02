module.exports = (sequelize, DataTypes) => {
  const WellbeingScore = sequelize.define('WellbeingScore', {
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
    // Overall wellbeing score (0-100)
    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    // Stress and burnout indicators
    stressLevel: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    burnoutRisk: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'low',
    },
    // Work-life balance
    workLifeBalance: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    workload: {
      type: DataTypes.ENUM('light', 'normal', 'heavy', 'overwhelming'),
      defaultValue: 'normal',
    },
    // Job satisfaction
    jobSatisfaction: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    // Team collaboration satisfaction
    teamCollaboration: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    // Communication effectiveness
    communicationSatisfaction: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    // Meeting satisfaction
    meetingSatisfaction: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    // Energy and motivation
    energyLevel: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    motivation: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    // Additional comments
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Automated indicators
    overtimeHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    weekendWork: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lateNightWork: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'wellbeing_scores',
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
        fields: ['burnoutRisk']
      },
      {
        fields: ['overallScore']
      }
    ]
  });

  return WellbeingScore;
};