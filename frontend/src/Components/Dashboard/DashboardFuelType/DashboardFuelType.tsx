import { Button, Container, Form, Row } from "react-bootstrap";
import BasePage from "../../BasePage/BasePage";
import { BasePageProperties } from "../../BasePage/BasePage";
import FuelTypeService from "../../../Services/FuelTypeService";
import FuelTypeModel from "../../../../../api/src/components/fuel-type/fuel-type.model";
class DashboardFuelTypePageProperties extends BasePageProperties {
  sidebar: JSX.Element;
}
interface DashboardFuelTypePageState {
  fuelTypes: FuelTypeModel[];
  title: string;
  newFuelType: string;
}

export default class DashboardFuelTypePage extends BasePage<DashboardFuelTypePageProperties> {
  state: DashboardFuelTypePageState;

  constructor(props: DashboardFuelTypePageProperties) {
    super(props);
    this.state = {
      fuelTypes: [],
      title: "",
      newFuelType: "",
    };
  }

  getAllUFuelTypes() {
    FuelTypeService.getAllFuelTypes("administrator").then((res) => {
      if (res.length === 0) {
        return this.setState({
          title: "No fuel types found",
          newFuelType: "",
          fuelTypes: [],
        });
      }
      this.setState({
        title: "All fuel types",
        newFuelType: "",
        fuelTypes: res,
      });
    });
  }
  componentDidMount() {
    this.getAllUFuelTypes();
  }

  private handleAddButtonClick() {
    if (this.state.newFuelType) {
      FuelTypeService.addNewFuelType({ name: this.state.newFuelType }).then((res) => this.getAllUFuelTypes());
    }
  }
  private onChangeInput(field: string): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "newFuelType") {
        this.setState({
          newFuelType: event.target.value,
        });
      }
    };
  }
  renderMain(): JSX.Element {
    return (
      <>
        <h1>Fuel Type</h1>
        <Container>
          {this.state.fuelTypes?.length
            ? this.state.fuelTypes.map((fuelType) => <Row key={"fueltype-" + fuelType.id}>{fuelType.name}</Row>)
            : "No fuel types found"}
          <Form>
            <Form.Group className="mt-3">
              <Form.Control
                id="newFuelTypeInput"
                type="text"
                placeholder="Add here new fuel type..."
                value={this.state.newFuelType ?? ""}
                onChange={this.onChangeInput("newFuelType").bind(this)}
              />
            </Form.Group>
            <Form.Group className="mt-4 mb-2">
              <Button variant="primary" onClick={() => this.handleAddButtonClick()}>
                Confirm
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </>
    );
  }
}
