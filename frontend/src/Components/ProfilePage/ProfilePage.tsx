import BasePage from "../BasePage/BasePage";
import { BasePageProperties } from "../BasePage/BasePage";

class ProfilePageProperties extends BasePageProperties {}
export default class ProfilePage extends BasePage<ProfilePageProperties> {
  renderMain(): JSX.Element {
    return (
      <div className="pageHolder">
        <h1>My account</h1>
        <p>
          We are located at: <br />
        </p>
        <p>Phone: </p>
      </div>
    );
  }
}
