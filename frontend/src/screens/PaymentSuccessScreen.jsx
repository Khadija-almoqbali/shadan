import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/successCancelPay.css";

const PaymentSuccessScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-card success">

        <div className="icon success-icon">✓</div>

        <h1 className="result-title">
          {t("paymentSuccess.title")}
        </h1>

        <p className="result-text">
          {t("paymentSuccess.description")}
        </p>

        <Link to="/orders" className="result-btn">
          {t("paymentSuccess.viewOrders")}
        </Link>

        <Link to="/" className="result-link">
          {t("paymentSuccess.backHome")}
        </Link>

      </div>
    </div>
  );
};

export default PaymentSuccessScreen;