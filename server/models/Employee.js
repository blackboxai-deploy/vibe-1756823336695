module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'employee'),
      defaultValue: 'employee',
    },
    position: {
      type: DataTypes.STRING,
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
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        privacySettings: {
          shareProductivityData: true,
          shareWellbeingData: true,
          anonymousReporting: false
        },
        notificationSettings: {
          emailNotifications: true,
          burnoutAlerts: true,
          goalReminders: true,
          weeklyReports: true
        },
        workingHours: {
          start: '09:00',
          end: '17:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timezone: 'UTC'
        }
      },
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'employees',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['companyId']
      },
      {
        fields: ['teamId']
      },
      {
        fields: ['role']
      }
    ]
  });

  return Employee;
};