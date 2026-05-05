import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import logo from '../assets/logo.png'; // Assuming you have a logo image in this path
import '../assets/styles/header.css'; // Import custom CSS for styling
import { useRef } from "react";

const Header = () => {
  const navRef = useRef(null);

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
      </Nav.Link>
    </LinkContainer>

    <LinkContainer to="/login">
      <Nav.Link>
        <FaUser /> Sign In
      </Nav.Link>
    </LinkContainer>

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