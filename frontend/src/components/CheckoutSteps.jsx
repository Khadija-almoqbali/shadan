import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import "../assets/styles/shippingScreen.css";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { t } = useTranslation();

  return (
    <Nav className="checkout-steps mb-4">

      <div className={`step ${step1 ? "active" : ""}`}>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link>{t("checkoutSteps.signIn")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("checkoutSteps.signIn")}</Nav.Link>
        )}
      </div>

      <div className={`step ${step2 ? "active" : ""}`}>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link>{t("checkoutSteps.shipping")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("checkoutSteps.shipping")}</Nav.Link>
        )}
      </div>

      <div className={`step ${step3 ? "active" : ""}`}>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>{t("checkoutSteps.payment")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("checkoutSteps.payment")}</Nav.Link>
        )}
      </div>

      <div className={`step ${step4 ? "active" : ""}`}>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>{t("checkoutSteps.placeOrder")}</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>{t("checkoutSteps.placeOrder")}</Nav.Link>
        )}
      </div>

    </Nav>
  );
};

export default CheckoutSteps;