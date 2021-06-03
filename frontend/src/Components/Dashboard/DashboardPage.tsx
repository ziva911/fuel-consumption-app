import { Container } from "react-bootstrap";
import BasePage from "../BasePage/BasePage";
import { BasePageProperties } from "../BasePage/BasePage";
class DashboardPageProperties extends BasePageProperties {
  sidebar: JSX.Element;
}
interface DashboardPageState {}

export default class DashboardPage extends BasePage<DashboardPageProperties> {
  state: DashboardPageState;

  constructor(props: DashboardPageProperties) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  renderMain(): JSX.Element {
    return (
      <>
        <h1>Dashboard Page</h1>
        <Container></Container>
      </>
    );
  }
}
