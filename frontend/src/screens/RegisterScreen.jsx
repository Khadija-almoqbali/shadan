import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { loadCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error(t("register.passwordMismatch"));
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();

      dispatch(setCredentials({ ...res }));

      // 🔥 NEW: create clean cart for new user
      const cartKey = `cart_${res._id}`;

      const newCart = {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "AmwalPay",
        discount: 0,
        couponCode: null,
      };

      localStorage.setItem(cartKey, JSON.stringify(newCart));
      dispatch(loadCart(newCart));

      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h1 style={{ fontWeight: "600", letterSpacing: "1px" }}>
            {t("register.title")}
          </h1>

          <p style={{ color: "#888" }}>
            {t("register.subtitle")}
          </p>
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
          {/* NAME */}
          <Form.Group controlId="name" className="my-3">
            <Form.Label>{t("register.nameLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("register.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          {/* EMAIL */}
          <Form.Group controlId="email" className="my-3">
            <Form.Label>{t("register.emailLabel")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("register.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group controlId="password" className="my-3">
            <Form.Label>{t("register.passwordLabel")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          {/* CONFIRM PASSWORD */}
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>
              {t("register.confirmPasswordLabel")}
            </Form.Label>
            <Form.Control
              type="password"
              placeholder={t("register.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px 12px",
              }}
            />
          </Form.Group>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            {isLoading
              ? t("register.loading")
              : t("register.button")}
          </Button>

          {isLoading && <Loader />}
        </Form>

        {/* FOOTER LINK */}
        <Row className="py-3 text-center">
          <Col>
            <span>{t("register.alreadyAccount")} </span>

            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              {t("register.login")}
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegisterScreen;