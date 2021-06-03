import { Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import VehicleModel from "../../../../../backend/api/src/components/vehicle/vehicle.model";
import RefuelHistory from "../../../../../backend/api/src/components/refuel_history/refuel-history.model";
import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import "./SingleVehiclePage.scss";
import VehicleService from "../../Services/VehicleService";
import RefuelHistoryService from "../../Services/RefuelHistoryService";
import { ApiConfiguration } from "../../Config/api.config";
import { getThumbPath } from "../VehiclesPage/VehiclesArrayElement/VehiclesArrayElement";
import { ReactComponent as DefaultPhoto } from "../../Shared/default_photo.svg";
import { createRef } from "react";
import { Link } from "react-router-dom";
import { CheckLg, XLg, TrashFill } from "react-bootstrap-icons";
import { FaTrashAlt } from "react-icons/fa";
class SingleVehiclePageProperties extends BasePageProperties {
  match?: {
    params: {
      vid: string;
    };
  };
}

class SingleVehiclePageState {
  title: string = "";
  vehicleInfo: VehicleModel | null = null;
  redirect: string;
}
export default class SingleVehiclePage extends BasePage<SingleVehiclePageProperties> {
  state: SingleVehiclePageState;
  hiddenFileInput: any;
  constructor(props: SingleVehiclePageProperties) {
    super(props);
    this.hiddenFileInput = createRef();
    this.state = {
      title: "",
      vehicleInfo: null,
      redirect: "",
    };
  }

  componentDidMount() {
    this.getVehicleData();
  }

  componentDidUpdate(prevProps: SingleVehiclePageProperties, prevState: SingleVehiclePageProperties) {
    if (prevProps.match?.params.vid !== this.props.match?.params.vid) {
      this.getVehicleData();
    }
  }

  private getVehicleId(): number | null {
    const vid = Number(this.props.match?.params.vid);
    return vid ? +vid : null;
  }

  private getVehicleData() {
    const vid = this.getVehicleId();
    if (vid !== null) {
      this.getVehicleById(vid);
    }
  }

  private getVehicleById(vehicleId: number) {
    VehicleService.getVehicleById(vehicleId).then((vehicle) => {
      if (vehicle === null) {
        return this.setState({
          title: "No vehicles found",
          vehicleInfo: null,
        });
      }
      this.setState({
        title: vehicle.internalName
          ? `${vehicle.internalName} (${vehicle.brandModel?.brand?.name} ${vehicle.brandModel?.name})`
          : `${vehicle.brandModel?.brand?.name} ${vehicle.brandModel?.name}`,
        vehicleInfo: vehicle,
      });
    });
  }

  private uploadPhotoToVehicle(id: number, photos: FileList) {
    if (photos?.length) {
      VehicleService.attemptAddVehiclePhoto(id, photos[0]).then((res) => this.getVehicleData());
    }
  }

  private deleteVehiclePhoto(vehicleId: number) {
    VehicleService.attemptDeleteVehiclePhoto(vehicleId).then((res) => this.getVehicleData());
  }

  private getDeleteHandler(refuelHistoryId: number) {
    const vehicleId = this.getVehicleId();
    if (!vehicleId) {
      return;
    }
    RefuelHistoryService.attemptDeleteRefuelHistoryRecord(vehicleId, refuelHistoryId).then((res) => this.getVehicleData());
  }
  handleUploadClick = () => {
    this.hiddenFileInput?.current.click();
  };
  renderMain(): JSX.Element {
    const vehicle = this.state.vehicleInfo;
    return (
      <>
        <h1>{this.state.title}</h1>
        {vehicle ? (
          <Container className="pageHolder">
            <Row className="vehicleInfo-container" key={"vehicle-elem-" + vehicle.vehicleId}>
              {vehicle.imagePath ? (
                <Col xs={6} md={4}>
                  <Row>
                    <Image src={getThumbPath(ApiConfiguration.UPLOAD_PATH + "/" + vehicle?.imagePath) ?? "../../Shared/default_photo.svg"} />
                  </Row>
                  <Row>
                    <Col>
                      <Button onClick={this.handleUploadClick}>Edit image</Button>
                      <Form.File
                        type="file"
                        ref={this.hiddenFileInput}
                        style={{ display: "none" }}
                        className="custom-file-label"
                        id="inputGroupFile01"
                        onChange={(e: any) => this.uploadPhotoToVehicle(vehicle.vehicleId, e.target.files)}
                      />
                    </Col>
                    <Col>
                      <Button onClick={() => this.deleteVehiclePhoto(vehicle?.vehicleId)}>Delete image</Button>
                    </Col>
                  </Row>
                </Col>
              ) : (
                <Col xs={6} md={4} className="default-photo-container">
                  <Row>
                    <DefaultPhoto className="default-photo" fill={"" + vehicle.paintColor} viewBox="0 0 1000 800" />
                  </Row>
                  <Row>
                    <Col>Add image</Col>
                  </Row>
                </Col>
              )}
              <Col xs={6} md={8} className="vehicleInfo">
                <Row>
                  <Col xs={12} sm={8} md={9} lg={4} className="mt-3">
                    {vehicle.internalName
                      ? `${vehicle.internalName} (${vehicle.brandModel?.brand?.name} ${vehicle.brandModel?.name})`
                      : `${vehicle.brandModel?.brand?.name} ${vehicle.brandModel?.name}`}
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
                    {"Color: " + vehicle.paintColor}
                  </Col>
                  <Col xs={12} sm={4} md={3} lg={2} className="mt-3">
                    {"Year: " + vehicle.manufactureYear}
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
                    {"Fuel type: " + vehicle.fuelType?.name}
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
                    {"Starting Mileage: " + vehicle.mileageStart}
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
                    {"Created at: " + new Date(vehicle.createdAt).toLocaleDateString("en-US")}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Link to={`/vehicle/${vehicle.vehicleId}/history`}>
                <Button variant="danger">New refuel?</Button>
              </Link>
            </Row>
            {vehicle.refuelHistory?.length ? (
              <Row className="refuel-array-container">
                <Col className="refuel-array">
                  {vehicle.refuelHistory.map((refuel, index) => (
                    <Row className="refuel-array-elem" key={"refuel-elem-" + refuel.refuelHistoryId}>
                      <Col xs={12} sm={9} md={9} lg={10} className="d-flex flex-column justify-content-between">
                        <Row className="p-3">{"Date: " + new Date(refuel.date).toLocaleDateString("en-US")}</Row>
                        <Row>
                          <Col>{"Qty: " + refuel.quantity} units</Col>
                          <Col>{`Total: ${refuel.totalCost}$ (${(refuel.totalCost / refuel.quantity).toFixed(2)}$ pu.)`}</Col>
                          <Col>
                            {"Full? "}
                            {refuel.isFull ? <CheckLg /> : <XLg />}
                          </Col>
                          <Col>{"Recorded mileage: " + refuel.mileageCurrent} km</Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={3} md={3} lg={2} className="d-flex justify-content-center align-items-center">
                        {index === 0 ? (
                          <Button variant="outline-danger" onClick={() => this.getDeleteHandler(refuel.refuelHistoryId)}>
                            <FaTrashAlt />
                          </Button>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  ))}
                </Col>
                <Col className="refuel-statistics">Refuel Statistics TODO</Col>
              </Row>
            ) : (
              <Row>No records of previous refueling</Row>
            )}
          </Container>
        ) : (
          ""
        )}
      </>
    );
  }
}
