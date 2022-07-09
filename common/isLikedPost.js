const { LikePost } = require("../models");
const isLikedUtil = require("../utils/isLikedUtil");

async function isLikedPost({ postId, currentUserId }) {
  return await isLikedUtil(LikePost, {
    likedPost: postId,
    userLiked: currentUserId,
  });
}

module.exports = isLikedPost;
