import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
} from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

import "../assets/styles/orderScreen.css";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  // 👇 FIX: refetch مضاف
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth); // 👈 FIX

  const [loading, setLoading] = useState(false);

  // 💳 Amwal Pay handler
  const payHandler = async () => {
    try {
      setLoading(true);

      if (!order) return;

      const { data } = await axios.post("/api/payments/amwal", {
        orderId: order._id,
        amount: order.totalPrice,
      });

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🚚 deliver order
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order delivered");

      refetch(); // 👈 refresh data
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // ⚠️ error handling
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to load order details");
    }
  }, [error]);

  // ⏳ loading state
  if (isLoading || !order) {
    return <Loader />;
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>Order Details</h1>
        <span className="order-id">#{order._id}</span>
      </div>

      <Row className="g-4">
        {/* LEFT SIDE */}
        <Col lg={8}>
          <ListGroup variant="flush" className="order-card">

            {/* SHIPPING */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">Shipping</h2>

              <div className="info-group">
                <p>
                  <span>Name</span>
                  {order?.user?.name}
                </p>

                <p>
                  <span>Phone</span>
                  +968 {order?.shippingAddress?.phoneNumber}
                </p>

                <p>
                  <span>Address</span>
                  {order?.shippingAddress?.address},{" "}
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.country}
                </p>
              </div>

              <div className="lux-status-box">

                  {order.isDelivered ? (
                    <div className="lux-status-success">
                      Delivered on {order.deliveredAt?.substring(0, 10)}
                    </div>
                  ) : (
                    <div className="lux-status-danger">
                      Order has not been delivered yet
                    </div>
                  )}

                </div>
            </ListGroup.Item>

            {/* PAYMENT */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">Payment</h2>

              <p>
                <span>Method:</span> {order.paymentMethod}
              </p>

              <div className="lux-status-box">

                {order.isPaid ? (
                  <div className="lux-status-success">
                    Paid on {order.paidAt?.substring(0, 10)}
                  </div>
                ) : (
                  <div className="lux-status-danger">
                    Payment is still pending
                  </div>
                )}

              </div>
            </ListGroup.Item>

            {/* ITEMS */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">Order Items</h2>

              {order.orderItems.map((item, index) => (
                <div className="product-item" key={index}>
                  <div className="product-left">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                      className="product-image"
                    />

                    <div>
                      <Link
                        to={`/product/${item.product}`}
                        className="product-name"
                      >
                        {item.name}
                      </Link>

                      <p className="product-price">
                        {item.qty} × {item.price} OMR
                      </p>
                    </div>
                  </div>

                  <div className="product-total">
                    {(item.qty * item.price).toFixed(2)} OMR
                  </div>
                </div>
              ))}
            </ListGroup.Item>

          </ListGroup>
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={4}>
          <Card className="summary-card">
            <Card.Body>
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Items</span>
                <strong>{order.itemsPrice} OMR</strong>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <strong>{order.shippingPrice} OMR</strong>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <strong>{order.taxPrice} OMR</strong>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <strong>{order.totalPrice} OMR</strong>
              </div>
            </Card.Body>

            {/* PAY BUTTON */}
            {!order.isPaid && userInfo && !userInfo.isAdmin && (
              <Button
                className="btn btn-primary w-100 my-3"
                onClick={payHandler}
                disabled={loading}
              >
                {loading ? "Redirecting..." : "Pay Now"}
              </Button>
            )}

            {/* ADMIN DELIVER */}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    className="btn btn-primary w-100 my-3"
                    onClick={deliverOrderHandler}
                    disabled={loadingDeliver}
                  >
                    {loadingDeliver
                      ? "Updating..."
                      : "Mark As Delivered"}
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;