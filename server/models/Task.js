module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('todo', 'in-progress', 'review', 'done', 'cancelled'),
      defaultValue: 'todo',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium',
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
    actualHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'bug', 'feature', 'improvement', 'documentation'
    },
    labels: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    // Integration with external project management tools
    integrationId: {
      type: DataTypes.STRING,
      allowNull: true, // External task ID (Jira, Asana, etc.)
    },
    integrationSource: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'jira', 'asana', 'monday'
    },
    integrationData: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    // Complexity and effort estimation
    storyPoints: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    complexity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true,
    },
    // Quality metrics
    qualityScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 10,
      },
    },
    hasBlockers: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blockerDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'tasks',
    indexes: [
      {
        fields: ['assigneeId']
      },
      {
        fields: ['createdById']
      },
      {
        fields: ['status']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['dueDate']
      },
      {
        fields: ['integrationId']
      },
      {
        fields: ['projectName']
      }
    ]
  });

  return Task;
};