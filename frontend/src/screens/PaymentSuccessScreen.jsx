import { Link } from "react-router-dom";
import '../assets/styles/successCancelPay.css';

const PaymentSuccessScreen = () => {
  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-card success">

        <div className="icon success-icon">✓</div>

        <h1 className="result-title">Payment Successful</h1>

        <p className="result-text">
          Thank you! Your payment has been completed successfully.
          Your order is now being processed.
        </p>

        <Link to="/orders" className="result-btn">
          View My Orders
        </Link>

        <Link to="/" className="result-link">
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default PaymentSuccessScreen;