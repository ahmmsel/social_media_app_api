const { UserInputError } = require("apollo-server-core");
const { Op } = require("sequelize");
const isAuthenticated = require("../../common/isAuthenticated");
const notFound = require("../../common/notFound");
const { Post, LikePost } = require("../../models");
const isAuthor = require("../../common/isAuthor");
const isLikedPost = require("../../common/isLikedPost");
const findPosts = require("../../common/findPosts");
const typeResolversUtil = require("../../utils/typeResolversUtil");
const getPostsAuthorsIds = require("../../common/getPostsAuthorsIds");

module.exports = {
  Post: typeResolversUtil({
    totalLikes: (post) => post.likes.length,
    totalComments: (post) => post.comments.length,
  }),
  Query: {
    async getPost(_, { id }, { currentUser }) {
      isAuthenticated(currentUser);
      const post = await Post.findOne({
        where: { id },
        include: ["author", "likes", "comments"],
      });
      notFound(post);
      post.isLiked = isLikedPost({
        postId: post.id,
        currentUserId: currentUser.id,
      });

      return post;
    },

    async feedPosts(_, { limit, page }, { currentUser }) {
      isAuthenticated(currentUser);
      const postsAuthorsIds = await getPostsAuthorsIds(currentUser.id);
      const posts = await findPosts(currentUser.id, {
        where: { authorId: postsAuthorsIds },
        limit,
        page,
      });

      return posts;
    },
    async explorePosts(_, { limit, page }, { currentUser }) {
      isAuthenticated(currentUser);
      const postsAuthorsIds = await getPostsAuthorsIds(currentUser.id);
      const posts = await findPosts(currentUser.id, {
        limit,
        page,
        where: { authorId: { [Op.notIn]: postsAuthorsIds } },
      });

      return posts;
    },
  },
  Mutation: {
    async createPost(_, { input }, { currentUser }) {
      isAuthenticated(currentUser);
      if (!input.content.trim()) throw new UserInputError("Invalid input");
      const createdPost = await Post.create({
        ...input,
        authorId: currentUser.id,
      });

      return createdPost;
    },

    async likePost(_, { id }, { currentUser }) {
      isAuthenticated(currentUser);
      const existingLike = await LikePost.findOne({
        where: { likedPost: id, userLiked: currentUser.id },
      });
      if (existingLike) {
        await existingLike.destroy();
      }
      await LikePost.create({
        likedPost: id,
        userLiked: currentUser.id,
      });

      return true;
    },

    async unlikePost(_, { id }, { currentUser }) {
      isAuthenticated(currentUser);
      const existingLike = await LikePost.findOne({
        where: { likedPost: id, userLiked: currentUser.id },
      });
      if (!existingLike) throw new UserInputError("you are not like this post");
      await existingLike.destroy();
      return true;
    },

    async deletePost(_, { id }, { currentUser }) {
      isAuthenticated(currentUser);
      const post = await Post.findOne({ where: { id } });
      notFound(post);
      isAuthor(currentUser.id, post.authorId);
      await post.destroy();
      return true;
    },
  },
};
