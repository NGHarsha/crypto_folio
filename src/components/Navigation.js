import React from "react";
import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";

const Navigation = ({ user }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="black" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CryptoFolio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {!user.isLoggedIn && (
            <Nav>
              <Nav.Item>
                <Nav.Link as={Link} to="/signin">
                  Signin
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/signup">
                  Register
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
          {user.isLoggedIn && (
            <Nav>
              <Nav.Item>
                <Nav.Link as={Link} to="/portfolio">
                  Your Portfolio
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/signout">
                  Signout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Navigation);
