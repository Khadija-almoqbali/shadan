import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { saveShippingAddress } from "../slices/cartSlice";
import "../assets/styles/shippingScreen.css";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const { t } = useTranslation();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+968");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const [deliveryType, setDeliveryType] = useState(
    shippingAddress?.deliveryType || "home"
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (shippingAddress?.phoneNumber) {
      const phone = shippingAddress.phoneNumber;
      const codes = ["+968", "+971", "+966", "+973", "+965", "+974"];

      const matchedCode = codes.find((code) =>
        phone.startsWith(code)
      );

      if (matchedCode) {
        setCountryCode(matchedCode);
        setPhoneNumber(phone.replace(matchedCode, ""));
      } else {
        setPhoneNumber(phone);
      }
    }
  }, [shippingAddress]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!address || !city || !phoneNumber || !country) {
      setError(t("shipping.error"));
      return;
    }

    setError("");

    dispatch(
      saveShippingAddress({
        address,
        city,
        phoneNumber: `${countryCode}${phoneNumber}`,
        country,
        deliveryType,
      })
    );

    navigate("/payment");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">

        <CheckoutSteps step1 step2 />

        <h2 className="checkout-title">{t("shipping.title")}</h2>

        <p className="checkout-subtitle">
          {t("shipping.subtitle")}
        </p>

        {error && (
          <div style={{ color: "red", marginBottom: "10px", fontWeight: "bold" }}>
            {error}
          </div>
        )}

        <Form onSubmit={submitHandler}>

          <Form.Group controlId="address" className="lux-group">
            <Form.Label>{t("shipping.addressLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("shipping.addressPlaceholder")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="lux-input"
            />
          </Form.Group>

          <Form.Group controlId="city" className="lux-group">
            <Form.Label>{t("shipping.cityLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("shipping.cityPlaceholder")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="lux-input"
            />
          </Form.Group>

          <Row>
            <Col md={3}>
              <Form.Group className="lux-group">
                <Form.Label>{t("shipping.codeLabel")}</Form.Label>
                <Form.Select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="lux-input"
                >
                  <option value="+968">🇴🇲 +968</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+973">🇧🇭 +973</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+974">🇶🇦 +974</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={9}>
              <Form.Group controlId="phoneNumber" className="lux-group">
                <Form.Label>{t("shipping.phoneLabel")}</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder={t("shipping.phonePlaceholder")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="lux-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="country" className="lux-group">
            <Form.Label>{t("shipping.countryLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("shipping.countryPlaceholder")}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="lux-input"
            />
          </Form.Group>

          {/* DELIVERY TYPE */}
          <Form.Group className="lux-group">
            <Form.Label>{t("shipping.deliveryTitle")}</Form.Label>

            <div className="delivery-options">

              <label className={`delivery-card ${deliveryType === "home" ? "active" : ""}`}>
                <Form.Check
                  type="radio"
                  name="deliveryType"
                  value="home"
                  checked={deliveryType === "home"}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <div>
                  <strong>🏠 {t("shipping.homeDelivery")}</strong>
                  <p>2 OMR</p>
                </div>
              </label>

              <label className={`delivery-card ${deliveryType === "office" ? "active" : ""}`}>
                <Form.Check
                  type="radio"
                  name="deliveryType"
                  value="office"
                  checked={deliveryType === "office"}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <div>
                  <strong>🏢 {t("shipping.officePickup")}</strong>
                  <p>1 OMR</p>
                </div>
              </label>

            </div>
          </Form.Group>

          <Button type="submit" className="lux-button">
            {t("shipping.continue")}
          </Button>

        </Form>
      </div>
    </div>
  );
};

export default ShippingScreen;