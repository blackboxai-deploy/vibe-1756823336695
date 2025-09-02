module.exports = (sequelize, DataTypes) => {
  const Integration = sequelize.define('Integration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'calendar', 'communication', 'project_management', 'code_repository', 
        'time_tracking', 'hr_system', 'video_conferencing', 'email'
      ),
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM(
        'google_calendar', 'outlook', 'slack', 'teams', 'discord',
        'jira', 'asana', 'monday', 'trello', 'github', 'gitlab', 'bitbucket',
        'toggl', 'rescuetime', 'bamboohr', 'workday', 'zoom', 'meet', 'gmail'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'error', 'pending'),
      defaultValue: 'pending',
    },
    // Authentication and configuration
    authType: {
      type: DataTypes.ENUM('oauth2', 'api_key', 'webhook', 'basic_auth'),
      allowNull: false,
    },
    credentials: {
      type: DataTypes.TEXT, // Encrypted credentials
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Configuration settings
    settings: {
      type: DataTypes.JSON,
      defaultValue: {},
      // Example structure for different integrations:
      // Slack: { channels: ['general', 'dev'], trackMessages: true, trackReactions: false }
      // Jira: { projects: ['PROJ1', 'PROJ2'], trackTimeLogged: true, trackComments: true }
      // Google Calendar: { calendars: ['primary', 'meetings'], trackAllMeetings: true }
    },
    // Sync configuration
    syncEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    syncFrequency: {
      type: DataTypes.ENUM('realtime', 'hourly', 'daily', 'weekly'),
      defaultValue: 'hourly',
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Webhook configuration
    webhookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webhookSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Data mapping configuration
    dataMapping: {
      type: DataTypes.JSON,
      defaultValue: {},
      // Maps external data fields to internal fields
      // e.g., { "jira_story_points": "storyPoints", "jira_priority": "priority" }
    },
    // Error handling and logging
    lastError: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    errorCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastSuccessAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Usage statistics
    totalSyncs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dataPointsSync: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // GDPR compliance
    dataRetentionDays: {
      type: DataTypes.INTEGER,
      defaultValue: 365,
    },
    anonymizeData: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'integrations',
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['provider']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        unique: true,
        fields: ['companyId', 'provider'],
        name: 'unique_company_provider'
      }
    ]
  });

  return Integration;
};