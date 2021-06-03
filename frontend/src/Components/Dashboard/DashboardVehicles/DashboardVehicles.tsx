import { Container } from "react-bootstrap";
import BasePage from "../../BasePage/BasePage";
import { BasePageProperties } from "../../BasePage/BasePage";
class DashboardVehiclePageProperties extends BasePageProperties {
  sidebar: JSX.Element;
}
interface DashboardVehiclePageState {}

export default class DashboardVehiclePage extends BasePage<DashboardVehiclePageProperties> {
  state: DashboardVehiclePageState;

  constructor(props: DashboardVehiclePageProperties) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  renderMain(): JSX.Element {
    return (
      <>
        <h1>Vehicles</h1>
        <Container></Container>
      </>
    );
  }
}
