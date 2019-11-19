import React, { Component } from "react";
import { Tabs, notification, Input, Button, Icon } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { connect } from "react-redux";
import Loader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";
import { tblOffers } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const TextArea = Input.TextArea;
const OtherError = "Something went to wrong please try again after some time.";

class Offers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      campaignList: [],
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      limit: 50
    };
    this.validator = new SimpleReactValidator({});
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
  }

  componentDidMount = () => {
    this.getAllCampaign();
  };

  async getAllCampaign() {
    this.loader.show();
    try {
      let offers = await (
        await ApiUtils.offers(this.props.token).getCampaignList()
      ).json();
      if (offers.status == 200) {
        this.loader.hide();
        this.setState({
          campaignList: offers.data.campaigns,
          errMsg: true,
          errMessage: offers.message,
          errType: "success"
        });
      } else if (offers.status == 401 || offers.status == 403) {
        this.setState({
          errMsg: true,
          errMessage: offers.message,
          errType: "error"
        });
        this.props.logout();
      } else {
        this.setState({
          errMsg: true,
          errMessage: offers.message,
          errType: "error"
        });
      }
    } catch (error) {
      this.loader.hide();
      this.setState({ errMsg: true, errMessage: OtherError, errType: "error" });
    }
  }

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    let { loader, campaignList } = this.state;
    return (
      <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            {tblOffers.map(tableInfo => (
              <TabPane tab={tableInfo.title} key={tableInfo.value}>
                <div style={{ display: "inline-block", width: "100%" }}>
                  <Button
                    type="primary"
                    style={{ marginBottom: "15px", float: "left" }}
                    onClick={() =>
                      this.props.history.push(
                        "/dashboard/campaign/add-campaign"
                      )
                    }
                  >
                    {" "}
                    Add Campaign
                  </Button>
                </div>
                {loader && <Loader />}
                <div>
                  <TableWrapper
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={campaignList}
                    className="isoCustomizedTable"
                    onChange={this.handleTableChange}
                  />
                </div>
              </TabPane>
            ))}
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
