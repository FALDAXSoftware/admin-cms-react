import React, { Component } from "react";
import { Tabs, notification, Input, Button, Icon } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const TextArea = Input.TextArea;

class Offers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new SimpleReactValidator({});
  }

  componentDidMount = () => {};

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    return (
      <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            <TabPane tab="Campaigns" key="1">
              <Button
                type="primary"
                onClick={() =>
                  this.props.history.push("/dashboard/campaign/add-campaign")
                }
                style={{ marginBottom: "15px", float: "left" }}
              >
                Add Campaign
              </Button>
            </TabPane>
          </Tabs>
        </TableDemoStyle>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(Offers);

export { Offers };
