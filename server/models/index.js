const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'remoteteam_analytics',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false,
    },
  }
);

// Import models
const Company = require('./Company')(sequelize, Sequelize.DataTypes);
const Team = require('./Team')(sequelize, Sequelize.DataTypes);
const Employee = require('./Employee')(sequelize, Sequelize.DataTypes);
const ProductivityMetric = require('./ProductivityMetric')(sequelize, Sequelize.DataTypes);
const WellbeingScore = require('./WellbeingScore')(sequelize, Sequelize.DataTypes);
const TimeEntry = require('./TimeEntry')(sequelize, Sequelize.DataTypes);
const Meeting = require('./Meeting')(sequelize, Sequelize.DataTypes);
const Task = require('./Task')(sequelize, Sequelize.DataTypes);
const Survey = require('./Survey')(sequelize, Sequelize.DataTypes);
const SurveyResponse = require('./SurveyResponse')(sequelize, Sequelize.DataTypes);
const Goal = require('./Goal')(sequelize, Sequelize.DataTypes);
const Integration = require('./Integration')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

// Define associations
const defineAssociations = () => {
  // Company associations
  Company.hasMany(Team, { foreignKey: 'companyId', as: 'teams' });
  Company.hasMany(Employee, { foreignKey: 'companyId', as: 'employees' });
  Company.hasMany(Integration, { foreignKey: 'companyId', as: 'integrations' });

  // Team associations
  Team.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
  Team.hasMany(Employee, { foreignKey: 'teamId', as: 'employees' });
  Team.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });

  // Employee associations
  Employee.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
  Employee.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });
  Employee.hasMany(ProductivityMetric, { foreignKey: 'employeeId', as: 'productivityMetrics' });
  Employee.hasMany(WellbeingScore, { foreignKey: 'employeeId', as: 'wellbeingScores' });
  Employee.hasMany(TimeEntry, { foreignKey: 'employeeId', as: 'timeEntries' });
  Employee.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
  Employee.hasMany(SurveyResponse, { foreignKey: 'employeeId', as: 'surveyResponses' });
  Employee.hasMany(Goal, { foreignKey: 'employeeId', as: 'goals' });
  Employee.hasMany(Notification, { foreignKey: 'employeeId', as: 'notifications' });

  // ProductivityMetric associations
  ProductivityMetric.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // WellbeingScore associations
  WellbeingScore.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // TimeEntry associations
  TimeEntry.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
  TimeEntry.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

  // Meeting associations
  Meeting.belongsTo(Employee, { foreignKey: 'organizerId', as: 'organizer' });
  Meeting.belongsToMany(Employee, { 
    through: 'MeetingAttendees', 
    foreignKey: 'meetingId',
    otherKey: 'employeeId',
    as: 'attendees' 
  });

  // Task associations
  Task.belongsTo(Employee, { foreignKey: 'assigneeId', as: 'assignee' });
  Task.belongsTo(Employee, { foreignKey: 'createdById', as: 'createdBy' });
  Task.hasMany(TimeEntry, { foreignKey: 'taskId', as: 'timeEntries' });

  // Survey associations
  Survey.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
  Survey.hasMany(SurveyResponse, { foreignKey: 'surveyId', as: 'responses' });

  // SurveyResponse associations
  SurveyResponse.belongsTo(Survey, { foreignKey: 'surveyId', as: 'survey' });
  SurveyResponse.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

  // Goal associations
  Goal.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
  Goal.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

  // Integration associations
  Integration.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

  // Notification associations
  Notification.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
};

defineAssociations();

module.exports = {
  sequelize,
  Company,
  Team,
  Employee,
  ProductivityMetric,
  WellbeingScore,
  TimeEntry,
  Meeting,
  Task,
  Survey,
  SurveyResponse,
  Goal,
  Integration,
  Notification,
};