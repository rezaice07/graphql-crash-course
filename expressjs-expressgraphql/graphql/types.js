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
  GraphQLInputObjectType,
} = require("graphql");
const { collection } = require("../dbconfig/mongodbConnector");
const { ObjectId } = require("mongodb");

//Gender Enum Type

const GenderEnumType = new GraphQLEnumType({
  name: "Gender",
  description: "Enum type for Gender`",
  values: {
    male: {
      value: "male",
    },
    female: {
      value: "female",
    },
  },
});

//Product Type
const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "It present a single product",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLString,
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

//ProductTypeInput
const ProductTypeInput = new GraphQLInputObjectType({
  name: "ProductTypeInput",
  description: "Taking input to add a new product",
  fields: () => ({  
    _id: {
      type: GraphQLID,
    },
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

//DeleteTypeInput
const DeleteTypeInput = new GraphQLInputObjectType({
  name: "DeleteTypeInput",
  description: "Taking input to delete product",
  fields: () => ({  
    _id: {
      type: GraphQLID,
    }
  }),
});

//Delete Type
const DeleteReponseType = new GraphQLObjectType({
  name: "DeleteReponseType",
  description: "It Represent to  Delete Reponse",
  fields: () => ({
    isSuccess: {
      type: GraphQLBoolean,
    },
    message: {
      type: GraphQLString,
    }
  }),
});

//Root Query Type
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    products: {
      type: new GraphQLList(ProductType),
      args: {
        name: {
          type: GraphQLString,
        },
        category: {
          type: GraphQLString,
        },
      },
      resolve: async (_, { name, category }) => {
        let products = await collection
          .find({
            $or: [{ name: name }, { category: category }],
          })
          .toArray();
        return products;
      },
    },
    product: {
      type: ProductType,
      args: {
        _id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, { _id }) => {
        console.log(_id);
        const objectId = new ObjectId(_id);
        let product = await collection.findOne({ _id: objectId });
        return product;
      },
    },
  }),
});

//Root Mutation Type
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    //add product
    addProduct: {
      type: ProductType,
      args: {
        input: {
          type: ProductTypeInput,
        },
      },
      resolve: async (
        _,
        { input: { name, category, price, stock, description, rating } }
      ) => {
        let postedData = { name, category, price, stock, description, rating };
        let result = await collection.insertOne(postedData);
        postedData["_id"] = result.insertedId.toString();
        return postedData;
      },
    },

    //update product
    updateProduct: {
      type: ProductType,
      args: {
        input: {
          type: ProductTypeInput,
        },
      },
      resolve: async (
        _,
        { input: { _id, name, category, price, stock, description, rating } }
      ) => {
        let postedData = {_id, name, category, price, stock, description, rating };
        let result = await collection.updateOne(
          {
            _id: new ObjectId(_id),
          },

          {
            $set: {
              name: postedData.name,
              category: postedData.category,
              price: postedData.price,
              stock: postedData.stock,
              stock: postedData.stock,
              description: postedData.description,
              rating: postedData.rating,
            },
          }
        );

        return postedData;
      },
    },

    //delete product
    deleteProduct: {
      type: DeleteReponseType,
      args: {
        input: {
          type: DeleteTypeInput,
        },
      },
      resolve: async (_, { input: { _id } }) => {
        await collection.deleteOne({ _id: new ObjectId(_id) });
        let resonse = {
          isSuccess: true,
          message: `Product Deleted for Id: ${_id}`,
        };
        return resonse;
      },
    },
  }),
});

module.exports = {
  RootQueryType,
  ProductType,
  RootMutationType,
};
