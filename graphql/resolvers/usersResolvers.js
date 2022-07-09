const { UserInputError } = require("apollo-server-core");
const { Op } = require("sequelize");
const findPosts = require("../../common/findPosts");
const isAuthenticated = require("../../common/isAuthenticated");
const { User, Follower } = require("../../models");
const cursorPaginatedUtil = require("../../utils/cursorPaginatedUtil");
const isFollowedUtil = require("../../utils/isFollowedUtil");
const paginatedResultsUtil = require("../../utils/paginatedResultsUtil");
const typeResolversUtil = require("../../utils/typeResolversUtil");
const commonValidation = require("../../validation/commonValidation");
const usersValidation = require("../../validation/usersValidation");

module.exports = {
  User: typeResolversUtil({
    posts: (user) => user.posts.length,
    following: (user) => user.following.length,
    followers: (user) => user.followers.length,
  }),
  Query: {
    async getUser(_, { id }, { currentUser }) {
      isAuthenticated(currentUser);
      const user = await User.findOne({
        where: { id },
        include: ["followers", "following", "posts"],
      });
      if (!user) throw new UserInputError("User not found");

      user.isFollowed = isFollowedUtil(currentUser.id, user.id);

      return user;
    },

    getUserPosts(_, { id, limit, page }, { currentUser }) {
      isAuthenticated(currentUser);

      const posts = findPosts(currentUser.id, {
        where: { authorId: id },
        limit,
        page,
      });

      return posts;
    },

    async getUserFollowers(_, args, { currentUser }) {
      isAuthenticated(currentUser);

      const commonQuery = { followingId: args.id };

      const { results, startIndex } = await paginatedResultsUtil({
        model: Follower,
        where: commonQuery,
        limit: args.limit,
        page: args.page,
      });

      const followersInfo = await Follower.findAll({
        where: commonQuery,
        include: ["follower"],
        offset: startIndex,
        limit: args.limit,
      });
      const followers = followersInfo.map((f) => f.follower);

      followers.map(
        (user) => (user.isFollowed = isFollowedUtil(currentUser.id, user.id))
      );

      return results(followers);
    },

    async getUserFollowing(_, args, { currentUser }) {
      isAuthenticated(currentUser);

      const commonQuery = { followerId: args.id };

      const { results, startIndex } = await paginatedResultsUtil({
        model: Follower,
        where: commonQuery,
        limit: args.limit,
        page: args.page,
      });
      const followingInfo = await Follower.findAll({
        where: commonQuery,
        include: ["following"],
        offset: startIndex,
        limit: args.limit,
      });
      const following = followingInfo.map((f) => f.following);

      following.map(
        (user) => (user.isFollowed = isFollowedUtil(currentUser.id, user.id))
      );

      return results(following);
    },

    async getUserResults(_, { query, limit, cursor }, { currentUser }) {
      isAuthenticated(currentUser);
      query = query.trim();
      if (!query) return;
      const commonQuery = { username: { [Op.like]: `${query}%` } };
      const results = await cursorPaginatedUtil({
        model: User,
        where: commonQuery,
        limit,
        cursor,
      });

      const user = await User.findAll({
        where: commonQuery,
        limit,
        offset: cursor,
      });

      return results(user);
    },
  },
  Mutation: {
    async updateUser(_, { input }, { currentUser }) {
      isAuthenticated(currentUser);
      let updateData = {};
      const user = await User.findByPk(currentUser.id);
      input.username && (await usersValidation.username(input.username));
      for (const key in input) {
        if (input[key] !== null) updateData[key] = input[key];
      }
      const updatedUser = await user.update(updateData);

      return updatedUser;
    },

    async followUser(_, args, { currentUser }) {
      isAuthenticated(currentUser);
      await commonValidation.modelNotFound({ model: User, id: args.id });
      const existingFollower = await Follower.findOne({
        where: { followerId: currentUser.id, followingId: args.id },
      });

      if (existingFollower) throw new UserInputError("Already following");
      const followedUser = await Follower.create({
        followerId: currentUser.id,
        followingId: args.id,
      });

      return followedUser;
    },

    async unfollowUser(_, args, { currentUser }) {
      isAuthenticated(currentUser);
      await commonValidation.modelNotFound({ model: User, id: args.id });
      const followedUser = await Follower.findOne({
        where: { followerId: currentUser.id, followingId: args.id },
      });
      if (!followedUser)
        throw new UserInputError("you are not following this user");
      await followedUser.destroy();
      return true;
    },

    async deleteUser(_, __, { currentUser }) {
      isAuthenticated(currentUser);
      const user = await User.findByPk(currentUser.id);
      await user.destroy();
      return true;
    },
  },
};
