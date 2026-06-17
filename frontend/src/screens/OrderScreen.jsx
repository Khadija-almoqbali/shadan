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
import { useTranslation } from "react-i18next";

import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

import "../assets/styles/orderScreen.css";

const OrderScreen = () => {
  const { t } = useTranslation();

  const { id: orderId } = useParams();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  // 💳 Pay
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

  // 🚚 deliver
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order delivered");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to load order details");
    }
  }, [error]);

  if (isLoading || !order) {
    return <Loader />;
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>{t("order.title")}</h1>
        <span className="order-id">#{order._id}</span>
      </div>

      <Row className="g-4">

        {/* LEFT */}
        <Col lg={8}>
          <ListGroup variant="flush" className="order-card">

            {/* SHIPPING */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">{t("order.shipping")}</h2>

              <div className="info-group">
                <p>
                  <span>{t("order.name")}</span>
                  {order?.user?.name}
                </p>

                <p>
                  <span>{t("order.phone")}</span>
                  {order?.shippingAddress?.phoneNumber}
                </p>

                <p>
                  <span>{t("order.deliveryType")}</span>
                  {order?.shippingAddress?.deliveryType === "office"
                    ? t("order.officePickup")
                    : t("order.homeDelivery")}
                </p>

                <p>
                  <span>{t("order.address")}</span>
                  {order?.shippingAddress?.address},{" "}
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.country}
                </p>
              </div>

              <div className="lux-status-box">
                {order.isDelivered ? (
                  <div className="lux-status-success">
                    {t("order.delivered")} {order.deliveredAt?.substring(0, 10)}
                  </div>
                ) : (
                  <div className="lux-status-danger">
                    {t("order.notDelivered")}
                  </div>
                )}
              </div>
            </ListGroup.Item>

            {/* PAYMENT */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">{t("order.payment")}</h2>

              <p>
                <span>{t("order.paymentMethod")}:</span>{" "}
                {order.paymentMethod}
              </p>

              <div className="lux-status-box">
                {order.isPaid ? (
                  <div className="lux-status-success">
                    {t("order.paidOn")} {order.paidAt?.substring(0, 10)}
                  </div>
                ) : (
                  <div className="lux-status-danger">
                    {t("order.pendingPayment")}
                  </div>
                )}
              </div>
            </ListGroup.Item>

            {/* ITEMS */}
            <ListGroup.Item className="order-section">
              <h2 className="section-title">{t("order.orderItems")}</h2>

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

        {/* RIGHT */}
        <Col lg={4}>
          <Card className="summary-card">
            <Card.Body>
              <h2 className="summary-title">{t("order.summary")}</h2>

              <div className="summary-row">
                <span>{t("order.items")}</span>
                <strong>{order.itemsPrice} OMR</strong>
              </div>

              <div className="summary-row">
                <span>{t("order.shippingCost")}</span>
                <strong>{order.shippingPrice} OMR</strong>
              </div>

              <div className="summary-row">
                <span>{t("order.tax")}</span>
                <strong>{order.taxPrice} OMR</strong>
              </div>

              {order.couponCode && (
                <div className="summary-row">
                  <span>{t("order.couponCode")}</span>
                  <strong>{order.couponCode}</strong>
                </div>
              )}

              {order.discount > 0 && (
                <div className="summary-row">
                  <span>{t("order.discount")}</span>
                  <strong>
                    -{Math.min(order.discount, order.itemsPrice).toFixed(2)} OMR
                  </strong>
                </div>
              )}

              <div className="summary-row total-row">
                <span>{t("order.total")}</span>
                <strong>{order.totalPrice} OMR</strong>
              </div>
            </Card.Body>

            {!order.isPaid && userInfo && !userInfo.isAdmin && (
              <Button
                className="btn btn-primary w-100 my-3"
                onClick={payHandler}
                disabled={loading}
              >
                {loading ? t("order.redirecting") : t("order.payNow")}
              </Button>
            )}

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
                      ? t("order.updating")
                      : t("order.markDelivered")}
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