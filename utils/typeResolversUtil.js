const { merge } = require("lodash");
const normalizeDate = require("../common/normalizeDate");

function typeResolversUtil(object) {
  return merge(normalizeDate(), object);
}

module.exports = typeResolversUtil;
