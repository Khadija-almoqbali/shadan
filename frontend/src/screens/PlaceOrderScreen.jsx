import { useEffect } from "react";
import {Link,useNavigate} from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import {Row,Col,ListGroup,Image,Card,Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {useCreateOrderMutation} from '../slices/ordersApiSlice';
import {clearCartItems} from '../slices/cartSlice';
import '../assets/styles/shippingScreen.css';

const PlaceOrderScreen = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    useEffect(() => {
        if(!cart.shippingAddress?.address){
            navigate('/shipping');
        } else if(!cart.paymentMethod){
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress?.address, navigate]);
    
    const placeOrderHandler = async () =>{
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                phoneNumber: cart.shippingAddress.phoneNumber,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                totalPrice: cart.totalPrice
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error?.data?.message || error?.error || "Something went wrong");
        }
    }

  return (
<>
  <div className="checkout-page">

    

    <div className="checkout-card">
        <CheckoutSteps step1 step2 step3 step4 />

      <Row>

        {/* LEFT SIDE */}
        <Col md={8}>
          <div className='luxury-section p-4'>

            <ListGroup variant='flush'>

              <ListGroup.Item className='luxury-item'>
                <h2 className='section-title'>Shipping</h2>
                <p className='section-text'>
                  <strong>Address:</strong>{" "}
                  {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className='luxury-item'>
                <h2 className='section-title'>Phone Number</h2>
                <p className='section-text'>
                  +968 {cart.shippingAddress?.phoneNumber || "No phone number provided"}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className='luxury-item'>
                <h2 className='section-title'>Payment Method</h2>
                <p className='section-text'>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className='luxury-item'>
                <h2 className='section-title'>Order Items</h2>

                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className='product-item py-3'
                      >
                        <Row className='align-items-center'>

                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                              className='product-image'
                            />
                          </Col>

                          <Col>
                            <Link
                              to={`/product/${item.product}`}
                              className='product-link'
                            >
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4} className='price-text'>
                            {item.qty} × {item.price} OMR =
                            <span className='fw-bold ms-1'>
                              {(item.qty * item.price).toFixed(2)} OMR
                            </span>
                          </Col>

                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>

            </ListGroup>

          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={4} className="mt-4 mt-md-0">
         <Card className='summary-card border-0 sticky-summary'>
            <Card.Body>

              <h2 className='summary-title mb-4'>Order Summary</h2>

              <ListGroup variant='flush'>

                <ListGroup.Item className='summary-item'>
                  <Row>
                    <Col>Items</Col>
                    <Col className='text-end'>{cart.itemsPrice} OMR</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className='summary-item'>
                  <Row>
                    <Col>Shipping</Col>
                    <Col className='text-end'>{cart.shippingPrice} OMR</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className='summary-item total-row'>
                  <Row>
                    <Col>Total</Col>
                    <Col>
                      <span className="total-price">
                        {Number(cart.totalPrice || 0).toFixed(2)} OMR
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {error && (
                  <ListGroup.Item className='border-0'>
                    <Message variant='danger'>
                      {error?.data?.message || error?.data || error?.message || "Something went wrong"}
                    </Message>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className='border-0 mt-3'>
                  <Button
                    type='button'
                    className='luxury-btn w-100'
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>

                  {isLoading && <Loader />}
                </ListGroup.Item>

              </ListGroup>

            </Card.Body>
          </Card>

        </Col>

      </Row>

    </div>

  </div>
</>
  )
}

export default PlaceOrderScreen
