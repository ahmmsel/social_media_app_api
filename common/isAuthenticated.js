const { AuthenticationError } = require("apollo-server-core");

function isAuthenticated(user) {
  if (!user) throw new AuthenticationError("You must be logged in!");
}

module.exports = isAuthenticated;
