import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import Brand from "../../../../../../api/src/components/brand/brand.model";
import BasePage, { BasePageProperties } from "../../../BasePage/BasePage";
import IUpdateBrand from "../../../../../../api/src/components/brand/dto/IUpdateBrand";
import ICreateBrandModel from "../../../../../../api/src/components/brand-model/dto/ICreateBrandModel";
import BrandModelService from "../../../../Services/BrandModelService";
import "./BrandEditPage.scss";
import { Link } from "react-router-dom";
class BrandEditPageProperties extends BasePageProperties {
  sidebar: JSX.Element;
  match?: {
    params: {
      bid: string;
    };
  };
  location?: {
    state: {
      brandInfo: Brand;
    };
  };
}
interface BrandEditPageState {
  brand: IUpdateBrand | null;
  newModel: ICreateBrandModel | null;
  brandInfo?: Brand | null;
  redirect: string;
}

export default class BrandEditPage extends BasePage<BrandEditPageProperties> {
  state: BrandEditPageState;

  constructor(props: BrandEditPageProperties) {
    super(props);
    this.state = {
      brand: null,
      newModel: null,
      brandInfo: null,
      redirect: "",
    };
  }
  private getBrandId(): number | null {
    const bid = this.props.match?.params.bid;
    return bid ? +bid : null;
  }

  private getBrandData() {
    const bid = this.getBrandId();
    if (bid) {
      BrandModelService.getBrandById(bid).then((res) => {
        if (!res) {
          return this.setState({
            message: "Problem with loading brand",
          });
        }
        this.setState({
          brandInfo: res,
          brand: {
            id: res.id,
            name: res.name,
            logo: res.logo,
          },
        });
      });
    } else
      this.setState({
        redirect: "/dashboard/brand",
      });
  }

  componentDidMount() {
    this.getBrandData();
  }

  componentDidUpdate(prevProps: BrandEditPageProperties, prevState: BrandEditPageState) {
    if (prevProps.match?.params.bid !== this.props.match?.params.bid) {
      this.getBrandData();
    }
  }

  private handleEditButtonClick() {
    const brandId = this.getBrandId();
    if (this.state.brand && brandId) {
      const payload = {
        name: this.state.brand.name,
        logo: this.state.brand.logo,
      };
      BrandModelService.editBrand(brandId, payload as IUpdateBrand).then((res) => this.getBrandData());
    }
  }

  private handleAddModelButtonClick() {
    const brandId = this.getBrandId();
    if (this.state.newModel && brandId) {
      const payload = {
        brandId: brandId,
        name: this.state.newModel.name,
      };
      BrandModelService.addModelByBrandId(payload as ICreateBrandModel).then((res) => this.getBrandData());
    }
  }

  private onChangeInput(field: "name" | "logo"): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        brand: {
          ...this.state.brand,
          [field]: event.target.value,
        },
      });
    };
  }

  private onChangeModelInput(field: string): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        newModel: {
          [field]: event.target.value,
        },
      });
    };
  }

  renderMain(): JSX.Element {
    return (
      <>
        <h1>Edit brand</h1>
        <Container className="pageLoader">
          {this.state.brand ? (
            <Card className="Card">
              <Form className="d-flex flex-column justify-content-evenly">
                <Col>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="newBrandNameInput">Brand name:</Form.Label>
                    <Form.Control
                      id="newBrandNameInput"
                      type="text"
                      placeholder="Add here new brand name..."
                      value={this.state.brand?.name ?? ""}
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
                      value={this.state.brand?.logo ?? ""}
                      onChange={this.onChangeInput("logo").bind(this)}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mt-4 mb-2">
                    <Button variant="primary" onClick={() => this.handleEditButtonClick()}>
                      Edit
                    </Button>
                  </Form.Group>
                </Col>
              </Form>
            </Card>
          ) : (
            ""
          )}
          {this.state.brandInfo ? (
            <Card className="mt-3 Card">
              <Form className="d-flex flex-column justify-content-evenly">
                {this.state.brandInfo?.models?.length ? <Row className="w-100"> Models: </Row> : ""}
                <Row className="w-100">
                  <ul>
                    {this.state.brandInfo?.models?.map((model) => (
                      <li key={"model-id-" + model.id}>
                        <Link
                          to={{
                            pathname: `/dashboard/brand/${model.brandId}/model/${model.id}`,
                            state: { modelInfo: model },
                          }}
                        >
                          {model.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Row>
                <Row className="w-100"> Add new model: </Row>
                <Row className="w-100">
                  <Col>
                    <Form.Group className="mt-3 d-flex flex-rows justify-content-between">
                      <Form.Label htmlFor="newModelNameInput">Model name:</Form.Label>
                      <Form.Control
                        id="newModelNameInput"
                        type="text"
                        placeholder="Add here new mode for this brand..."
                        value={this.state.newModel?.name ?? ""}
                        onChange={this.onChangeModelInput("name").bind(this)}
                      />
                      <Button variant="primary" onClick={() => this.handleAddModelButtonClick()}>
                        Add model
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card>
          ) : (
            ""
          )}
        </Container>
      </>
    );
  }
}
