const { 
    GraphQLEnumType,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLError,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLScalarType,
 } = require("graphql");
const { users } = require("../data/users");

 //Gender Enum Type

 const GenderEnumType = new GraphQLEnumType({
    name:"Gender",
    description:"Enum type for Gender`",
    values:{
        male:{
            value:"male"
        },
        female:{
            value:"female"
        }
    }
 });

 //User Type
 const UserType = new GraphQLObjectType({
    name:"User",
    description:"It present a single user",
    fields:()=>({
        id:{
            type:new GraphQLNonNull(GraphQLID)            
        },
        name:{
            type:new GraphQLNonNull(GraphQLString)            
        },
        username:{
            type:new GraphQLNonNull(GraphQLString)             
        },
        email:{
            type:GraphQLString            
        },
    })
 });

 //Root Query Type
 const RootQueryType=new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:()=>({
        users:{
            type:new GraphQLList(UserType),
            resolve:()=>{
                return users;
            }
        },
        user:{
            type:UserType,
            args:{
                id:{
                    type:GraphQLID
                }
            },
            resolve:(_,{id})=>{
                let user=users.find(f=>f.id==id);
                return user;
            }
        }
    }),
 });


 module.exports={
    RootQueryType,
    UserType
 };