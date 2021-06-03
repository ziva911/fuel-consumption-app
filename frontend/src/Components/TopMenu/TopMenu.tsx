import { Component } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
class TopMenuProperties {
  currentMenuType: "user" | "administrator" | "visitor" = "visitor";
}
export default class TopMenu extends Component<TopMenuProperties> {
  render() {
    if (this.props.currentMenuType === "administrator") {
      return (
        <Nav className="justify-content-center">
          <Nav.Item>
            <Link className="nav-link" to="/">
              Home
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/profile">
              My account
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/administrator/logout">
              Log out
            </Link>
          </Nav.Item>
        </Nav>
      );
    }
    if (this.props.currentMenuType === "user") {
      return (
        <Nav className="justify-content-center">
          <Nav.Item>
            <Link className="nav-link" to="/">
              Home
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/vehicle">
              Vehicles
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/profile">
              My account
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/user/logout">
              Log out
            </Link>
          </Nav.Item>
        </Nav>
      );
    }
    return (
      <Nav className="justify-content-center">
        <Nav.Item>
          <Link className="nav-link" to="/">
            Home
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link className="nav-link" to="/contact">
            Contact
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link className="nav-link" to="/user/login">
            Log in
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link className="nav-link" to="/user/register">
            Register
          </Link>
        </Nav.Item>
      </Nav>
    );
  }
}
