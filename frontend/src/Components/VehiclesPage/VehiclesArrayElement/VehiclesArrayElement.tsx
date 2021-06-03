import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import VehicleModel from "../../../../../../backend/api/src/components/vehicle/vehicle.model";
import * as path from "path";
import { ApiConfiguration } from "../../../Config/api.config";
import { ReactComponent as DefaultPhoto } from "../../../Shared/default_photo.svg";
interface VehiclesArrayElementProperties {
  vehicle: VehicleModel;
}
export function getThumbPath(url: string): string {
  const directory = path.dirname(url);
  const extension = path.extname(url);
  const filename = path.basename(url, extension);
  return directory + "/" + filename + "-thumb" + extension;
}
export default function VehiclesArrayElement(props: VehiclesArrayElementProperties) {
  return (
    <Col>
      <Card>
        {props.vehicle ? (
          <Link to={"/vehicle/" + props.vehicle.vehicleId}>
            {props.vehicle.imagePath ? (
              <Card.Img variant="top" src={getThumbPath(ApiConfiguration.UPLOAD_PATH + "/" + props.vehicle?.imagePath)} />
            ) : (
              <DefaultPhoto className="default-photo" fill={"" + props.vehicle.paintColor} viewBox="0 0 1000 800" />
            )}
          </Link>
        ) : (
          ""
        )}
        {props.vehicle.internalName
          ? `${props.vehicle.internalName} (${props.vehicle.brandModel?.brand?.name} ${props.vehicle.brandModel?.name})`
          : `${props.vehicle.brandModel?.brand?.name} ${props.vehicle.brandModel?.name}`}
      </Card>
    </Col>
  );
}
