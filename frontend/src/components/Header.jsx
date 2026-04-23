import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import logo from '../assets/logo.png'; // Assuming you have a logo image in this path

const Header = () => {
  return (
    <header>
      <Navbar className="custom-navbar" variant="dark" expand="md" collapseOnSelect>
        <Container>

          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="Shadan" style={{ width: "auto", height: "60px" }} />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              
              <LinkContainer to="/cart">
              <Nav.Link >
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
  );
};

export default Header;