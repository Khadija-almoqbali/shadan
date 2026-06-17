import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/successCancelPay.css";

const PaymentCancelScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-card cancel">

        <div className="icon cancel-icon">✕</div>

        <h1 className="result-title">
          {t("paymentCancel.title")}
        </h1>

        <p className="result-text">
          {t("paymentCancel.description")}
        </p>

        <Link to="/payment" className="result-btn">
          {t("paymentCancel.tryAgain")}
        </Link>

        <Link to="/" className="result-link">
          {t("paymentCancel.backHome")}
        </Link>

      </div>
    </div>
  );
};

export default PaymentCancelScreen;