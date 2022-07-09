const { UserInputError } = require("apollo-server-core");
const { User } = require("../models");
const commonValidation = require("./commonValidation");
const bcrypt = require("bcryptjs");

module.exports = {
  async username(username) {
    const user = await User.findOne({
      where: { username },
      attributes: ["id"],
    });
    commonValidation.invalidInput(username, "Username must be provided");
    if (user) throw new UserInputError("Username is already exists");
    if (username.includes(" ")) {
      throw new UserInputError("Username cannot contain space");
    }
  },
  password(password, confirmPassword) {
    commonValidation.invalidInput(password, "Password must be provided");
    if (password !== confirmPassword) {
      throw new UserInputError("Passwords do not match");
    }
    if (password.length < 6) {
      throw new UserInputError("Password must be at least 6 characters");
    }
  },
  async validPassword(password, correctPassword) {
    const valid = await bcrypt.compare(password, correctPassword);
    if (!valid) {
      throw new UserInputError("Invalid password");
    }
  },
};
