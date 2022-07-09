const { UserInputError } = require("apollo-server-core");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const generateTokenUtil = require("../../utils/generateTokenUtil");
const usersValidation = require("../../validation/usersValidation");
const { merge } = require("lodash");

module.exports = {
  Query: {
    async login(_, { input }) {
      const { username, password } = input;
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new UserInputError("User not found");
      }
      await usersValidation.validPassword(password, user.password);

      return { id: user.id, token: generateTokenUtil(user.id) };
    },
  },
  Mutation: {
    async register(_, { input }) {
      await usersValidation.username(input.username);
      usersValidation.password(input.password, input.confirmPassword);

      const user = await User.create(
        merge(input, {
          password: await bcrypt.hash(input.password, 10),
        })
      );

      return { id: user.id, token: generateTokenUtil(user.id) };
    },
  },
};
