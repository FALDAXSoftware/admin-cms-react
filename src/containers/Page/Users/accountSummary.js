import React, { Component } from "react";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { summaryTableInfos } from "../../Tables/antTables/accountSummaryConfig";
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import {
  Tabs,
  Input,
  Pagination,
  DatePicker,
  Button,
  Form,
  notification
} from "antd";
import FaldaxLoader from "../faldaxLoader";
import moment from "moment";
import authAction from "../../../redux/auth/actions";

const { logout } = authAction;

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class AccountSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allHistory: [],
      loader: false,
      totalCount: 0,
      page: 1,
      limit: 50,
      startDate: "",
      endDate: "",
      rangeDate: [],
      searchHistory: "",
      errMessage: "",
      errMsg: false,
      errType: "Success",
      deleteDate: ""
    };
  }

  componentDidMount = () => {
    this._getAllLoginHistory();
  };

  _getAllLoginHistory = () => {
    const { token, user_id } = this.props;
    const { page, limit, searchHistory, startDate, endDate } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getUserAccountSummary(token, user_id)
      .then(response => response.json())
      .then(function (res) {
        console.log(res);
        if (res.status == 201) {
          console.log(res);
          //   res.data = res.data.map(element => {
          //     element["usd_price"] = res.usd_price;
          //     return element;
          //   });
          //   console.log("element", res.data);

          for (var i = 0; i < res.data.length; i++) {
            res.data[i].fiat = parseFloat(res.data[i].totalAmount * res.data[i].fiat).toFixed(3) + ' USD'
          }
          _this.setState({
            allHistory: res.data,
            loader: false,
            totalCount: parseFloat(res.usd_price).toFixed(2),
            // deleteDate: new Date(res.user.deleted_at).toLocaleDateString()
            deleteDate: moment.utc(res.user.deleted_at).local().format("DD MMM, YYYY HH:mm")
          });
        } else if (res.status == 200) {
          _this.setState({
            loader: false,
            deleteDate: null
          });
        } else if (res.status == 403) {
          _this.setState(
            {
              errMsg: true,
              errMessage: res.err,
              errType: "error",
              loader: false
            },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
        }
      })
      .catch(err => {
        _this.setState({ loader: false });
      });
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  isabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  };

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };

  _resetFilters = () => {
    this.setState(
      {
        searchHistory: "",
        startDate: "",
        endDate: "",
        rangeDate: [],
        page: 1
      },
      () => {
        this._getAllLoginHistory();
      }
    );
  };

  _searchHistory = e => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllLoginHistory();
    });
  };

  _handleHistoryPagination = page => {
    this.setState({ page }, () => {
      this._getAllLoginHistory();
    });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchHistory: field.target.value });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllLoginHistory();
    });
  };

  render() {
    const {
      allHistory,
      loader,
      totalCount,
      page,
      rangeDate,
      searchHistory,
      errMsg,
      errType,
      limit,
      deleteDate
    } = this.state;
    let pageSizeOptions = ["20", "30", "40", "50"];

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent">
          {/* <Tabs className="isoTableDisplayTab"> */}
          {summaryTableInfos.map(tableInfo => (
            // <TabPane tab={tableInfo.title} key={tableInfo.value}>
            // {deleteDate != null ? ():()}
            <div>
              {deleteDate != null ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <b
                      style={{
                        marginRight: "10px"
                      }}
                    >
                      Date :
                    </b>
                    <span>{deleteDate}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    <b
                      style={{
                        marginRight: "10px"
                      }}
                    >
                      Total :
                    </b>
                    <span>{totalCount} USD</span>
                  </div>
                </div>
              ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* <div>
                    <b
                      style={{
                        marginRight: "10px"
                      }}
                    >
                      Date :
                    </b>
                    <span>{deleteDate}</span>
                  </div> */}
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end"
                      }}
                    >
                      <b
                        style={{
                          marginRight: "10px"
                        }}
                      >
                        Total :
                    </b>
                      <span>{totalCount} USD</span>
                    </div>
                  </div>
                )}
              <TableWrapper
                style={{ marginTop: "20px" }}
                {...this.state}
                columns={tableInfo.columns}
                pagination={false}
                dataSource={allHistory}
                className="isoCustomizedTable"
              />

              {loader && <FaldaxLoader />}
              {/* {allHistoryCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleHistoryPagination.bind(this)}
                                            pageSize={limit}
                                            current={page}
                                            total={allHistoryCount}
                                            showSizeChanger
                                            onShowSizeChange={this._changePaginationSize}
                                            pageSizeOptions={pageSizeOptions}
                                        /> : ''} */}
            </div>
            // </TabPane>
          ))}
          {/* </Tabs> */}
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
)(AccountSummary);
