module.exports = (sequelize, DataTypes) => {
  const SurveyResponse = sequelize.define('SurveyResponse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'surveys',
        key: 'id',
      },
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null for anonymous responses
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    responses: {
      type: DataTypes.JSON,
      allowNull: false,
      // Example structure:
      // {
      //   "1": { "value": 8, "question": "How would you rate your overall wellbeing?" },
      //   "2": { "value": 3, "question": "How stressed have you felt?" },
      //   "3": { "value": 7, "question": "Work-life balance satisfaction?" },
      //   "4": { "value": "Normal", "question": "Current workload?" },
      //   "5": { "value": "Great team collaboration this week!", "question": "Additional comments?" }
      // }
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completionTime: {
      type: DataTypes.INTEGER, // Time in seconds to complete
      allowNull: true,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Anonymization hash for anonymous surveys
    anonymousHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Metadata
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deviceType: {
      type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
      allowNull: true,
    },
    // Derived scores for quick analysis
    wellbeingScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    stressScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    satisfactionScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    // Flags for analysis
    highStressFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    burnoutRiskFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lowSatisfactionFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'survey_responses',
    indexes: [
      {
        fields: ['surveyId']
      },
      {
        fields: ['employeeId']
      },
      {
        fields: ['submittedAt']
      },
      {
        fields: ['anonymousHash']
      },
      {
        unique: true,
        fields: ['surveyId', 'employeeId'],
        name: 'unique_survey_employee_response'
      }
    ]
  });

  return SurveyResponse;
};