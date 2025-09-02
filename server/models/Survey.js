module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define('Survey', {
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
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    surveyType: {
      type: DataTypes.ENUM('wellbeing', 'engagement', 'satisfaction', 'custom'),
      defaultValue: 'wellbeing',
    },
    frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'one-time'),
      defaultValue: 'weekly',
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        {
          id: 1,
          type: 'scale',
          question: 'How would you rate your overall wellbeing this week?',
          scale: { min: 0, max: 10 },
          required: true
        },
        {
          id: 2,
          type: 'scale',
          question: 'How stressed have you felt this week?',
          scale: { min: 0, max: 10 },
          required: true
        },
        {
          id: 3,
          type: 'scale',
          question: 'How satisfied are you with your work-life balance?',
          scale: { min: 0, max: 10 },
          required: true
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: 'How would you describe your current workload?',
          options: ['Light', 'Normal', 'Heavy', 'Overwhelming'],
          required: true
        },
        {
          id: 5,
          type: 'text',
          question: 'Any additional comments or feedback?',
          required: false
        }
      ],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    targetAudience: {
      type: DataTypes.ENUM('all', 'team', 'department', 'role'),
      defaultValue: 'all',
    },
    targetCriteria: {
      type: DataTypes.JSON,
      defaultValue: null, // Specific team IDs, roles, etc.
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reminderSettings: {
      type: DataTypes.JSON,
      defaultValue: {
        enabled: true,
        reminderDays: [1, 3], // Send reminder after 1 and 3 days
        reminderTime: '09:00'
      },
    },
    responseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    targetResponseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'surveys',
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['surveyType']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['startDate']
      },
      {
        fields: ['frequency']
      }
    ]
  });

  return Survey;
};