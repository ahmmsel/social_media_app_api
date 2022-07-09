const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authContextUtil(ctx) {
  const authHeaders = ctx.req.headers.authorization;

  if (authHeaders) {
    const token = authHeaders.split(" ")[1];

    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) throw new Error("Invalid token");

    return {
      currentUser: await User.findByPk(decoded.id),
    };
  }
}

module.exports = authContextUtil;
