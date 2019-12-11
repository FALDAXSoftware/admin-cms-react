import React, { Component } from "react";
import { Tabs, notification, Button, Pagination, Icon, Col } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { connect } from "react-redux";
import Loader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";
import { tblOffers } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import ConfirmDeleteModalComponent from "../../Modal/confirmDelete";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import { isAllowed } from "../../../helpers/accessControl";

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const OtherError = "Something went to wrong please try again after some time.";
var self;

class Offers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      campaignList: [],
      campaignCount: 0,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      limit: PAGESIZE,
      showDeleteModal: false,
      campaignId: 0,
      metabaseUrl: ""
    };
    self = this;
    this.validator = new SimpleReactValidator({});
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
  }

  componentDidMount = () => {
    this.getAllCampaign();
  };

  static edit(campaign_id) {
    self.props.history.push(`campaign/update-campaign/${campaign_id}`);
  }

  static view(campaign_id) {
    self.props.history.push(`/dashboard/campaign/${campaign_id}`);
  }

  static delete(campaign_id) {
    self.setState({ showDeleteModal: true, campaignId: campaign_id });
  }

  static async changeState(campaign_id, campaign_is_active) {
    try {
      self.loader.show();
      let res = await (
        await ApiUtils.offers(self.props.token).changeStatus(
          campaign_id,
          !campaign_is_active
        )
      ).json();
      if (res.status == 200) {
        self.loader.hide();
        let { campaignList } = self.state;
        let index = campaignList.findIndex(ele => ele.id == campaign_id);
        if (index != -1) {
          campaignList[index] = res.data;
          self.setState(campaignList);
        } else {
          self.getAllCampaign();
        }
        self.loader.hide();
      } else if (res.status == 401 || res.status == 403) {
        self.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "error"
        });
        self.loader.hide();
        self.props.logout();
      } else {
        self.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "error"
        });
        self.loader.hide();
      }
    } catch (error) {
      self.loader.hide();
      console.log(error);
      self.setState({ errMsg: true, errMessage: OtherError, errType: "error" });
    }
  }

  async getAllCampaign() {
    let { page, limit } = this.state;
    this.loader.show();
    try {
      let offers = await (
        await ApiUtils.offers(this.props.token).getCampaignList(page, limit)
      ).json();
      if (offers.status == 200) {
        this.setState({
          campaignList: offers.data.campaigns,
          campaignCount: offers.data.total
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
      this.setState({ errMsg: true, errMessage: OtherError, errType: "error" });
    } finally {
      this.loader.hide();
    }
  }

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this.getAllCampaign();
    });
  };

  onDeleteConfirm = id => {
    this.setState({ showDeleteModal: false });
    console.log(id);
  };

  handleUserPagination = page => {
    this.setState({ page }, () => {
      this.getAllCampaign();
    });
  };

  async getMetaBaseUrl() {
    try {
      this.setState({ loader: true })
      let response = await (await ApiUtils.metabase(this.props.token).getOffersRequest()).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL })
      } else if (response.statue == 400 || response.status == 403) {

      }
    } catch (error) {

    } finally {
      this.setState({ loader: false })
    }
  }

  onChangeTabs = (key) => {
    if (key == "metabase" && this.state.metabaseUrl == "") {
      console.log("Metabase is calling")
      this.getMetaBaseUrl();
    }
  }

  render() {
    let {
      loader,
      campaignList,
      errMsg,
      errType,
      campaignCount,
      page,
      limit,
      campaignId,
      showDeleteModal,
      metabaseUrl
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }
    console.log("render", showDeleteModal);

    return (
      <LayoutWrapper>
        <Tabs
          className="isoTableDisplayTab full-width"
          onChange={this.onChangeTabs}
        >
          {tblOffers.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                {isAllowed("create_campaigns") && (
                  <Button
                    type="primary"
                    onClick={() =>
                      this.props.history.push(
                        "/dashboard/campaign/add-campaign"
                      )
                    }
                  >
                    {" "}
                    <Icon type="plus" />
                    Add Campaign
                  </Button>
                )}
                {loader && <Loader />}
                  <TableWrapper
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={campaignList}
                    className="isoCustomizedTable table-tb-margin float-clear"
                    onChange={this.handleTableChange}
                  />
                  {campaignCount > 0 ? (
                    <Pagination
                      className="ant-users-pagination"
                      onChange={this.handleUserPagination.bind(this)}
                      pageSize={limit}
                      current={page}
                      total={campaignCount}
                      showSizeChanger={true}
                      onShowSizeChange={this.changePaginationSize}
                      pageSizeOptions={pageSizeOptions}
                    />
                  ) : (
                    ""
                  )}
                  {
                    <ConfirmDeleteModalComponent
                      visible={showDeleteModal}
                      callbackFn={this.onDeleteConfirm}
                      callbackData={campaignId}
                    />
                  }
              </TableDemoStyle>
            </TabPane>
          ))}
          {isAllowed("metabase_offers_report") && (
            <TabPane tab="Metabase-Offers Management" key="metabase">
              <TableDemoStyle className="isoLayoutContent">
                {metabaseUrl && (
                    <iframe
                      className="metabase-iframe"
                      src={metabaseUrl}
                      frameborder="0"
                      width="100%"
                      allowtransparency
                    ></iframe>
                )}
              </TableDemoStyle>
            </TabPane>
          )}
        </Tabs>
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
