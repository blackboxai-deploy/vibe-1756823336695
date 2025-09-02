module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'burnout_alert', 'wellbeing_reminder', 'goal_reminder', 'goal_achievement',
        'productivity_insight', 'meeting_feedback', 'survey_reminder', 'system_update',
        'team_milestone', 'overtime_alert', 'break_reminder', 'weekly_report'
      ),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'dismissed', 'archived'),
      defaultValue: 'unread',
    },
    // Delivery channels
    channels: {
      type: DataTypes.JSON,
      defaultValue: ['in-app'],
      // Available channels: ['in-app', 'email', 'slack', 'teams', 'push']
    },
    // Scheduling
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Action buttons and links
    actions: {
      type: DataTypes.JSON,
      defaultValue: [],
      // Example structure:
      // [
      //   {
      //     "label": "Complete Survey",
      //     "action": "survey",
      //     "url": "/surveys/123",
      //     "primary": true
      //   },
      //   {
      //     "label": "Dismiss",
      //     "action": "dismiss",
      //     "primary": false
      //   }
      // ]
    },
    // Metadata and context
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      // Additional context data like survey ID, goal ID, metric values, etc.
    },
    // Related entity references
    relatedEntityType: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'survey', 'goal', 'wellbeing_score', 'productivity_metric'
    },
    relatedEntityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Auto-expire settings
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recurrencePattern: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    // Delivery status tracking
    deliveryStatus: {
      type: DataTypes.JSON,
      defaultValue: {},
      // Example structure:
      // {
      //   "in-app": { "status": "delivered", "timestamp": "2024-01-01T10:00:00Z" },
      //   "email": { "status": "failed", "error": "Invalid email", "timestamp": "..." },
      //   "slack": { "status": "pending" }
      // }
    },
    // User interaction tracking
    interactions: {
      type: DataTypes.JSON,
      defaultValue: [],
      // Track user interactions with the notification
      // [
      //   { "action": "click", "timestamp": "2024-01-01T10:05:00Z" },
      //   { "action": "dismiss", "timestamp": "2024-01-01T10:10:00Z" }
      // ]
    },
    // Localization
    locale: {
      type: DataTypes.STRING,
      defaultValue: 'en-US',
    },
  }, {
    tableName: 'notifications',
    indexes: [
      {
        fields: ['employeeId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['scheduledFor']
      },
      {
        fields: ['sentAt']
      },
      {
        fields: ['relatedEntityType', 'relatedEntityId']
      }
    ]
  });

  return Notification;
};