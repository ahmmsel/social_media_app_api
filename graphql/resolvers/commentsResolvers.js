const findComments = require("../../common/findComments");
const isAuthenticated = require("../../common/isAuthenticated");
const isAuthor = require("../../common/isAuthor");
const notFound = require("../../common/notFound");
const { Comment, Post } = require("../../models");
const typeResolversUtil = require("../../utils/typeResolversUtil");
const commentsValidation = require("../../validation/commentsValidation");
const commonValidation = require("../../validation/commonValidation");

module.exports = {
  Comment: typeResolversUtil(),
  Query: {
    async getComments(_, { commentedOnId, limit, page }, { currentUser }) {
      isAuthenticated(currentUser);
      const comments = await findComments({
        where: { commentedOnId },
        limit,
        page,
      });

      return comments;
    },
  },
  Mutation: {
    async addComment(_, { input }, { currentUser }) {
      isAuthenticated(currentUser);
      commonValidation.invalidInput(input.text);
      await commonValidation.modelNotFound({
        model: Post,
        id: input.commentedOnId,
      });
      const comment = await Comment.create({
        authorId: currentUser.id,
        commentedOnId: input.commentedOnId,
        text: input.text,
      });
      return comment;
    },
    async updateComment(_, args, { currentUser }) {
      isAuthenticated(currentUser);
      const comment = await Comment.findByPk(args.id);
      notFound(comment);
      isAuthor(currentUser.id, comment.authorId);
      commonValidation.invalidInput(args.text);
      await comment.update({ text: args.text });
      return comment;
    },
    async removeComment(_, args, { currentUser }) {
      isAuthenticated(currentUser);
      const comment = await Comment.findOne({
        where: { id: args.id },
        include: "commentedOn",
      });

      commentsValidation.removePermission(
        currentUser.id,
        comment.authorId,
        comment.commentedOn.authorId
      );
      await comment.destroy();
      return true;
    },
  },
};
