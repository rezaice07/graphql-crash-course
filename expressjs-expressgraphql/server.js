const express = require('express');
const {graphqlHTTP} =require('express-graphql');
const db=require("./dbconfig/mongodbConnector");
const { schema } = require('./graphql/schema');
const app = new express();


// app.get('/graphql',(req,res)=>{
//     res.send('Welcome to graphql');
// });

app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));

app.listen({port:3000},()=>{
    console.log('Server starting on localhost:3000');
})

