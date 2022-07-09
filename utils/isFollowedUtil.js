const { Follower } = require("../models");

async function isFollowedUtil(currentUserId, followedUserId) {
  const isFollowedUser = await Follower.findOne({
    where: {
      followerId: currentUserId,
      followingId: followedUserId,
    },
  });

  return isFollowedUser ? true : false;
}

module.exports = isFollowedUtil;
