import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import '../assets/styles/header.css';
import { useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const navRef = useRef(null);
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isHome = location.pathname === '/';

  const AdminMenu = () => (
    userInfo && userInfo.isAdmin && (
      <NavDropdown title="Admin" id="adminmenu" className="lux-user-dropdown">

        <LinkContainer to="/admin/productlist">
          <NavDropdown.Item>Products</NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/admin/userlist">
          <NavDropdown.Item>Users</NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/admin/orderlist">
          <NavDropdown.Item>Orders</NavDropdown.Item>
        </LinkContainer>

      </NavDropdown>
    )
  );

  return (
    <>
      {/* ================= HOME HEADER ================= */}
      {isHome ? (
        <div className="hero-banner">

          <header className="hero-header">
            <Navbar className="custom-navbar" variant="dark" expand="md" collapseOnSelect>
              <Container>

                <LinkContainer to="/">
                  <Navbar.Brand>
                    <img src={logo} alt="Shadan" style={{ height: "60px" }} />
                  </Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle />

                <Navbar.Collapse id="basic-navbar-nav" ref={navRef} className="lux-collapse">

                  {/* CLOSE BUTTON (MOBILE ONLY VIA CSS) */}
                  <button
                    className="menu-close-btn"
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
                          <span className="cart-badge">
                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                          </span>
                        )}
                      </Nav.Link>
                    </LinkContainer>

                    {AdminMenu()}

                    {userInfo ? (
                      <NavDropdown
                        title={userInfo.name}
                        id="username"
                        className="lux-user-dropdown"
                      >
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>

                        <NavDropdown.Divider />

                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    ) : (
                      <LinkContainer to="/login">
                        <Nav.Link>
                          <FaUser /> Sign In
                        </Nav.Link>
                      </LinkContainer>
                    )}

                  </Nav>
                </Navbar.Collapse>

              </Container>
            </Navbar>
          </header>

          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="hero-tagline">New Arrivals</p>
            <h1>Crafted With Passion</h1>
            <p className="hero-sub">Explore our latest collection</p>
            <a href="#products" className="hero-btn">Shop Now</a>
          </div>

        </div>
      ) : (
        /* ================= SIMPLE HEADER ================= */
        <div className="lux-header">

          <Navbar className="lux-navbar" expand="md" collapseOnSelect>
            <Container fluid>

              <LinkContainer to="/">
                <Navbar.Brand>
                  <img src={logo} alt="Shadan" style={{ height: "50px" }} />
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle />

              <Navbar.Collapse ref={navRef} id="basic-navbar-nav">

                <button
                  className="menu-close-btn"
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
                        <span className="cart-badge">
                          {cartItems.reduce((a, c) => a + c.qty, 0)}
                        </span>
                      )}
                    </Nav.Link>
                  </LinkContainer>

                  {AdminMenu()}

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="username" className="lux-user-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Divider />

                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <LinkContainer to="/login">
                      <Nav.Link>
                        <FaUser /> Sign In
                      </Nav.Link>
                    </LinkContainer>
                  )}

                </Nav>
              </Navbar.Collapse>

            </Container>
          </Navbar>

        </div>
      )}
    </>
  );
};

export default Header;