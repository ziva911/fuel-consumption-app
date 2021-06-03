import BasePage from "../BasePage/BasePage";
import { BasePageProperties } from "../BasePage/BasePage";

class ContactPageProperties extends BasePageProperties {
  title?: string = "";
  phone: string = "";
  address: string = "";
}
export default class ContactPage extends BasePage<ContactPageProperties> {
  renderMain(): JSX.Element {
    return (
      <div className="pageHolder">
        <h1>{this.props.title ?? "Contact us"}</h1>
        <p>
          We are located at: <br /> {this.props.address}
        </p>
        <p>Phone: {this.props.phone}</p>
      </div>
    );
  }
}
