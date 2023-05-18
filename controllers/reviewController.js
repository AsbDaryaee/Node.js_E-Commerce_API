const Review = require("../models/review");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;
  req.body.user = userId;

  if (!productId) {
    throw new CustomError.BadRequestError("Please Provide a product ID.");
  }

  const isValidProduct = await Product.findById(productId);

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No Product With ID:${productId} Exists.`
    );
  }

  //   Check if the user leave a review before
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You Already Submitted a review for this product."
    );
  }
  //

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json(review);
};

const getAllReviews = async (req, res) => {
  const allReviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });

  res.status(StatusCodes.OK).json({ Total: allReviews.length, allReviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId)
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No Review wit ID: ${reviewId} exists.`
    );
  }

  res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id: reviewId } = req.params;
  const { userId } = req.user;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(
      `No Review wit ID: ${reviewId} exists.`
    );
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  review.save();

  res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { userId } = req.user;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(
      `No Review wit ID: ${reviewId} exists.`
    );
  }

  checkPermissions(req.user, review.user);

  await review.deleteOne();

  res.status(StatusCodes.OK).json({ msg: `The Review Deleted Succssesfully` });
};

// IT'S GOING TO BE LIKE THIS IN PRDUCT ROUTES - VID 54:
// router.get("/:id/reviews", getSingleProductReviews);
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json(reviews);
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
