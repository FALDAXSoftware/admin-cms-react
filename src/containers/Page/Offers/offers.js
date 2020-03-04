import React, { Component } from "react";
import { Tabs, notification, Button, Pagination,DatePicker, Icon, Col, Row, Input, Select } from "antd";
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
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { isAllowed } from "../../../helpers/accessControl";
// import { BackButton } from "../../Shared/backBttton";
import moment from "moment";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import Metabase from "./metabase"
import { PageCounterComponent } from "../../Shared/pageCounter";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportOffers } from "../../../helpers/exportToCsv/headers";

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const {RangePicker}=DatePicker;
const {Option}=Select;
const OtherError = "Unable to complete the requested action.";
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
      metabaseUrl: "",
      searchData:"",
      rangeDate:"",
      usage_type:undefined,
      sorterCol:"",
      sortOrder:"",
      openCsvModal:false,
      csvData:[]
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
          errMessage: res.err,
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
      self.setState({ errMsg: true, errMessage: OtherError, errType: "error" });
    }
  }

  async getAllCampaign(isExportCsv=false) {
    let { page, limit , searchData,rangeDate,usage_type,sortOrder,sorterCol} = this.state;
    let start_date=rangeDate?moment(rangeDate[0]).toISOString():"",end_date=rangeDate?moment(rangeDate[1]).toISOString():"";
    this.loader.show();
    try {
      let offers = await (
        await (isExportCsv?ApiUtils.offers(this.props.token).getCampaignList(1,EXPORT_LIMIT_SIZE,"","","","","",""):ApiUtils.offers(this.props.token).getCampaignList(page,limit,searchData,start_date,end_date,usage_type,sortOrder,sorterCol))
      ).json();
      if (offers.status == 200) {
        if(isExportCsv)
        this.setState({csvData:offers.data.campaigns})
        else
        this.setState({
          campaignList: offers.data.campaigns,
          campaignCount: offers.data.total
        });
      } else if (offers.status == 401 || offers.status == 403) {
        this.setState({
          errMsg: true,
          errMessage: offers.err,
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
  };

  handleUserPagination = page => {
    this.setState({ page }, () => {
      this.getAllCampaign();
    });
  };


  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this.getAllCampaign();
      }
    );
  };

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
      searchData,
      rangeDate,
      usage_type,
      csvData,
      openCsvModal
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <ExportToCSVComponent
              isOpenCSVModal={openCsvModal}
              onClose={() => {
                this.setState({ openCsvModal: false });
              }}
              filename="offers.csv"
              data={csvData}
              header={exportOffers}
            />
        <BreadcrumbComponent {...this.props} />
        <Tabs
          className="isoTableDisplayTab full-width"
          onChange={this.onChangeTabs}
        >
          {tblOffers.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              {isAllowed("create_campaigns") && (
                <Row type="flex" justify="start">
                  <Col md={3.5} className="wallet-div">
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
                  </Col>
                </Row>
              )}
              <TableDemoStyle className="isoLayoutContent">
                <PageCounterComponent
                  page={page}
                  limit={limit}
                  dataCount={campaignCount}
                  syncCallBack={() => {
                    this.setState(
                      { rangeDate: "", searchData: "", usage_type: "" },
                      () => this.getAllCampaign()
                    );
                  }}
                />
                <Row justify="start" type="flex" className="table-filter-row">
                  <Col xs={12} md={6}>
                    <Input
                      placeholder="Search"
                      value={searchData}
                      onChange={value =>
                        this.setState({ searchData: value.target.value })
                      }
                    />
                  </Col>
                  <Col xs={12} md={5}>
                    <RangePicker
                      className="full-width"
                      format="YYYY-MM-DD"
                      value={rangeDate}
                      onChange={date => this.setState({ rangeDate: date })}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <Select
                      className="full-width"
                      placeholder="Select Type"
                      value={usage_type}
                      onChange={value => this.setState({ usage_type: value })}
                    >
                      <Option value="">All</Option>
                      <Option value="1">Single Code Use</Option>
                      <Option value="2">Multiple Code Use</Option>
                    </Select>
                  </Col>
                  <Col xs={12} md={3}>
                    <Button
                      type="primary"
                      icon="search"
                      className="filter-btn btn-full-width"
                      onClick={() => this.getAllCampaign()}
                    >
                      Search
                    </Button>
                  </Col>
                  <Col xs={12} md={3}>
                    <Button
                      type="primary"
                      icon="reload"
                      className="filter-btn btn-full-width"
                      onClick={() => {
                        this.setState(
                          { rangeDate: "", searchData: "", usage_type: "" },
                          () => this.getAllCampaign()
                        );
                      }}
                    >
                      Reset
                    </Button>
                  </Col>
                  <Col xs={12} md={3}>
                    <Button
                      type="primary"
                      icon="export"
                      className="filter-btn full-width"
                      onClick={() => {
                        this.setState({ openCsvModal: true }, () =>
                          this.getAllCampaign(true)
                        );
                      }}
                    >
                      Export
                    </Button>
                  </Col>
                </Row>
                {loader && <Loader />}
                <TableWrapper
                  rowKey="id"
                  {...this.state}
                  columns={tableInfo.columns}
                  pagination={false}
                  dataSource={campaignList}
                  className="isoCustomizedTable table-tb-margin float-clear"
                  onChange={this.handleTableChange}
                  bordered
                  scroll={TABLE_SCROLL_HEIGHT}
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
            <TabPane tab="Report" key="metabase">
                <Metabase/>
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
