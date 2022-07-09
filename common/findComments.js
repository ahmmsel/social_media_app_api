const { merge } = require("lodash");
const { ORDER_DESC } = require("../constant/variables");
const { Comment, Post } = require("../models");
const paginatedResultsUtil = require("../utils/paginatedResultsUtil");

async function findComments(config) {
  const { results, startIndex } = await paginatedResultsUtil(
    merge({ model: Comment }, config)
  );

  const comments = await Comment.findAll(
    merge(
      {
        include: [
          "author",
          { model: Post, as: "commentedOn", attributes: ["authorId"] },
        ],
        order: [ORDER_DESC],
        offset: startIndex,
      },
      config
    )
  );

  return results(comments);
}

module.exports = findComments;
