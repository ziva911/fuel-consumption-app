import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import ICreateVehicle from "../../../../../backend/api/src/components/vehicle/dto/ICreateVehicle";
import IUpdateVehicle from "../../../../../backend/api/src/components/vehicle/dto/IUpdateVehicle";
import VehicleModel from "../../../../../backend/api/src/components/vehicle/vehicle.model";
>>>>>>> master
=======
import ICreateVehicle from "../../../../../backend/api/src/components/vehicle/dto/ICreateVehicle";
import IUpdateVehicle from "../../../../../backend/api/src/components/vehicle/dto/IUpdateVehicle";
import VehicleModel from "../../../../../backend/api/src/components/vehicle/vehicle.model";
>>>>>>> master
import EventRegistry from "../../Api/EventRegistry";
import VehicleService from "../../Services/VehicleService";
import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import BrandModelService from "../../Services/BrandModelService";
import FuelTypeService from "../../Services/FuelTypeService";
import { createRef } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import VehicleModel from "../../../../api/src/components/vehicle/vehicle.model";
import IUpdateVehicle from "../../../../api/src/components/vehicle/dto/IUpdateVehicle";
import ICreateVehicle from "../../../../api/src/components/vehicle/dto/ICreateVehicle";

=======
>>>>>>> master
=======
>>>>>>> master
class AddVehiclePageProperties extends BasePageProperties {
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
class AddVehiclePageState {
  title: string;
  vehicle: ICreateVehicle | IUpdateVehicle | null;
  vehicleInfo?: VehicleModel;
  message: string;
  vehicleId: number | null;
  redirect: string | null;
  vehicleBrands: any[];
  chosenBrand: any;
  fuelTypes: any[];
  photo: File | null;
}
export default class AddVehiclePage extends BasePage<AddVehiclePageProperties> {
  state: AddVehiclePageState;
  private chosenBrand: any;
  private chosenBrandId: number;
  private hiddenFileInput: any;
  constructor(props: AddVehiclePageProperties) {
    super(props);
    this.hiddenFileInput = createRef();
    this.chosenBrand = null;
    this.chosenBrandId = 0;
    this.state = {
      title: "Loading...",
      vehicle: null,
      photo: null,
      vehicleId: null,
      message: "",
      redirect: null,
      vehicleBrands: [],
      chosenBrand: null,
      fuelTypes: [],
    };
  }

  private getVechileId(): number | null {
    const vid = this.props.match?.params.vid;
    return vid ? +vid : null;
  }

  private getFuelTypeData() {
    FuelTypeService.getAllFuelTypes().then((res) => {
      if (res.length === 0) {
        return this.setState({
          message: "Problem with loading fuel types",
        });
      }
      const fuelTypes = res.filter((fuelType) => fuelType?.name);
      this.setState({
        fuelTypes: fuelTypes,
      });
    });
  }

  private getBrandData() {
    BrandModelService.getAllBrandsAndModels().then((res) => {
      if (res.length === 0) {
        return this.setState({
          message: "Problem with loading brands",
        });
      }
      const vehicleBrands = res.filter((brand) => brand.models.length);
      this.setState({
        vehicleBrands: vehicleBrands,
      });
    });
  }

  private getVehicleData() {
    const vid = this.getVechileId();

    if (vid === null) {
      const newVehicle: ICreateVehicle = this.createNewVehicleModel();
      this.setState({
        vehicleId: vid,
        vehicleInfo: null,
        vehicle: newVehicle,
      });
    } else {
      if (this.props.location?.state) {
        const value = { ...this.props.location?.state?.vehicleInfo };
        const editVehicle: IUpdateVehicle = {
          internalName: value.internalName ?? null,
          paintColor: value.paintColor ?? "",
        };
        this.setState({
          vehicleId: vid,
          vehicleInfo: value,
          vehicle: editVehicle,
        });
      }
    }
  }

  private createNewVehicleModel() {
    const newVehicle: ICreateVehicle = {
      internalName: "",
      manufactureYear: 0,
      paintColor: "",
      mileageStart: 0,
      fuelTypeId: 0,
      brandModelId: 0,
    };
    return newVehicle;
  }

  componentDidMount() {
    EventRegistry.on("VEHICLE_EVENT", this.handleVehicleEvent.bind(this));
    EventRegistry.on("AUTH_EVENT", this.handleAuthEvent.bind(this));
    this.getVehicleData();
    this.getBrandData();
    this.getFuelTypeData();
  }

  componentDidUpdate(prevProps: AddVehiclePageProperties, prevState: AddVehiclePageState) {
    if (prevProps.match?.params.vid !== this.props.match?.params.vid || prevProps.location?.state !== this.props.location?.state) {
      this.getVehicleData();
    }
  }
  componentWillUnmount() {
    EventRegistry.off("AUTH_EVENT", this.handleAuthEvent.bind(this));
    EventRegistry.off("VEHICLE_EVENT", this.handleVehicleEvent.bind(this));
  }
  private onChangeInput(
    field: "internalName" | "paintColor" | "manufactureYear" | "mileageStart" | "brandModelId" | "fuelTypeId"
  ): (event: React.ChangeEvent<HTMLInputElement>) => void {
    if (["manufactureYear", "mileageStart", "brandModelId", "fuelTypeId"].includes(field)) {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          vehicle: {
            ...this.state.vehicle,
            [field]: +event.target.value,
          },
        });
      };
    }
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        vehicle: {
          ...this.state.vehicle,
          [field]: event.target.value,
        },
      });
    };
  }

  private onChangeBrandInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.chosenBrandId = +event.target.value;
    this.chosenBrand = this.state.vehicleBrands.find((brand) => +brand.id === this.chosenBrandId);
    this.setState({
      chosenBrand: this.chosenBrand,
      vehicle: {
        ...this.state.vehicle,
        brandModelId: this.chosenBrand?.models[0]?.id,
      },
    });
  }

  private handleEditButtonClick(): void {
    if (this.state.vehicleId && this.state.vehicle) {
      const vehicleId = this.state.vehicleId;
      const payload: IUpdateVehicle = {
        internalName: (this.state.vehicle as IUpdateVehicle).internalName,
        paintColor: (this.state.vehicle as IUpdateVehicle).paintColor,
      };
      VehicleService.attemptEditVehicle(vehicleId, payload).then((res) => this.setState({ redirect: `/vehicle/${vehicleId}` }));
    }
  }
  private handleAddButtonClick() {
    if (this.state.vehicle) {
      const payload: ICreateVehicle = this.state.vehicle as ICreateVehicle;
      VehicleService.attemptAddVehicle(payload, this.state.photo).then((res) => this.setState({ redirect: `/vehicle/${res?.vehicleId}` }));
    }
  }
  private handleAuthEvent(status: string, data: any) {
    if (status === "user_logout" || status === "force_login") {
      return this.setState({
        redirect: "/",
      });
    }
  }

  private handleVehicleEvent(status: string, data: any) {
    if (status === "fail_edit_vehicle") {
      this.setState({ redirect: `/vehicle` });
      return;
    }
  }

  private handleUploadClick = () => {
    this.hiddenFileInput?.current.click();
  };

  private addPhotoToVehicle(photos: FileList) {
    if (photos.length) {
      this.setState({
        photo: photos[0],
      });
    }
  }

  renderMain(): JSX.Element {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    if (this.getVechileId() && this.state.vehicle) {
      const editVehicle = this.state.vehicle as IUpdateVehicle;
      return (
        <Row>
          <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <b>Edit vehicle</b>
                </Card.Title>
                <Card.Text as="div">
                  <Form>
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="internalNameInput">
                        Name <span>(optional)</span>:
                      </Form.Label>
                      <Form.Control
                        id="internalNameInput"
                        type="text"
                        placeholder="Name for your car..."
                        value={editVehicle?.internalName ?? ""}
                        onChange={this.onChangeInput("internalName").bind(this)}
                      />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="passwordInput">Paint color:</Form.Label>
                      <Form.Control
                        id="paintColorInput"
                        type="text"
                        placeholder="Color of your car..."
                        value={editVehicle?.paintColor ?? ""}
                        onChange={this.onChangeInput("paintColor").bind(this)}
                      />
                    </Form.Group>

                    <Form.Group className="mt-4 mb-2">
                      <Button variant="primary" onClick={() => this.handleEditButtonClick()}>
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
    const newVehicle = this.state.vehicle as ICreateVehicle;
    return (
      <Row>
        <Col sm={12} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card>
            <Card.Body>
              <Card.Title>
                <b>Add vehicle</b>
              </Card.Title>
              <Card.Text as="div">
                <Form>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="internalNameInput">
                      Name <span>(optional)</span>:
                    </Form.Label>
                    <Form.Control
                      id="internalNameInput"
                      type="text"
                      placeholder="Name for your car..."
                      value={newVehicle?.internalName ?? ""}
                      onChange={this.onChangeInput("internalName").bind(this)}
                    />
                  </Form.Group>
                  {this.state.vehicleBrands.length ? (
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="brandInput">Brand:</Form.Label>
                      <Form.Control
                        as="select"
                        id="brandInput"
                        value={this.chosenBrandId}
                        defaultValue={this.state.vehicleBrands[0]?.id}
                        onChange={this.onChangeBrandInput.bind(this)}
                      >
                        {this.state.vehicleBrands.map((brand) => {
                          return (
                            <option key={"brand-" + brand?.id} value={brand?.id}>
                              {brand?.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  ) : (
                    ""
                  )}
                  {this.chosenBrand ? (
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="modelInput">Model:</Form.Label>
                      <Form.Control
                        as="select"
                        id="modelInput"
                        value={newVehicle?.brandModelId ?? this.chosenBrand.models[0]?.id}
                        onChange={this.onChangeInput("brandModelId").bind(this)}
                      >
                        {this.chosenBrand
                          ? this.chosenBrand.models.map((model: any) => {
                              return (
                                <option key={"model-" + model?.id} value={model?.id}>
                                  {model?.name}
                                </option>
                              );
                            })
                          : ""}
                      </Form.Control>
                    </Form.Group>
                  ) : (
                    ""
                  )}
                  {this.state.fuelTypes.length ? (
                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="fuelTypeInput">Fuel type:</Form.Label>
                      <Form.Control
                        as="select"
                        id="fuelTypeInput"
                        value={newVehicle.fuelTypeId ?? null}
                        onChange={this.onChangeInput("fuelTypeId").bind(this)}
                      >
                        {this.state.fuelTypes.map((fuelType) => {
                          return (
                            <option key={"fuelType-" + fuelType?.id} value={fuelType?.id}>
                              {fuelType?.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Form.Group>
                  ) : (
                    ""
                  )}
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="manufactureYearInput">Manufacture year:</Form.Label>
                    <Form.Control
                      id="manufactureYearInput"
                      type="number"
                      placeholder="Car manufacture year..."
                      value={newVehicle?.manufactureYear ?? ""}
                      onChange={this.onChangeInput("manufactureYear").bind(this)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="mileageStartInput">Starting mileage:</Form.Label>
                    <Form.Control
                      id="mileageStartInput"
                      type="number"
                      placeholder="Car starting mileage..."
                      value={newVehicle?.mileageStart ?? ""}
                      onChange={this.onChangeInput("mileageStart").bind(this)}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="paintColorInput">Paint color:</Form.Label>
                    <Form.Control
                      id="paintColorInput"
                      type="text"
                      placeholder="Color of your car..."
                      value={newVehicle?.paintColor ?? ""}
                      onChange={this.onChangeInput("paintColor").bind(this)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="paintColorInput">Vehicle photo (optional):</Form.Label>
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
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}
