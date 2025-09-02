module.exports = (sequelize, DataTypes) => {
  const Meeting = sequelize.define('Meeting', {
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
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: true,
    },
    meetingType: {
      type: DataTypes.ENUM('standup', 'planning', 'review', 'retrospective', '1on1', 'all-hands', 'training', 'other'),
      defaultValue: 'other',
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'Zoom', 'Google Meet', 'Teams'
    },
    meetingUrl: {
      type: DataTypes.STRING,
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
    status: {
      type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    attendeesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    actualAttendees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Meeting effectiveness metrics
    productivityRating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 10,
      },
    },
    engagementLevel: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true,
    },
    actionItems: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    integrationId: {
      type: DataTypes.STRING,
      allowNull: true, // External calendar integration ID
    },
    integrationSource: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'google_calendar', 'outlook'
    },
  }, {
    tableName: 'meetings',
    indexes: [
      {
        fields: ['organizerId']
      },
      {
        fields: ['startTime']
      },
      {
        fields: ['meetingType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['integrationId']
      }
    ]
  });

  return Meeting;
};