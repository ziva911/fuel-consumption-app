import { createRef } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import BrandModel from "../../../../../../api/src/components/brand-model/brand-model.model";
import BrandModelService from "../../../../Services/BrandModelService";
import BasePage, { BasePageProperties } from "../../../BasePage/BasePage";

class AddModelPhotoProperties extends BasePageProperties {
  sidebar: JSX.Element;
  match?: {
    params: {
      bid: string;
      mid: string;
    };
  };
}
interface NewModelPhoto {
  brandModelId: number;
  manufactureYear: number;
  paintColor: string;
}
interface AddModelPhotoState {
  model: BrandModel | null;
  newModelPhoto: NewModelPhoto | null;
  photo: File | null;
  redirect: string;
  message: string;
}
export default class AddModelPhoto extends BasePage<AddModelPhotoProperties> {
  state: AddModelPhotoState;
  private hiddenFileInput: any;
  constructor(props: AddModelPhotoProperties) {
    super(props);
    this.hiddenFileInput = createRef();
    this.state = {
      model: null,
      newModelPhoto: null,
      photo: null,
      redirect: "",
      message: "",
    };
  }
  private getModelId(): number | null {
    const mid = this.props.match?.params.mid;
    return mid ? +mid : null;
  }
  private getBrandId(): number | null {
    const bid = this.props.match?.params.bid;
    return bid ? +bid : null;
  }
  private addPhotoToVehicle(photos: FileList) {
    if (photos.length) {
      this.setState({
        photo: photos[0],
      });
    }
  }

  private getModelData() {
    const mid = this.getModelId();
    if (mid) {
      BrandModelService.getModelById(mid).then((res) => {
        if (!res) {
          return this.setState({
            message: "Problem with loading model",
          });
        }
        this.setState({
          modelInfo: res,
          newModelPhoto: {
            ...this.state.newModelPhoto,
            brandModelId: res.id,
          },
        });
      });
    } else
      this.setState({
        redirect: "/dashboard/brand",
      });
  }

  componentDidMount() {
    this.getModelData();
  }

  componentDidUpdate(prevProps: AddModelPhotoProperties, prevState: AddModelPhotoState) {
    if (prevProps.match?.params.mid !== this.props.match?.params.mid) {
      this.getModelData();
    }
  }

  private onChangeInput(field: "paintColor" | "manufactureYear"): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "manufactureYear") {
        this.setState({
          newModelPhoto: {
            ...this.state.newModelPhoto,
            [field]: +event.target.value,
          },
        });
      }
      if (field === "paintColor") {
        this.setState({
          newModelPhoto: {
            ...this.state.newModelPhoto,
            [field]: event.target.value,
          },
        });
      }
    };
  }
  private handleUploadClick = () => {
    this.hiddenFileInput?.current.click();
  };

  private handleAddButtonClick() {
    if (this.state.newModelPhoto && this.state.photo) {
      const payload = this.state.newModelPhoto as NewModelPhoto;
      BrandModelService.attemptAddModelPhoto(payload, this.state.photo).then((res) => {
        const brandId = this.getBrandId();
        this.setState({ redirect: `/dashboard/brand/${brandId}` });
      });
    }
  }
  renderMain() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const newPhoto = this.state.newModelPhoto as NewModelPhoto;
    return (
      <Container>
        <Card>
          <Form>
            <Form.Group className="mt-3">
              <Form.Label htmlFor="manufactureYearInput">Manufacture year:</Form.Label>
              <Form.Control
                id="manufactureYearInput"
                type="number"
                placeholder="Car manufacture year..."
                value={newPhoto?.manufactureYear ?? ""}
                onChange={this.onChangeInput("manufactureYear").bind(this)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label htmlFor="paintColorInput">Paint color:</Form.Label>
              <Form.Control
                id="paintColorInput"
                type="text"
                placeholder="Color of your car..."
                value={newPhoto?.paintColor ?? ""}
                onChange={this.onChangeInput("paintColor").bind(this)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="paintColorInput">Model photo:</Form.Label>
              <Button onClick={this.handleUploadClick}>Add image</Button>
              <Form.File
                type="file"
                ref={this.hiddenFileInput}
                style={{ display: "none" }}
                className="custom-file-label"
                id="inputGroupFile01"
                onChange={(e: any) => this.addPhotoToVehicle(e.target.files)}
              />
            </Form.Group>
            <Form.Group className="mt-4 mb-2">
              <Button variant="primary" onClick={() => this.handleAddButtonClick()}>
                Confirm
              </Button>
            </Form.Group>
            {this.state.message ? <p className="mt-3">{this.state.message}</p> : ""}
          </Form>
        </Card>
      </Container>
    );
  }
}
