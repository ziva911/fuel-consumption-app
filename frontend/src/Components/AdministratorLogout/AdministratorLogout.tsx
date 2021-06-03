import { Component } from "react";
import { Redirect } from "react-router-dom";
import { saveAuthToken, saveRefreshToken } from "../../Api/Api";
import EventRegistry from "../../Api/EventRegistry";

class AdministratorLogoutState {
  logoutDone: boolean = false;
}

export default class AdministratorLogout extends Component {
  state: AdministratorLogoutState;

  constructor(props: any) {
    super(props);

    this.state = {
      logoutDone: false,
    };
  }

  componentDidMount() {
    saveAuthToken("administrator", "");
    saveRefreshToken("administrator", "");

    this.setState({
      logoutDone: true,
    });

    EventRegistry.emit("AUTH_EVENT", "administrator_logout");
  }

  render() {
    if (this.state.logoutDone) {
      return <Redirect to="/administrator/login" />;
    }

    return <p>Loging out...</p>;
  }
}
