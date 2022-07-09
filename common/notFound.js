const { UserInputError } = require("apollo-server-core");

function notFound(instance, custonMsg = null) {
  if (!instance) throw new UserInputError(custonMsg ?? "not found");
}

module.exports = notFound;
