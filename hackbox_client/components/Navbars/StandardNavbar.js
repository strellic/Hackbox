import React from "react";
import Link from "next/link";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

class StandardNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-top navbar-horizontal navbar-dark"
          expand="md"
        >
          <Container className="px-4">
            <Link href="/dashboard">
              <span>
                <NavbarBrand href="/">
                  <img src={require("assets/img/brand/logo.png")} />
                </NavbarBrand>
              </span>
            </Link>
            <button className="navbar-toggler" id="navbar-collapse-main">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link href="/">
                      <img src={require("assets/img/brand/logo.png")}/>
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      id="navbar-collapse-main"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/register">
                    <NavLink className="nav-link-icon">
                      <i className="ni ni-circle-08" />
                      <span className="nav-link-inner--text">Register</span>
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/login">
                    <NavLink className="nav-link-icon">
                      <i className="ni ni-key-25" />
                      <span className="nav-link-inner--text">Login</span>
                    </NavLink>
                  </Link>
                </NavItem>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default StandardNavbar;
