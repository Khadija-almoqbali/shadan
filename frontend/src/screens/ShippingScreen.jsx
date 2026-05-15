import { useState } from "react"
import { useEffect } from "react"
import { Form, Button } from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { saveShippingAddress } from "../slices/cartSlice"
import '../assets/styles/shippingScreen.css';
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const {shippingAddress} = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

    useEffect(() => {
    if (shippingAddress?.phoneNumber) {
      setPhoneNumber(shippingAddress.phoneNumber);
    }
  }, [shippingAddress]);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  


const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({address, city, phoneNumber, country}));
    navigate("/payment");
}



  return (
  <div className="checkout-wrapper">
    <div className="checkout-card">
      <CheckoutSteps step1 step2 />
      <h2 className="checkout-title">Shipping Details</h2>
      <p className="checkout-subtitle">Please enter your delivery information</p>
      
      <Form onSubmit={submitHandler}>

        <Form.Group controlId="address" className="lux-group">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="123 Street, Building name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="lux-input"
          />
        </Form.Group>

        <Form.Group controlId="city" className="lux-group">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Muscat"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="lux-input"
          />
        </Form.Group>

        <Form.Group controlId="phoneNumber" className="lux-group">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="+968 9123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="lux-input"
          />
        </Form.Group>

        <Form.Group controlId="country" className="lux-group">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Oman"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="lux-input"
          />
        </Form.Group>

        <Button type="submit" className="lux-button">
          Continue
        </Button>

      </Form>
    </div>
  </div>
);
}

export default ShippingScreen
