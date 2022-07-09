"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "followerId",
        as: "follower",
      });
      this.belongsTo(models.User, {
        foreignKey: "followingId",
        as: "following",
      });
    }
  }
  Follower.init(
    {
      followerId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      followingId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Follower",
      tableName: "followers",
    }
  );
  return Follower;
};
