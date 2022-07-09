const { Follower } = require("../models");

async function getPostsAuthorsIds(currentUserId) {
  let postsAuthorsIds = [currentUserId];
  const currentUserFollowing = await Follower.findAll({
    where: { followerId: currentUserId },
  });
  const followingIds = currentUserFollowing.map(
    (following) => following.followingId
  );
  postsAuthorsIds = postsAuthorsIds.concat(followingIds);

  return postsAuthorsIds;
}

module.exports = getPostsAuthorsIds;
