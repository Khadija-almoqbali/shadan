import Order from "../models/orderModel.js";

export const createAmwalPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
  checkout_url: "http://localhost:3000/success"
    });

  } catch (error) {
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
};