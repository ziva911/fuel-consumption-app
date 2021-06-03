import { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";

export class BasePageProperties {
  sidebar?: JSX.Element;
}

export default abstract class BasePage<Properties extends BasePageProperties> extends Component<Properties> {
  public constructor(props: Properties) {
    super(props);
  }

  render() {
    const sideBarMd = this.props.sidebar ? 3 : 0;
    const sideBarLg = this.props.sidebar ? 4 : 0;

    return (
      <Container>
        <Row>
          <Col className="page-sidebar" sm={12} md={sideBarMd} lg={sideBarLg}>
            {this.props.sidebar}
          </Col>
          <Col className="page-body" sm={12} md={12 - sideBarMd} lg={12 - sideBarLg}>
            {this.renderMain()}
          </Col>
        </Row>
      </Container>
    );
  }

  abstract renderMain(): JSX.Element;
}
