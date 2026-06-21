import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { loadCart } from "../slices/cartSlice";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials(res));

      const cartKey = `cart_${res._id}`;

      const storedCart = localStorage.getItem(cartKey)
        ? JSON.parse(localStorage.getItem(cartKey))
        : null;

      const cartData = storedCart || {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "AmwalPay",
        discount: 0,
        couponCode: null,
      };

      dispatch(loadCart(cartData));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h1 style={{ fontWeight: "600", letterSpacing: "1px" }}>
            {t("login.title")}
          </h1>

          <p style={{ color: "#888" }}>{t("login.subtitle")}</p>
        </div>

        <Form
          onSubmit={submitHandler}
          style={{
            padding: "25px",
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <Form.Group controlId="email" className="my-3">
            <Form.Label>{t("login.emailLabel")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>{t("login.passwordLabel")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            {isLoading ? t("login.loading") : t("login.signin")}
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3 text-center">
          <Col>
            <span>{t("login.newCustomer")} </span>

            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              {t("login.createAccount")}
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginScreen;