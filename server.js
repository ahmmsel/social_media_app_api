const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const authContextUtil = require("./utils/authContextUtil");
const { sequelize } = require("./models");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
require("dotenv").config();

const typeDefs = loadFilesSync(
  path.join(__dirname, "graphql", "typeDefs/**/*.graphql")
);

const resolvers = loadFilesSync(
  path.join(__dirname, "graphql", "resolvers/**/*.js")
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startApolloServer(schema) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: authContextUtil,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

sequelize
  .authenticate()
  .then(() => startApolloServer(schema))
  .catch((err) => console.error(err));
