const { UserInputError } = require("apollo-server-core");

module.exports = {
  invalidInput(input, message) {
    if (!input.trim()) throw new UserInputError(message ?? "Invalid input");
  },
  async modelNotFound({ model, id, customMsg = null }) {
    const instance = await model.findByPk(id);
    if (!instance) {
      if (customMsg) throw new UserInputError(customMsg);
      else throw new UserInputError(`${model} not found`);
    }
  },
};
