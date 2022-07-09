"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "authorId",
        as: "author",
      });
      this.hasMany(models.LikePost, {
        foreignKey: "likedPost",
        as: "likes",
        onDelete: "CASCADE",
        hooks: true,
      });
      this.hasMany(models.Comment, {
        foreignKey: "commentedOnId",
        as: "comments",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
      isLiked: DataTypes.VIRTUAL,
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );
  return Post;
};
