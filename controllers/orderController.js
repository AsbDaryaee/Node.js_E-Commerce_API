const Order = require("../models/order");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const FakePaymentAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No Cart Items Provided.");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please Provide tax and shipping fee."
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `${item.name} doens't exist right now. ID: ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // add Item to the Order
    orderItems = [...orderItems, singleOrderItem];

    // calc subtotal
    subtotal += singleOrderItem.amount * singleOrderItem.price;
  }

  const total = subtotal + tax + shippingFee;

  const paymentIntent = await FakePaymentAPI({
    amount: total,
    currency: "USD",
  });

  const order = await Order.create({
    cardItems: orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    paymentIntentId: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
  const allOrders = await Order.find({}).sort("createdAt");

  res.status(StatusCodes.OK).json({ Total: allOrders.length, allOrders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(
      `The order with ID: ${orderId} doesn't Exist.`
    );
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json(order);
};

const getCurrentUserOrder = async (req, res) => {
  const { userId } = req.user;

  const currentUserOrder = await Order.find({ user: userId });

  res.status(StatusCodes.OK).json(currentUserOrder);
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(
      `The order with ID: ${orderId} doesn't Exist.`
    );
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  createOrder,
  getAllOrders,
  getCurrentUserOrder,
  getSingleOrder,
  updateOrder,
};
