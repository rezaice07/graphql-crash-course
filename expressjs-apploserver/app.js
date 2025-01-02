const express = require("express");
const db=require("./dbconfig/mongodbConnector");
const productRouter =require('./router/productRouter');
const { ApolloServer, gql } =require('apollo-server-express');

const app = express();
const port = 3000;
app.use("/api", productRouter);

const typeDefs = gql`
type Query {
hello: String
}`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({app,path:'/graphql'});

app.listen({port:port}, () => {
  console.log(`listening at http://localhost:${port}`);
});
