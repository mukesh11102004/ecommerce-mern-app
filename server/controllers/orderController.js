const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

async function checkout(req, res) {
  try {
    const { addressId, paymentApproved } = req.body;

    if (!addressId) {
      return res.status(400).json({
        message: "Please choose a shipping address",
      });
    }

    if (paymentApproved !== true) {
      return res.status(400).json({
        message: "Payment was declined",
      });
    }

    const user = await User.findById(req.user.userId);

    const selectedAddress = user.addresses.id(addressId);

    if (!selectedAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      },
      totalAmount,
      paymentStatus: "Paid",
      orderStatus: "Processing",
    });

    // Empty the cart after successful payment
    cart.items = [];
    await cart.save();

    await sendEmail({
      to: user.email,
      subject: "Order Confirmation - Mukesh Store",
      html: `
    <h2>Thank you for your order!</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
    <p><strong>Order Status:</strong> ${order.orderStatus}</p>
  `,
    });

    res.status(201).json({
      message: "Payment successful. Order created.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function markOrderAsShipped(req, res) {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = "Shipped";
    await order.save();

    const user = await User.findById(order.user);

    await sendEmail({
      to: user.email,
      subject: "Your order has been shipped - Mukesh Store",
      html: `
        <h2>Your order is on its way!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Status:</strong> Shipped</p>
        <p>Thank you for shopping with Mukesh Store.</p>
      `,
    });

    res.status(200).json({
      message: "Order marked as shipped and email sent",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  checkout,
  getMyOrders,
  markOrderAsShipped,
};
