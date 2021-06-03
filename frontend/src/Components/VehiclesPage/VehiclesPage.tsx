import { Button, CardDeck, Col, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import BasePage from "../BasePage/BasePage";
import { BasePageProperties } from "../BasePage/BasePage";
import VehicleService from "../../Services/VehicleService";
import EventRegistry from "../../Api/EventRegistry";
import VehiclesArrayElement from "./VehiclesArrayElement/VehiclesArrayElement";
import ConfirmAction from "../Shared/ConfirmAction/ConfirmAction";
import "./VehiclesPage.scss";
import VehicleModel from "../../../../api/src/components/vehicle/vehicle.model";

class VehiclesPageProperties extends BasePageProperties {
  match?: {
    params: {
      vid: string;
    };
  };
}

class VehiclesPageState {
  title: string = "";
  userVehicles: VehicleModel[] = [];
  isUserLoggedIn: boolean = true;
  showDeleteDialog: boolean;
  deleteDialogYesHandler: () => void;
  deleteDialogNoHandler: () => void;
}
export default class VehiclesPage extends BasePage<VehiclesPageProperties> {
  state: VehiclesPageState;
  constructor(props: VehiclesPageProperties) {
    super(props);
    this.state = {
      showDeleteDialog: false,
      deleteDialogYesHandler: () => {},
      deleteDialogNoHandler: () => {
        this.setState({
          showDeleteDialog: false,
        });
      },
      title: "",
      userVehicles: [],
      isUserLoggedIn: true,
    };
  }

  componentDidMount() {
    this.getAllUserVehicles();
    EventRegistry.off("AUTH_EVENT", this.authEventHandler.bind(this));
  }

  componentDidUpdate(prevProps: VehiclesPageProperties, prevState: VehiclesPageState) {
    if (prevProps.match?.params.vid !== this.props.match?.params.vid) {
      this.getAllUserVehicles();
    }
  }

  private authEventHandler(status: string) {
    if (this.state.isUserLoggedIn && ["force_login", "user_login_failed", "user_logout", "administrator_logout"].includes(status)) {
      this.setState({
        isUserLoggedIn: false,
      });
    }
  }

  private getAllUserVehicles() {
    VehicleService.getAllVehicles().then((res) => {
      if (res.length === 0) {
        return this.setState({
          title: "No vehicles found",
          userVehicles: [],
        });
      }
      this.setState({
        title: "All vehicles",
        userVehicles: res,
      });
    });
  }

  renderMain(): JSX.Element {
    if (this.state.isUserLoggedIn === false) {
      return <Redirect to="/user/login" />;
    }
    return (
      <>
        {this.state.showDeleteDialog ? (
          <ConfirmAction
            title="Remove vehiclet?"
            message="Are you sure that you want to remove this vehicle?"
            yesHandler={this.state.deleteDialogYesHandler}
            noHandler={() => {
              this.setState({
                showDeleteDialog: false,
              });
            }}
          />
        ) : (
          ""
        )}
        <Container>
          <Row>
            <Col>
              <h1>{this.state.title}</h1>
            </Col>
            <Col>
              <Link to={"/vehicle/add"}>
                <Button>Add new vehicle</Button>
              </Link>
            </Col>
          </Row>

          <Row>
            <CardDeck className="row">
              {this.state.userVehicles
                ? this.state.userVehicles.map((vehicle) => {
                    return (
                      <Col xs={12} sm={6} md={4} lg={3} className="mt-3" key={"vehicle-elem-" + vehicle.vehicleId}>
                        <Row>
                          <VehiclesArrayElement vehicle={vehicle} />
                        </Row>
                        <Row>
                          <Col>
                            <Link
                              className="btn btn-link btn-outline-primary button-custom"
                              to={{
                                pathname: "/vehicle/edit/" + vehicle.vehicleId,
                                state: {
                                  vehicleInfo: vehicle,
                                },
                              }}
                            >
                              Edit
                            </Link>
                          </Col>
                          <Col>
                            <Button className="button-custom" onClick={this.getDeleteHandler(vehicle.vehicleId)}>
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    );
                  })
                : ""}
            </CardDeck>
          </Row>
        </Container>
      </>
    );
  }
  private getDeleteHandler(vehicleId: number): () => void {
    return () => {
      this.setState({
        showDeleteDialog: true,
        deleteDialogYesHandler: () => {
          VehicleService.attemptDeleteVehicle(vehicleId).then((result) => {
            this.setState({
              showDeleteDialog: false,
            });
            this.getAllUserVehicles();
          });
        },
      });
    };
  }
}
