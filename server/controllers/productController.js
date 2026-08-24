const Product = require("../models/Product");

async function createProduct(req, res) {
  try {
    const { name, description, price, image, stock } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        message: "Name, description and price are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};
