const express = require("express");
const productRouter = express.Router();
const { collection } = require("../dbconfig/mongodbConnector");

productRouter.get("/products", async (req, res) => {
  const findResult = await collection.find({}).toArray();
  //console.log('Found documents =>', findResult);
  res.send(findResult);
  //res.status(200).json({  });
});

productRouter.post("/products", async (req, res) => {
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);
  const insertResult = await collection.insertMany([
    {
      name: "A4Tech Wireless Mouseq",
      category: "Electronicsq",
      price: 245.99,
      stock: 1240,
      description: "Er4gonomic wireless mouse with adjustable DPI.",
      rating: 4.54,
    },
  ]);
  res.send("product added");
  //res.status(200).json({  });
});

module.exports = productRouter;
