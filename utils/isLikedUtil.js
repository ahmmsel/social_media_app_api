async function isLikedUtil(model, where) {
  const isLiked = await model.findOne({
    where,
  });

  return isLiked ? true : false;
}

module.exports = isLikedUtil;
