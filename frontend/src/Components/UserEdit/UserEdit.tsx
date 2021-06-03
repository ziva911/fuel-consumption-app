import { Form, Container, Card, Col, Row, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import EventRegistry from "../../Api/EventRegistry";
import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import IUpdateUser from "../../../../api/src/components/user/dto/IUpdateUser";
import UserModel from "../../../../api/src/components/user/user.model";
import AuthService from "../../Services/AuthService";

class UserEditProperties extends BasePageProperties {
  location: {
    state: {
      user: UserModel;
    };
  };
}
class UserEditState {
  title: string;
  message: string;
  redirect: string;
  user: UserModel | null;
  form: IUpdateUser | null;
}
export default class UserEdit extends BasePage<UserEditProperties> {
  state: UserEditState;
  constructor(props: UserEditProperties) {
    super(props);
    this.state = {
      title: "Loading...",
      message: "",
      redirect: "",
      user: this.props.location?.state?.user as UserModel,
      form: null,
    };
  }

  componentDidMount() {
    this.setState({
      form: {
        ...this.state.form,
        firstName: this.state.user?.firstName,
        lastName: this.state.user?.lastName,
        phoneNumber: this.state.user?.phoneNumber,
      },
    });
    EventRegistry.on("AUTH_EVENT", this.handleAuthEvent.bind(this));
  }

  componentDidUpdate(prevProps: UserEditProperties, prevState: UserEditState) {}
  componentWillUnmount() {
    EventRegistry.off("AUTH_EVENT", this.handleAuthEvent.bind(this));
  }

  private onChangeInput(
    field: "email" | "password" | "firstName" | "lastName" | "phoneNumber"
  ): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        form: {
          ...this.state.form,
          [field]: event.target.value,
        },
      });
    };
  }

  private handleEditButtonClick() {
    if (this.state.form) {
      const payload: IUpdateUser = this.state.form as IUpdateUser;
      AuthService.attemptEditUser(payload);
    }
  }

  private handleAuthEvent(status: string, data: any) {
    if (status === "fail_user_register") {
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
      if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/firstName") {
        return this.setState({
          message: "Invalid first name: " + data?.data[0]?.message,
        });
      }
      if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/lastName") {
        return this.setState({
          message: "Invalid last name: " + data?.data[0]?.message,
        });
      }
      if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/phoneNumber") {
        return this.setState({
          message: "Invalid phoneNumber: " + data?.data[0]?.message,
        });
      }
      if (data?.data?.message) {
        return this.setState({
          message: data?.data?.message,
        });
      }
    }
    if (status === "user_register") {
      return this.setState({
        redirect: "/",
      });
    }
  }

  renderMain(): JSX.Element {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <Container>
        <Link to={`/profile`}>
          <span>{"<<"}</span>Back
        </Link>
        <Row>
          <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <b>Edit User</b>
                </Card.Title>
                <Card.Text as="div">
                  <Form>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="emailInput">Email:</Form.Label>
                      <Form.Control
                        id="emailInput"
                        type="email"
                        disabled
                        value={this.state.user?.email ?? ""}
                        onChange={this.onChangeInput("email").bind(this)}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="passwordInput">Password:</Form.Label>
                      <Form.Control
                        id="passwordInput"
                        type="password"
                        placeholder="Your password"
                        value={this.state.form?.password ?? ""}
                        onChange={this.onChangeInput("password").bind(this)}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="firstNameInput">First name:</Form.Label>
                      <Form.Control
                        id="firstNameInput"
                        type="text"
                        placeholder="Your first name"
                        value={this.state.form?.firstName ?? ""}
                        onChange={this.onChangeInput("firstName").bind(this)}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="lastNameInput">Last name:</Form.Label>
                      <Form.Control
                        id="lastNameInput"
                        type="text"
                        placeholder="Your last name"
                        value={this.state.form?.lastName ?? ""}
                        onChange={this.onChangeInput("lastName").bind(this)}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="phoneNumberInput">Phone number:</Form.Label>
                      <Form.Control
                        id="phoneNumberInput"
                        type="text"
                        placeholder="Your phone number"
                        value={this.state.form?.phoneNumber ?? ""}
                        onChange={this.onChangeInput("phoneNumber").bind(this)}
                      />
                    </Form.Group>

                    <Form.Group className="mt-4 mb-2">
                      <Button variant="primary" onClick={() => this.handleEditButtonClick()}>
                        Confirm
                      </Button>
                    </Form.Group>
                    {this.state.message ? <p className="mt-3">{this.state.message}</p> : ""}
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
