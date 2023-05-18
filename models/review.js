const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Provide Review Title"],
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please Provide Rating in range of 1 to 5."],
    },
    comment: {
      type: String,
      required: [true, "Please Provide Comment."],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// User can leave only one review per product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAveRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(productId, {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: Math.ceil(result[0]?.numOfReviews || 0),
    });
  } catch (error) {
    console.log(error);
  }
};

// this.model.FUNCTION works for updateOne
reviewSchema.post("save", async function () {
  await this.constructor.calcAveRating(this.product);
});

reviewSchema.post("deleteOne", { document: true }, async function () {
  console.log(this.product);
  await this.constructor.calcAveRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
