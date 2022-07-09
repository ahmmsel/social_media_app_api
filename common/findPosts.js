const { merge } = require("lodash");
const { ORDER_DESC } = require("../constant/variables");
const { Post } = require("../models");
const paginatedResultsUtil = require("../utils/paginatedResultsUtil");
const isLikedPost = require("./isLikedPost");

async function findPosts(currentUserId, config = {}) {
  const { results, startIndex } = await paginatedResultsUtil({
    model: Post,
    ...config,
  });

  const posts = await Post.findAll({
    include: ["author", "likes", "comments"],
    order: [ORDER_DESC],
    offset: startIndex,
    ...config,
  });

  posts.map(
    (post) =>
      (post.isLiked = isLikedPost({
        postId: post.id,
        currentUserId,
      }))
  );

  return results(posts);
}

module.exports = findPosts;
