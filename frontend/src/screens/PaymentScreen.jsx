import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { savePaymentMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import '../assets/styles/shippingScreen.css';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("AmwalPay");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-card">

        <CheckoutSteps step1 step2 step3 />

        <h1 className="payment-title">Payment Method</h1>

        <Form onSubmit={submitHandler}>

          <Form.Group className="payment-group">
            <Form.Label className="payment-label">
              Select Payment Method
            </Form.Label>

            <div className="payment-option">
              <Form.Check
                type="radio"
                id="amwalpay"
                name="paymentMethod"
                value="AmwalPay"
                checked={paymentMethod === "AmwalPay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-radio"
                label="Amwal Pay (Cards / Apple Pay)"
              />
            </div>

          </Form.Group>

          <Button type="submit" className="payment-btn">
            Continue
          </Button>

        </Form>

      </div>
    </div>
  );
};

export default PaymentScreen;