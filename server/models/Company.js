module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
      defaultValue: 'small',
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC',
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        workingHours: {
          start: '09:00',
          end: '17:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        privacySettings: {
          allowAnonymousReporting: true,
          dataRetentionDays: 365,
          requireOptIn: true
        },
        notificationSettings: {
          burnoutAlerts: true,
          weeklyReports: true,
          productivityInsights: true
        }
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'companies',
    indexes: [
      {
        unique: true,
        fields: ['domain']
      },
      {
        fields: ['name']
      }
    ]
  });

  return Company;
};