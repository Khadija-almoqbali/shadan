import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, Form, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart, applyCoupon } from "../slices/cartSlice";
import { useValidateCouponMutation } from "../slices/ordersApiSlice";
import { useTranslation } from "react-i18next";
import "../assets/styles/cartScrenn.css";

// 🔥 helper بسيط لحل مشكلة {en, ar}
const getText = (field, lang = "en") => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const CartScreen = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, discount, couponCode: savedCoupon } = cart;

  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const [couponCode, setCouponCode] = useState(savedCoupon || "");
  const [couponMessage, setCouponMessage] = useState("");

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const subtotal =
    cartItems?.reduce((acc, item) => acc + item.qty * item.price, 0) || 0;

  const applyCouponHandler = async () => {
    try {
      const data = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        total: subtotal,
      }).unwrap();

      const discountValue = Number(data.discount || 0);

      dispatch(
        applyCoupon({
          couponCode: couponCode.trim().toUpperCase(),
          discount: discountValue,
        })
      );

      setCouponMessage(data.message || t("couponSuccess"));
    } catch (error) {
      setCouponMessage(error?.data?.message || t("couponInvalid"));
    }
  };

  const safeDiscount = Math.min(Number(discount || 0), subtotal);
  const total = subtotal - safeDiscount;

  return (
    <Row className="cart-screen">
      {/* LEFT SIDE */}
      <Col lg={8}>
        <div className="cart-header">
          <h1>{t("cartTitle")}</h1>
          <p>{t("cartSubtitle")}</p>
        </div>

        {cartItems.length === 0 ? (
          <Message>
            {t("cartEmpty")} <Link to="/">{t("goBack")}</Link>
          </Message>
        ) : (
          <div className="cart-items-wrapper">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item._id}>
                <div className="cart-item-image">
                  <Image src={item.image} alt={getText(item.name, lang)} fluid />
                </div>

                <div className="cart-item-details">
                  <Link
                    to={`/product/${item._id}`}
                    className="cart-item-title"
                  >
                    {getText(item.name, lang)}
                  </Link>

                  <p className="cart-item-price">
                    OMR {item.price ? item.price.toFixed(2) : "0.00"}
                  </p>

                  <Form.Select
                    className="qty-select"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {t("qty")} {x + 1}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <Button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Col>

      {/* RIGHT SIDE */}
      <Col lg={4}>
        <Card className="summary-card">
          <Card.Body>
            <h3>{t("orderSummary")}</h3>

            <div className="summary-row">
              <span>{t("items")}</span>
              <span>
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </div>

            <div className="summary-row">
              <span>{t("subtotal")}</span>
              <span>OMR {subtotal.toFixed(2)}</span>
            </div>

            {safeDiscount > 0 && (
              <div className="summary-row">
                <span>{t("discount")}</span>
                <span>- OMR {safeDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>{t("total")}</span>
              <span>OMR {total.toFixed(2)}</span>
            </div>

            {/* COUPON */}
            <div className="coupon-box">
              <Form.Control
                type="text"
                placeholder={t("couponPlaceholder")}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />

              <Button
                className="checkout-btn mt-2"
                type="button"
                onClick={applyCouponHandler}
                disabled={isLoading}
              >
                {isLoading ? t("applying") : t("applyCoupon")}
              </Button>

              {couponMessage && (
                <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
                  {couponMessage}
                </p>
              )}
            </div>

            <Button
              className="checkout-btn"
              type="button"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              {t("checkout")}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;