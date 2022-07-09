"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LikePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Post, {
        foreignKey: "likedPost",
        as: "likedOn",
      });
      this.belongsTo(models.User, {
        foreignKey: "userLiked",
        as: "likedBy",
      });
    }
  }
  LikePost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        alloNull: false,
        primaryKey: true,
      },
      likedPost: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
      },
      userLiked: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "LikePost",
      tableName: "post_likes",
      timestamps: true,
    }
  );
  return LikePost;
};
