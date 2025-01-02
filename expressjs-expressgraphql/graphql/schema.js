const { 
    GraphQLSchema
 } = require("graphql");
const { RootQueryType } = require("./types");

const schema = new GraphQLSchema({
  query:RootQueryType
  //mutation,
//   subscription
});

module.exports={schema};
