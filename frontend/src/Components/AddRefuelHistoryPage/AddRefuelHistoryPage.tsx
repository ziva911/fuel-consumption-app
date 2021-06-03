import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import ICreateRefuelHistory from "../../../../../backend/api/src/components/refuel_history/dto/ICreateRefuelHistory";
import VehicleModel from "../../../../../backend/api/src/components/vehicle/vehicle.model";
>>>>>>> master
=======
import ICreateRefuelHistory from "../../../../../backend/api/src/components/refuel_history/dto/ICreateRefuelHistory";
import VehicleModel from "../../../../../backend/api/src/components/vehicle/vehicle.model";
>>>>>>> master
import EventRegistry from "../../Api/EventRegistry";
import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import RefuelHistoryService from "../../Services/RefuelHistoryService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
<<<<<<< HEAD
<<<<<<< HEAD
import VehicleModel from "../../../../api/src/components/vehicle/vehicle.model";
import ICreateRefuelHistory from "../../../../api/src/components/refuel_history/dto/ICreateRefuelHistory";
=======
>>>>>>> master
=======
>>>>>>> master

class AddRefuelHistoryPageProperties extends BasePageProperties {
  match?: {
    params: {
      vid: string;
    };
  };
  location?: {
    state: {
      vehicleInfo: VehicleModel;
    };
  };
}
class AddRefuelHistoryPageState {
  title: string;
  redirect: string;
  refuel: ICreateRefuelHistory | null;
  vehicleId: number | null;
  message: string;
  chosenDay: Date;
}
export default class AddRefuelHistoryPage extends BasePage<AddRefuelHistoryPageProperties> {
  state: AddRefuelHistoryPageState;

  constructor(props: AddRefuelHistoryPageProperties) {
    super(props);
    this.state = {
      title: "Loading...",
      redirect: "",
      refuel: null,
      vehicleId: null,
      message: "",
      chosenDay: new Date(),
    };
  }

  private getVechileId(): number | null {
    const vid = this.props.match?.params.vid;
    return vid ? +vid : null;
  }

  private getRefuelData() {
    const vid = this.getVechileId();

    if (vid === null) {
      this.setState({
        redirect: "/vehicle",
      });
    } else {
      let refuel = this.createNewRefuelHistory();
      refuel.vehicleId = vid;
      this.setState({
        ...this.state,
        vehicleId: vid,
        refuel: refuel,
      });
    }
  }

  private createNewRefuelHistory() {
    const today = new Date().toISOString().split("T")[0];
    const newVehicle: ICreateRefuelHistory = {
      date: today,
      quantity: 0,
      totalCost: 0,
      isFull: false,
      mileageCurrent: 0,
      vehicleId: 0,
    };
    return newVehicle;
  }

  componentDidMount() {
    EventRegistry.on("REFUEL_EVENT", this.handleRefuelEvent.bind(this));
    EventRegistry.on("AUTH_EVENT", this.handleAuthEvent.bind(this));
    this.getRefuelData();
  }

  componentDidUpdate(prevProps: AddRefuelHistoryPageProperties, prevState: AddRefuelHistoryPageState) {
    if (prevProps.match?.params.vid !== this.props.match?.params.vid || prevProps.location?.state !== this.props.location?.state) {
      this.getRefuelData();
    }
  }
  componentWillUnmount() {
    EventRegistry.off("AUTH_EVENT", this.handleAuthEvent.bind(this));
    EventRegistry.off("REFUEL_EVENT", this.handleRefuelEvent.bind(this));
  }

  private onChangeInput(
    field: "date" | "quantity" | "totalCost" | "isFull" | "mileageCurrent"
  ): (event: React.ChangeEvent<HTMLInputElement>) => void {
    if (["quantity", "totalCost", "mileageCurrent"].includes(field)) {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          refuel: {
            ...this.state.refuel,
            [field]: +event.target.value,
          },
        });
      };
    }
    if (["isFull"].includes(field)) {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          refuel: {
            ...this.state.refuel,
            [field]: event.target.checked,
          },
        });
      };
    }
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        refuel: {
          ...this.state.refuel,
          [field]: event.target.value,
        },
      });
    };
  }

  private handleAddButtonClick() {
    if (this.state.refuel) {
      const payload: ICreateRefuelHistory = this.state.refuel as ICreateRefuelHistory;
      RefuelHistoryService.attemptAddRefuelHistory(this.state.vehicleId ?? 0, payload)
        .then((res) => {
          if (!this.state.message) {
            this.setState({ redirect: `/vehicle/${this.state?.vehicleId}` });
          }
        })
        .catch((err) => {
          if (err.status === 404) {
            this.setState({ redirect: `/vehicle/${this.state?.vehicleId}` });
          }
          if (err.status === 400) {
            this.setState({ message: err });
          }
        });
    }
  }

  private handleAuthEvent(status: string, data: any) {
    if (status === "user_logout" || status === "force_login") {
      return this.setState({
        redirect: "/",
      });
    }
  }

  private handleRefuelEvent(status: string, data: any) {
    if (status === "fail_add_refuel") {
      if (data?.status === 400) {
        this.setState({
          message: data?.data,
        });
      }
    }
  }

  private handleChangeDate(date: any) {
    const chosenDay = new Date(date);
    return this.setState({
      ...this.state,
      chosenDay: chosenDay,
      refuel: {
        ...this.state.refuel,
        date: chosenDay.toISOString().split("T")[0],
      },
    });
  }
  renderMain(): JSX.Element {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    if (!this.getVechileId()) {
      return <Redirect to={"/vehicle"} />;
    } else {
      if (this.state.refuel) {
        const newRefuel = this.state.refuel as ICreateRefuelHistory;
        return (
          <Row>
            <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <b>New refuel</b>
                  </Card.Title>
                  <Card.Text as="div">
                    <Form>
                      <Form.Group>
                        <Form.Label htmlFor="dateInput">Refuel date:</Form.Label>
                        <DatePicker id="dateInput" selected={this.state.chosenDay} onChange={(date) => this.handleChangeDate(date)} />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="quantityInput">Units of fuel:</Form.Label>
                        <Form.Control
                          id="quantityInput"
                          type="number"
                          placeholder="How many units of fuel did you pour in?"
                          value={newRefuel?.quantity ?? ""}
                          onChange={this.onChangeInput("quantity").bind(this)}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="totalCostInput">Total cost:</Form.Label>
                        <Form.Control
                          id="totalCostInput"
                          type="number"
                          placeholder="How much did it cost in total?"
                          value={newRefuel?.totalCost ?? ""}
                          onChange={this.onChangeInput("totalCost").bind(this)}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="totalCostInput">To the top?</Form.Label>
                        <Form.Check
                          type="checkbox"
                          id="totalCostInput"
                          label={`Did you fill up the tank?`}
                          checked={newRefuel?.isFull}
                          onChange={this.onChangeInput("isFull").bind(this)}
                        />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label htmlFor="mileageCurrentInput">Mileage record:</Form.Label>
                        <Form.Control
                          id="mileageCurrentInput"
                          type="number"
                          placeholder="What was mileage after refuel?"
                          value={newRefuel?.mileageCurrent ?? ""}
                          onChange={this.onChangeInput("mileageCurrent").bind(this)}
                        />
                      </Form.Group>
                      <Form.Group className="mt-4 mb-2">
                        <Button variant="primary" onClick={() => this.handleAddButtonClick()}>
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
        );
      }
    }
    return <></>;
  }
}
