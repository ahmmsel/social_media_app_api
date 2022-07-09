const { AuthenticationError } = require("apollo-server-core");

function isAuthor(currentUser, author, custonMsg = null) {
  if (currentUser !== author) {
    throw new AuthenticationError(
      custonMsg ?? "You not have permission to do this"
    );
  }
}

module.exports = isAuthor;
