import { Component, Suspense } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ContactPage from "../ContactPage/ContactPage";
import HomePage from "../HomePage/HomePage";
import TopMenu from "../TopMenu/TopMenu";
import "./Application.scss";
import VehiclesPage from "../Vehicles/VehiclesPage";
import SingleVehiclePage from "../Vehicles/SingleVehiclePage/SingleVehiclePage";
import UserLogin from "../User/UserLogin";
import UserLogout from "../User/UserLogout";
import UserRegister from "../User/UserRegister";
import EventRegistry from "../../Api/EventRegistry";
import api from "../../Api/Api";
import AdministratorLogin from "../Administrator/AdministratorLogin";
import AdministratorLogout from "../Administrator/AdministratorLogout";
import ProfilePage from "../Profile/ProfilePage";
import AddVehiclePage from "../Vehicles/AddVehiclePage/AddVehiclePage";
import AddRefuelHistoryPage from "../AddRefuelHistoryPage/AddRefuelHistoryPage";
import UserEdit from "../Profile/UserEdit";
import DashboardPage from "../Dashboard/DashboardPage";
import DashboardList from "../Dashboard/DashboardList";
import DashboardVehiclePage from "../Dashboard/DashboardVehicles/DashboardVehicles";
import DashboardBrandPage from "../Dashboard/DashboardBrand/DashboardBrand";
import DashboardFuelTypePage from "../Dashboard/DashboardFuelType/DashboardFuelType";
import BrandEditPage from "../Dashboard/DashboardBrand/BrandEditPage/BrandEditPage";
import AddModelPhoto from "../Dashboard/DashboardBrand/BrandEditPage/AddModelPhoto";

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
    if (this.state.authorizedRole === "user") {
      this.checkRole("user");
    }
    if (this.state.authorizedRole === "administrator") {
      this.checkRole("administrator");
    }
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
          this.setState({
            authorizedRole: "visitor",
          });
          EventRegistry.emit("AUTH_EVENT", "force_login");
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
                <Route exact path="/user/register" component={UserRegister} />
                <Route
                  exact
                  path="/user/edit"
                  render={(props: any) => {
                    return <UserEdit {...props} />;
                  }}
                />
                <Route exact path="/user/logout" component={UserLogout} />

                <Route exact path="/dashboard">
                  <DashboardPage sidebar={<DashboardList />} />
                </Route>
                <Route exact path="/dashboard/vehicle">
                  <DashboardVehiclePage sidebar={<DashboardList />} />
                </Route>
                <Route exact path="/dashboard/brand">
                  <DashboardBrandPage sidebar={<DashboardList />} />
                </Route>
                <Route
                  exact
                  path="/dashboard/brand/:bid?"
                  render={(props: any) => {
                    return <BrandEditPage {...props} sidebar={<DashboardList />} />;
                  }}
                ></Route>
                <Route
                  exact
                  path="/dashboard/brand/:bid?/model/:mid?"
                  render={(props: any) => {
                    return <AddModelPhoto {...props} sidebar={<DashboardList />} />;
                  }}
                ></Route>
                <Route exact path="/dashboard/fuel-type">
                  <DashboardFuelTypePage sidebar={<DashboardList />} />
                </Route>
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
