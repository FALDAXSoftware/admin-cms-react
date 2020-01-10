import React, { Component } from "react";
import authAction from "../../../redux/auth/actions";
import { connect } from "react-redux";
import Loader from "../faldaxLoader";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableWrapper from "../../Tables/antTables/antTable.style";
import {
  Pagination,
  Icon,
  Row,
  Form,
  Input,
  Select,
  Button,
  Divider,
  notification
} from "antd";
import { PAGESIZE, PAGE_SIZE_OPTIONS } from "../../../helpers/globals";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import ApiUtils from "../../../helpers/apiUtills";
import {  DateTimeCell } from "../../../components/tables/helperCells";
import {ColWithMarginBottom} from "../common.style";
import { BackButton } from "../../Shared/backBttton";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
const OtherError = "Something went to wrong please try again after some time.";
let self;
let { Option } = Select;

const column = [
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: date => DateTimeCell(date)
  },
  {
    title: "Name",
    key: "full_name",
    render: object => <p>{object["full_name"]}</p>
  },
  {
    title: "Email",
    key: "email",
    dataIndex: "email"
  },
  {
    title: "Order Id",
    key: "order_id",
    render: object => (
      <span>{object.is_attempted ? "-" : <a onClick={()=>self.props.history.push({pathname:"/dashboard/trade-history",state:{"orderId":object['order_id']+""}})}>{object['order_id']}</a>}</span>
    )
  },
  {
    title: "Waived Fees",
    key: "waived_fees",
    render: (data) => (
      <span>
        {parseFloat(data["waived_fees"]).toFixed(2) +` USD (${(parseFloat(data["faldax_fees"].split(" ")[0])?parseFloat(data["faldax_fees"].split(" ")[0]).toFixed(8):0)+" "+data["faldax_fees"].split(" ")[1]})`}
      </span>
    )
  },
  {
    title: "Type",
    key: "offer_type",
    dataIndex: "offer_type",
    render: data => (
      <span className={data == "Applied" ? "color-green" : "color-blue"}>
        {data}
      </span>
    )
  }
];
class OffersUsage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: column,
      dataSet: [],
      dataSetCount: 0,
      page: 1,
      limit: PAGESIZE,
      searchData: "",
      searchFilter: "",
      campaignLabel: "",
      errMsg: false,
      errType: "Success",
      offerName:""
    };
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
    self=this;
  }

  componentDidMount() {
    this.setState({
      campaignLabel: JSON.parse(this.props.location.state).detail,
      offerName:JSON.parse(this.props.location.state).name
    });
    this.getOfferCodeHistory();
  }

  resetFilters = () => {
    this.setState(
      {
        searchData: "",
        searchFilter: "",
        page: 1
      },
      () => {
        this.getOfferCodeHistory();
      }
    );
  };

  async getOfferCodeHistory() {
    try {
      this.loader.show();
      let [{ page, limit, searchData, searchFilter }, offerId] = [
        this.state,
        this.props.match.params.id,
      ];
      let response = await (
        await ApiUtils.offers(this.props.token).getOfferCodeHistory(
          offerId,
          page,
          limit,
          searchData,
          searchFilter
        )
      ).json();
      if (response.status == 200) {
        this.setState({
          dataSet: response.data.used_data,
          dataSetCount: response.data.total
        });
      } else if (response.status == 401 || response.status == 403) {
        this.setState(
          { errMsg: true, errMessage: response.err, errType: "error" },
          () => {
            this.props.logout();
          }
        );
      } else {
        this.setState({ errMsg: true, errMessage: response.message ,errType: "error"});
      }
    } catch (error) {
        this.setState({ errMsg: true, errMessage: OtherError, errType: "error" });
    } finally {
      this.loader.hide();
    }
  }

  handleUserPagination = page => {
    this.setState({ page }, () => {});
  };

  changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this.getAllCampaign();
    });
  };

  changeSearch = (field, e) => {
    this.setState({ searchData: field.target.value });
  };

  changeFilter = val => {
    this.setState({ searchFilter: val });
  };

  searchOffer = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this.getOfferCodeHistory();
    });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    const [
      {
        column,
        dataSet,
        loader,
        dataSetCount,
        limit,
        errType,
        errMsg,
        page,
        searchData,
        searchFilter,
        campaignLabel,
        offerName
      },
      pageSizeOptions
    ] = [this.state, PAGE_SIZE_OPTIONS];

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
         <BreadcrumbComponent {...this.props}/>
        <TableDemoStyle className="isoLayoutContent">
          <div className="mg-tb-16">
          <h2>{campaignLabel}</h2>
          <p>{offerName}</p>
          </div>
          <Form onSubmit={this.searchOffer}>
            <Row type="flex" justify="start">
              <ColWithMarginBottom sm={6}>
                <Input
                  placeholder="Search Users"
                  onChange={this.changeSearch.bind(this)}
                  value={searchData}
                />
              </ColWithMarginBottom>
              <ColWithMarginBottom sm={5}>
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                  placeholder="Select type"
                  onChange={this.changeFilter}
                  value={searchFilter}
                >
                  <Option value={""}>All</Option>
                  <Option value={"attempted"}>Attempted</Option>
                  <Option value={"applied"}>Applied</Option>
                </Select>
              </ColWithMarginBottom>
              <ColWithMarginBottom xs={12} sm={4}>
                <Button
                  htmlType="submit"
                  className="filter-btn btn-full-width"
                  type="primary"
                >
                  <Icon type="search" />
                  Search
                </Button>
              </ColWithMarginBottom>
              <ColWithMarginBottom xs={12} sm={4}>
                <Button
                  className="filter-btn full-width"
                  type="primary"
                  onClick={this.resetFilters}
                >
                  <Icon type="reload"></Icon>
                  Reset
                </Button>
              </ColWithMarginBottom>
            </Row>
          </Form>
          <TableWrapper
            {...this.state}
            columns={column}
            pagination={false}
            dataSource={dataSet}
            bordered={true}
            className="isoCustomizedTable"
          />
          {dataSetCount > 0 ? (
            <Pagination
              style={{ marginTop: "15px" }}
              className="ant-users-pagination"
              onChange={this.handleUserPagination}
              pageSize={limit}
              current={page}
              total={dataSetCount}
              showSizeChanger
              onShowSizeChange={this.changePaginationSize}
              pageSizeOptions={pageSizeOptions}
            />
          ) : (
            ""
          )}
          {loader && <Loader />}
        </TableDemoStyle>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { ...authAction }
)(OffersUsage);
