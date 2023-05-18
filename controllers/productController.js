const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const Product = require("../models/product");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const allProducts = await Product.find({}).populate("review");

  res
    .status(StatusCodes.OK)
    .json({ AllProducts: allProducts.length, allProducts });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId).populate("review");

  if (!product) {
    throw new CustomError.BadRequestError(
      `Product Doesn't Exist with id: ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.BadRequestError(
      `Product Doesn't Exist with id: ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError.BadRequestError(
      `Product Doesn't Exist with id: ${productId}`
    );
  }

  await product.deleteOne();

  res
    .status(StatusCodes.OK)
    .json({ msg: `Product with ID:${productId} Deleted Succssesfully.` });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError(
      "Please Upload an Image to Continue..."
    );
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please send an Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Max size for image is 1MB.");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
