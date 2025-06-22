module.exports = (sequelize, DataTypes) => {
  const JobImage = sequelize.define('JobImage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageType: {
      type: DataTypes.ENUM('before', 'after', 'during', 'reference', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'job_images',
    timestamps: true,
    indexes: [
      {
        fields: ['jobId']
      },
      {
        fields: ['imageType']
      },
      {
        fields: ['isPrimary']
      },
      {
        fields: ['isPublic']
      },
      {
        fields: ['uploadedBy']
      }
    ]
  });

  // Instance methods
  JobImage.prototype.getDisplayUrl = function() {
    return this.thumbnailUrl || this.fileUrl;
  };

  JobImage.prototype.isImage = function() {
    return this.mimeType.startsWith('image/');
  };

  JobImage.prototype.isVideo = function() {
    return this.mimeType.startsWith('video/');
  };

  JobImage.prototype.getFileSizeInMB = function() {
    return (this.fileSize / (1024 * 1024)).toFixed(2);
  };

  // Class methods
  JobImage.findByJob = function(jobId) {
    return this.findAll({
      where: { jobId },
      order: [['isPrimary', 'DESC'], ['createdAt', 'ASC']]
    });
  };

  JobImage.findPrimaryImages = function() {
    return this.findAll({
      where: { isPrimary: true }
    });
  };

  JobImage.findPublicImages = function() {
    return this.findAll({
      where: { isPublic: true }
    });
  };

  return JobImage;
}; 