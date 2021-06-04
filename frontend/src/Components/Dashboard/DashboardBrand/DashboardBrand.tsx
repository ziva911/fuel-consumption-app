import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Brand from "../../../../../api/src/components/brand/brand.model";
import ICreateBrand from "../../../../../api/src/components/brand/dto/ICreateBrand";
import BrandModelService from "../../../Services/BrandModelService";
import BasePage from "../../BasePage/BasePage";
import { BasePageProperties } from "../../BasePage/BasePage";
import "./DashboardBrand.scss";
class DashboardBrandPageProperties extends BasePageProperties {
  sidebar: JSX.Element;
}
interface DashboardBrandPageState {
  allBrands: Brand[];
  title: string;
  newBrand: ICreateBrand | null;
}

export default class DashboardBrandPage extends BasePage<DashboardBrandPageProperties> {
  state: DashboardBrandPageState;

  constructor(props: DashboardBrandPageProperties) {
    super(props);
    this.state = {
      allBrands: [],
      title: "",
      newBrand: null,
    };
  }

  getAllBrands() {
    BrandModelService.getAllBrandsAndModels("administrator").then((res) => {
      if (res.length === 0) {
        return this.setState({
          title: "No brands found",
          newBrand: null,
          allBrands: [],
        });
      }
      this.setState({
        title: "All brands and models",
        allBrands: res,
      });
    });
  }
  componentDidMount() {
    this.getAllBrands();
  }

  private handleAddButtonClick() {
    if (this.state.newBrand) {
      BrandModelService.addNewBrand(this.state.newBrand).then((res) => this.getAllBrands());
    }
  }
  private onChangeInput(field: "name" | "logo"): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        newBrand: {
          ...this.state.newBrand,
          [field]: event.target.value,
        },
      });
    };
  }
  renderMain(): JSX.Element {
    return (
      <>
        <h1>Brands</h1>
        <Container>
          {this.state.allBrands?.length
            ? this.state.allBrands.map((brand, index) => {
                return (
                  <div key={"brand-name-" + brand.id} className="d-flex justify-content-between">
                    <Col>
                      <Row className="mt-3 brand-logo">
                        <img src={brand.logo} alt={brand.name + "-brand-image"} />
                        {brand.name}
                      </Row>
                      {brand.models?.length ? (
                        <>
                          Models:
                          <ul>
                            {brand.models?.map((model) => (
                              <li key={"model-" + model.id}>{model.name}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col className="d-flex align-items-center">
                      <Link
                        className="btn btn-outline-danger"
                        to={{
                          pathname: `/dashboard/brand/${brand.id}`,
                          state: { brandInfo: brand },
                        }}
                      >
                        Edit brand
                      </Link>
                    </Col>
                  </div>
                );
              })
            : "No brands found"}
          <Form className="d-flex justify-content-evenly">
            <Col>
              <Form.Group className="mt-3">
                <Form.Label htmlFor="newBrandNameInput">Brand name:</Form.Label>
                <Form.Control
                  id="newBrandNameInput"
                  type="text"
                  placeholder="Add here new brand name..."
                  value={this.state.newBrand?.name ?? ""}
                  onChange={this.onChangeInput("name").bind(this)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-3">
                <Form.Label htmlFor="newBrandLogoInput">Brand logo(url):</Form.Label>
                <Form.Control
                  id="newBrandLogoInput"
                  type="text"
                  placeholder="Add here url to brand logo..."
                  value={this.state.newBrand?.logo ?? ""}
                  onChange={this.onChangeInput("logo").bind(this)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mt-4 mb-2">
                <Button variant="primary" onClick={() => this.handleAddButtonClick()}>
                  Confirm
                </Button>
              </Form.Group>
            </Col>
          </Form>
        </Container>
      </>
    );
  }
}
