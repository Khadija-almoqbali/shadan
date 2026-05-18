import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import logo from '../assets/logo.png'; // Assuming you have a logo image in this path
import '../assets/styles/header.css'; // Import custom CSS for styling
import { useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {useLogoutMutation} from '../slices/usersApiSlice';
import {logout} from '../slices/authSlice';

const Header = () => {
  const navRef = useRef(null);
  const {cartItems} = useSelector((state) => state.cart);
  const {userInfo} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async()=>{
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
<div className="hero-banner">

  {/* Navbar inside Hero */}
  <header className="hero-header">
    <Navbar className="custom-navbar" variant="dark" expand="md" collapseOnSelect>
      <Container>

        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} alt="Shadan" style={{ height: "60px" }} />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav" ref={navRef}>

  {/* X button (mobile only) */}
  <button
    className="menu-close-btn"
    type="button"
    onClick={() => {
      const el = document.getElementById("basic-navbar-nav");
      if (el) el.classList.remove("show");
    }}
  >
    ✕
  </button>

  <Nav className="ms-auto">

    <LinkContainer to="/cart">
      <Nav.Link>
        <FaShoppingCart /> Cart
          {cartItems.length > 0 && (
            <span 
              className="cart-badge"
            >
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
                  )
                }
      </Nav.Link>
    </LinkContainer>
    {userInfo ? (
     <NavDropdown title={userInfo.name} id="username" className="lux-user-dropdown">
  <LinkContainer to="/profile">
    <NavDropdown.Item className="lux-dropdown-item">
      Profile
    </NavDropdown.Item>
  </LinkContainer>

  <NavDropdown.Divider />
  <NavDropdown.Item
    onClick={logoutHandler}
    className="lux-dropdown-item logout"
  >
    Logout
  </NavDropdown.Item>
</NavDropdown>
    ):( 
      <LinkContainer to="/login">
      <Nav.Link>
        <FaUser /> Sign In
      </Nav.Link>
    </LinkContainer>
  )}
  {userInfo && userInfo.isAdmin && (
    <NavDropdown title='Admin' id="adminmenu" className="lux-user-dropdown">
      <LinkContainer to='/admin/productlist'>
        <NavDropdown.Item className="lux-dropdown-item">
          Products
      </NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to='/admin/userlist'>
        <NavDropdown.Item className="lux-dropdown-item">
          Users
      </NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to='/admin/orderlist'>
        <NavDropdown.Item className="lux-dropdown-item">
          Orders
      </NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  )}
   

  </Nav>

</Navbar.Collapse>

      </Container>
    </Navbar>
  </header>

  {/* Hero Content */}
  <div className="hero-overlay" />

  <div className="hero-content">
    <p className="hero-tagline">New Arrivals</p>
    <h1>Crafted With Passion</h1>
    <p className="hero-sub">Explore our latest collection, curated just for you.</p>
    <a href="#products" className="hero-btn">Shop Now</a>
  </div>

</div>
  );
};

export default Header;