import { Component, Suspense } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ContactPage from "../ContactPage/ContactPage";
import HomePage from "../HomePage/HomePage";
import TopMenu from "../TopMenu/TopMenu";
import "./Application.scss";
import VehiclesPage from "../VehiclesPage/VehiclesPage";
import SingleVehiclePage from "../SingleVehiclePage/SingleVehiclePage";
import UserLogin from "../UserLogin/UserLogin";
import EventRegistry from "../../Api/EventRegistry";
import api from "../../Api/Api";
import UserLogout from "../UserLogout/UserLogout";
import AdministratorLogin from "../AdministratorLogin/AdministratorLogin";
import AdministratorLogout from "../AdministratorLogout/AdministratorLogout";
import ProfilePage from "../ProfilePage/ProfilePage";
import AddVehiclePage from "../AddVehiclePage/AddVehiclePage";
import AddRefuelHistoryPage from "../AddRefuelHistoryPage/AddRefuelHistoryPage";

class ApplicationState {
  authorizedRole: "user" | "administrator" | "visitor" = "visitor";
}

class ApplicationProperties {}

export default class Application extends Component<ApplicationProperties> {
  state: ApplicationState;

  constructor(props: ApplicationProperties) {
    super(props);

    this.state = {
      authorizedRole: "visitor",
    };
  }

  componentDidMount() {
    EventRegistry.on("AUTH_EVENT", this.authEventHandler.bind(this));

    this.checkRole("user").then((res) => {
      if (!res) {
        this.checkRole("administrator");
      }
    });
  }

  componentWillUnmount() {
    EventRegistry.off("AUTH_EVENT", this.authEventHandler.bind(this));
  }

  private authEventHandler(message: string) {
    if (["force_login", "user_login_failed", "administrator_login_failed", "user_logout", "administrator_logout"].includes(message)) {
      if (this.state.authorizedRole !== "visitor") {
        this.setState({
          authorizedRole: "visitor",
        });
      }
    }

    if (message === "user_login") {
      return this.setState({ authorizedRole: "user" });
    }

    if (message === "administrator_login") {
      return this.setState({ authorizedRole: "administrator" });
    }
  }

  private checkRole(role: "user" | "administrator") {
    return new Promise<boolean>((resolve, reject) => {
      api("get", `/auth/${role}/ok`, role)
        .then((res) => {
          if (res?.data === "OK") {
            this.setState({
              authorizedRole: role,
            });
            EventRegistry.emit("AUTH_EVENT", role + "_login");
            resolve(true);
          }
          resolve(false);
        })
        .catch(() => {});
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Container fluid className="Application">
          <div className="Application-header">Fuel consumption tracking app</div>

          <TopMenu currentMenuType={this.state.authorizedRole} />

          <div className="Application-body">
            <Suspense fallback={<div>Ucita se</div>}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route
                  exact
                  path="/vehicle"
                  render={(props: any) => {
                    return <VehiclesPage {...props} />;
                  }}
                />
                <Route
                  exact
                  path="/vehicle/edit/:vid?"
                  render={(props: any) => {
                    return <AddVehiclePage {...props} />;
                  }}
                ></Route>
                <Route exact path="/vehicle/add" component={AddVehiclePage} />
                <Route exact path="/vehicle/:vid?/history" component={AddRefuelHistoryPage} />
                <Route
                  exact
                  path="/vehicle/:vid?"
                  render={(props: any) => {
                    return <SingleVehiclePage {...props} />;
                  }}
                ></Route>
                <Route exact path="/contact">
                  <ContactPage address="Belgrade, Serbia" phone="123455" />
                </Route>
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/user/login" component={UserLogin} />
                <Route exact path="/user/logout" component={UserLogout} />
                <Route exact path="/administrator/login" component={AdministratorLogin} />
                <Route exact path="/administrator/logout" component={AdministratorLogout} />
              </Switch>
            </Suspense>
          </div>

          <div className="Application-footer">&copy;2021 Nikola Živanović</div>
        </Container>
      </BrowserRouter>
    );
  }
}
