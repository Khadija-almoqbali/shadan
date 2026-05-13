import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Row, Col, Image, Form, Button, Card} from 'react-bootstrap';
import {FaTrash} from 'react-icons/fa'
import Message from '../components/Message';
import {addToCart, removeFromCart} from '../slices/cartSlice';
import '../assets/styles/cartScrenn.css';

const CartScreen = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state)=> state.cart);
    const {cartItems} = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({...product, qty}))
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };
    const checkoutHandler = () =>{
        navigate('/login?redirect=/shipping');
    }


  return (
    <Row className="cart-screen">
  {/* LEFT SIDE */}
  <Col lg={8}>
    <div className="cart-header">
      <h1>Shopping Cart</h1>
      <p>Your selected jewelry pieces</p>
    </div>

    {cartItems.length === 0 ? (
      <Message>
        Your cart is empty <Link to="/">Go Back</Link>
      </Message>
    ) : (
      <div className="cart-items-wrapper">
        {cartItems.map((item) => (
          <div className="cart-item-card" key={item._id}>
            <div className="cart-item-image">
              <Image
                src={item.image}
                alt={item.name}
                fluid
              />
            </div>

            <div className="cart-item-details">
              <Link
                to={`/product/${item._id}`}
                className="cart-item-title"
              >
                {item.name}
              </Link>

              <p className="cart-item-price">
                OMR {item.price}
              </p>

              <Form.Select
                className="qty-select"
                value={item.qty}
                onChange={(e) =>
                  addToCartHandler(
                    item,
                    Number(e.target.value)
                  )
                }
              >
                {[...Array(item.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    Qty: {x + 1}
                  </option>
                ))}
              </Form.Select>
            </div>

            <Button
              type="button"
              className="remove-btn"
              onClick={() =>
                removeFromCartHandler(item._id)
              }
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </div>
    )}
  </Col>

  {/* RIGHT SIDE */}
  <Col lg={4}>
    <Card className="summary-card">
      <Card.Body>
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>Items</span>
          <span>
            {cartItems.reduce(
              (acc, item) => acc + item.qty,
              0
            )}
          </span>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>
            OMR{" "}
            {cartItems
              .reduce(
                (acc, item) =>
                  acc + item.qty * item.price,
                0
              )
              .toFixed(2)}
          </span>
        </div>

        <Button
          className="checkout-btn"
          type="button"
          disabled={cartItems.length === 0}
          onClick={checkoutHandler}
        >
          Proceed to Checkout
        </Button>
      </Card.Body>
    </Card>
  </Col>
</Row>
  )
}

export default CartScreen;
