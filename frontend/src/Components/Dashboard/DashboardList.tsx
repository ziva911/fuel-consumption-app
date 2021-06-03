import { Link } from "react-router-dom";

export default function DashboardList(): JSX.Element {
  return (
    <>
      <ul>
        <li>
          <Link className="btn btn-link" to="/dashboard/vehicle">
            Vehicles
          </Link>
        </li>
        <li>
          <Link className="btn btn-link" to="/dashboard/brand">
            Brands
          </Link>
        </li>
        <li>
          <Link className="btn btn-link" to="/dashboard/fuel-type">
            Fuel types
          </Link>
        </li>
      </ul>
    </>
  );
}
