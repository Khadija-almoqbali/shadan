import { Link } from "react-router-dom";
import '../assets/styles/successCancelPay.css';

const PaymentCancelScreen = () => {
  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-card cancel">

        <div className="icon cancel-icon">✕</div>

        <h1 className="result-title">Payment Failed</h1>

        <p className="result-text">
          Something went wrong or the payment was cancelled.
          Please try again.
        </p>

        <Link to="/payment" className="result-btn">
          Try Again
        </Link>

        <Link to="/" className="result-link">
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default PaymentCancelScreen;