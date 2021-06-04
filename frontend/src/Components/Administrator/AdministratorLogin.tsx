import { Row, Col, Form, Card, Button } from "react-bootstrap";
import BasePage from "../BasePage/BasePage";
import React from "react";
import EventRegistry from "../../Api/EventRegistry";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
class AdministratorLoginState {
  email: string;
  password: string;
  message: string;
  isLoggedIn: boolean;
}
export default class AdministratorLogin extends BasePage<{}> {
  state: AdministratorLoginState;
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      message: "",
      isLoggedIn: false,
    };
  }
  componentDidMount() {
    EventRegistry.on("AUTH_EVENT", this.handleAuthEvent.bind(this));
  }

  componentWillUnmount() {
    EventRegistry.off("AUTH_EVENT", this.handleAuthEvent.bind(this));
  }

  renderMain(): JSX.Element {
    if (this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <Row>
        <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card>
            <Card.Body>
              <Card.Title>
                <b>Administrator login</b>
              </Card.Title>
              <Card.Text as="div">
                <Form>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="emailInput">Email:</Form.Label>
                    <Form.Control
                      id="emailInput"
                      type="email"
                      placeholder="Enter your email here..."
                      value={this.state.email}
                      onChange={this.onChangeInput("email")}
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="passwordInput">Password:</Form.Label>
                    <Form.Control
                      id="passwordInput"
                      type="password"
                      placeholder="Enter your password here..."
                      value={this.state.password}
                      onChange={this.onChangeInput("password")}
                    />
                  </Form.Group>

                  <Form.Group className="mt-4 mb-2">
                    <Button variant="primary" onClick={() => this.handleLoginButtonClick()}>
                      Log in
                    </Button>
                  </Form.Group>
                  {this.state.message ? <p className="mt-3">{this.state.message}</p> : ""}
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  private handleLoginButtonClick(): void {
    AuthService.attemptAdministratorLogin({ email: this.state.email, password: this.state.password });
  }

  private onChangeInput(field: "email" | "password"): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        [field]: event.target.value,
      });
    };
  }

  private handleAuthEvent(status: string, data: any) {
    if (status === "administrator_login_failed") {
      if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/email") {
        return this.setState({
          message: "Invalid email: " + data?.data[0]?.message,
        });
      }

      if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/password") {
        return this.setState({
          message: "Invalid password: " + data?.data[0]?.message,
        });
      }

      if (data?.status === 404) {
        return this.setState({
          message: "Administrator not found.",
        });
      }

      if (data === "Wrong role") {
        return this.setState({
          message: "Bad password.",
        });
      }
    }

    if (status === "administrator_login") {
      return this.setState({
        email: "",
        password: "",
        isLoggedIn: true,
      });
    }
  }
}
