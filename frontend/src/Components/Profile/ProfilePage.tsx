import BasePage from "../BasePage/BasePage";
import { BasePageProperties } from "../BasePage/BasePage";
import UserModel from "../../../../api/src/components/user/user.model";
import AuthService from "../../Services/AuthService";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

class ProfilePageProperties extends BasePageProperties {}
class ProfilePageState extends BasePageProperties {
  title: string;
  userInfo: UserModel | null;
  redirect: string;
}
export default class ProfilePage extends BasePage<ProfilePageProperties> {
  state: ProfilePageState;
  constructor(props: ProfilePageProperties) {
    super(props);
    this.state = {
      title: "",
      userInfo: null,
      redirect: "",
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps: ProfilePageProperties, prevState: ProfilePageProperties) {}

  private getUserData() {
    AuthService.getUser().then((user) => {
      if (user === null) {
        return this.setState({
          title: "No user info found",
          userInfo: null,
        });
      }
      this.setState({
        title: "Your information",
        userInfo: user,
      });
    });
  }

  renderMain(): JSX.Element {
    const user = this.state.userInfo as UserModel;
    return (
      <>
        <h1>{this.state.title}</h1>
        {user ? (
          <Container className="pageHolder">
            <Row>{"Email: " + user.email}</Row>
            <Row>{"First name: " + user.firstName}</Row>
            <Row>{"Last name: " + user.lastName}</Row>
            <Row>{"Phone number: " + user.phoneNumber}</Row>
            <Link
              className="btn btn-outline-danger"
              to={{
                pathname: "/user/edit",
                state: { user: user },
              }}
            >
              Edit info
            </Link>
          </Container>
        ) : (
          ""
        )}
      </>
    );
  }
}
