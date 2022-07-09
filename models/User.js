"use strict";
const { Model } = require("sequelize");
const countryListUtil = require("../utils/countryListUtil");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Post, {
        as: "posts",
        foreignKey: "authorId",
        onDelete: "CASCADE",
        hooks: true,
      });
      this.hasMany(models.LikePost, {
        foreignKey: "userLiked",
        onDelete: "CASCADE",
        hooks: true,
      });
      this.hasMany(models.Comment, {
        foreignKey: "authorId",
        onDelete: "CASCADE",
        hooks: true,
      });
      this.belongsToMany(models.User, {
        as: "following",
        through: "Follower",
        foreignKey: "followerId",
      });
      this.belongsToMany(models.User, {
        as: "followers",
        through: "Follower",
        foreignKey: "followingId",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      gender: {
        // type: DataTypes.ENUM("PREFER NOT TO SAY", "MALE", "FEMALE"),
        type: DataTypes.STRING,
        defaultValue: "PREFER NOT TO SAY",
      },
      country: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      isFollowed: DataTypes.VIRTUAL,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
