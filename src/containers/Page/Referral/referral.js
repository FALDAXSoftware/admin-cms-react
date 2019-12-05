import React, { Component } from "react";
import { Tabs, Pagination, Input, Button, notification, Row } from "antd";
import { connect } from "react-redux";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import ColWithMarginBottom from "../common.style";
const TabPane = Tabs.TabPane;
const { logout } = authAction;
const Search = Input.Search;
var self;
class Referral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allReferral: [],
      allReferralCount: 0,
      page: 1,
      limit: PAGESIZE,
      searchReferral: "",
      fields: {},
      prevDefaultReferral: "",
      errType: "Success"
    };
    this.validator = new SimpleReactValidator({
      className: "text-danger",
      custom_between: {
        message: "The :attribute must be between 1 to 100 %.",
        rule: function(val, params, validator) {
          if (isNaN(val)) {
            return false;
          } else if (
            parseFloat(val) >= parseFloat(params[0]) &&
            parseFloat(val) <= parseFloat(params[1])
          ) {
            return true;
          } else {
            return false;
          }
        },
        required: true
      },
      gtzero: {
        // name the rule
        message: "Amount must be greater than 0.",
        rule: (val, params, validator) => {
          if (val > 0) {
            return true;
          } else {
            return false;
          }
        },
        required: true // optional
      }
    });
    self = this;
  }

  static edit = id => {
    self.props.history.push("/dashboard/referral/" + id);
  };

  componentDidMount = () => {
    this._getAllReferredAdmins();
    this._getReferalPercentage();
    this._getContactDetails();
  };

  _getReferalPercentage = () => {
    let _this = this;
    const { token } = this.props;

    //_this.setState({ loader: true });
    ApiUtils.getReferPercentage(token)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          let fields = _this.state.fields;
          console.log(res.data.value);
          fields["percentage"] = res.data.value;
          console.log(fields["percentage"]);
          _this.setState({ fields, prevDefaultReferral: res.data.value });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
        }
        // _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error"
        });
      });
  };

  _getContactDetails = () => {
    let _this = this;

    //_this.setState({ loader: true });
    ApiUtils.getContactDetails()
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          let fields = _this.state.fields;
          // fields['percentage'] = res.data.default_referral_percentage;
          _this.setState({
            fields,
            prevDefaultReferral: res.data.default_referral_percentage
          });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
        }
        // _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error"
        });
      });
  };

  _getAllReferredAdmins = () => {
    const { token } = this.props;
    const { limit, page, searchReferral, sorterCol, sortOrder } = this.state;
    let _this = this;

    this.setState({ loader: true });
    ApiUtils.getAllReferrals(
      page,
      limit,
      token,
      searchReferral,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            allReferral: res.data,
            allReferralCount: res.referralCount,
            showReferralModal: true
          });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _handleReferralPagination = page => {
    this.setState({ page }, () => {
      this._getAllReferredAdmins();
    });
  };

  _searchReferral = val => {
    this.setState({ searchReferral: val, page: 1 }, () => {
      this._getAllReferredAdmins();
    });
  };

  _changeRow = referral => {
    this.props.history.push("/dashboard/referral/" + referral.id);
  };

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  }

  _handleReferralChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllReferredAdmins();
        this._getContactDetails();
      }
    );
  };

  _updateDefaultReferral = () => {
    const { token } = this.props;
    let fields = this.state.fields;
    let _this = this;

    if (_this.validator.allValid()) {
      _this.setState({ loader: true });

      const formData = {
        percentage: fields["percentage"]
      };

      ApiUtils.updateReferral(token, formData)
        .then(response => response.json())
        .then(function(res) {
          if (res.status == 200) {
            _this.setState(
              {
                errMsg: true,
                errMessage: res.message,
                loader: false,
                errType: "Success"
              },
              () => {
                _this._getContactDetails();
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "error"
            });
          }
        })
        .catch(() => {
          _this.setState({ loader: false });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _cancelDefaultReferral = () => {
    let fields = this.state.fields;
    fields["percentage"] = this.state.prevDefaultReferral;
    this.setState({ fields });
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllReferredAdmins();
    });
  };

  render() {
    const {
      allReferral,
      allReferralCount,
      loader,
      fields,
      errMsg,
      errType,
      page,
      limit
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          {referralInfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                <Row justify="end">
                  <ColWithMarginBottom span={24}>
                    <Search
                      placeholder="Search users"
                      onSearch={value => this._searchReferral(value)}
                      style={{ float: "right", width: "250px" }}
                      enterButton
                    />
                  </ColWithMarginBottom>
                </Row>
                <div className="float-clear">
                <TableWrapper
                  // onRow={(record, rowIndex) => {
                  //     return {
                  //         onClick: () => { this._changeRow(record) },
                  //     };
                  // }}
                  {...this.state}
                  columns={tableInfo.columns}
                  pagination={false}
                  dataSource={allReferral}
                  className="isoCustomizedTable"
                  onChange={this._handleReferralChange}
                />
                </div>
                {loader && <FaldaxLoader />}
                {allReferralCount > 0 ? (
                  <Pagination
                    style={{ marginTop: "15px" }}
                    className="ant-users-pagination"
                    onChange={this._handleReferralPagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={allReferralCount}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                  ""
                )}
              </TableDemoStyle>
            </TabPane>
          ))}
          <TabPane tab="Referral Percentage" key="2">
            <TableDemoStyle className="isoLayoutContent">
            <div class="referral-container">
              <span>
                <b>Default Referral Percentage</b>
              </span>
              <div className="mg-tb-16"></div>
              <Input
                addonAfter={"%"}
                placeholder="Referral Percentage"
                onChange={this._onChangeFields.bind(this, "percentage")}
                value={fields["percentage"]}
              />
              <span className="field-error">
                {this.validator.message(
                    "percentage",
                    fields["percentage"],
                    "required|numeric|lte:100"
                    )}
              </span>
            <div className="mg-tb-16"></div>
              <Button
                type="primary"
                style={{ marginBottom: "15px" }}
                onClick={this._updateDefaultReferral}
              >
                {" "}
                Update{" "}
              </Button>
              <Button
                type="primary"
                className="cancel-btn"
                onClick={this._cancelDefaultReferral}
              >
                {" "}
                Cancel{" "}
              </Button>
              </div>
            </TableDemoStyle>
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token"),
    user: state.Auth.get("user")
  }),
  { logout }
)(Referral);
