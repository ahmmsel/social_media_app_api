const { UserInputError } = require("apollo-server-core");

module.exports = {
  removePermission(currentUserId, commentAuthorId, postAuthorId) {
    const postAuthor = currentUserId !== postAuthorId;
    const commentAuthor = currentUserId !== commentAuthorId;

    if (postAuthor && commentAuthor) {
      throw new UserInputError(
        `You don't have permission to remove this comment`
      );
    }
  },
};
