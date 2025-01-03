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
    GraphQLInputObjectType
 } = require("graphql");
const { collection } = require("../dbconfig/mongodbConnector");
const { ObjectId } = require("mongodb");

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

 //Product Type
 const ProductType = new GraphQLObjectType({
    name:"Product",
    description:"It present a single product",
    fields:()=>({
        _id:{
            type:GraphQLID          
        },
        name:{
            type:GraphQLString   
        },
        category:{
            type:GraphQLString          
        },
        price:{
            type:GraphQLFloat            
        },
        stock:{
            type:GraphQLFloat            
        },
        description:{
            type:GraphQLString    
        },
        rating:{
            type:GraphQLFloat             
        }
    })
 });
 
//UserTypeInput
const UserTypeInput = new GraphQLInputObjectType({
    name: "UserTypeInput",
    description: "Taking input to add a new product",
    fields: () => ({
      name: {
          type: new GraphQLNonNull(GraphQLString), //Required
        },
        category: {
          type: new GraphQLNonNull(GraphQLString), //Required
        },
        price: {
          type: GraphQLFloat,
        },
        stock: {
          type: GraphQLFloat,
        },
        description: {
          type: GraphQLString,
        },
        rating: {
          type: GraphQLFloat,
        },
    }),
  });

 //Root Query Type
 const RootQueryType=new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:()=>({        
        products:{
            type:new GraphQLList(ProductType),
            args:{
                name:{
                    type:GraphQLString
                },
                category:{
                    type:GraphQLString
                }
            },
            resolve:async (_,{name,category})=>{
                let products = await collection.find(
                    {
                        $or: [
                          { name: name },
                          { category: category }
                        ]
                      }
                ).toArray();
                return products;
            }
        },
        product:{
            type:ProductType,
            args:{
                _id:{
                    type:GraphQLID
                }
            },
            resolve:async(_,{_id})=>{
                console.log(_id);
                const objectId=new ObjectId(_id);
                let product = await collection.findOne({_id:objectId});
                return product;
            }
        }
    }),
 });
 
//Root Mutation Type
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({     
      addProduct: {
        type: ProductType,
        args: {
          input: {
            type: UserTypeInput,
          },
        },
        resolve: async (_, {input:{name,category,price,stock,description,rating}}) => {    
          let postedData = { name,category,price,stock,description,rating };
          let result = await collection.insertOne(postedData);         
          postedData["_id"]=result.insertedId.toString();
          return postedData;
        },
      },
    }),
  });

 module.exports={
    RootQueryType,
    ProductType,
    RootMutationType
 };