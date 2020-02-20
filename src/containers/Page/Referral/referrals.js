import React, { Component } from 'react';
import { Tabs, Pagination, Input, notification, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import { withRouter } from "react-router-dom";
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import userAction from '../../../redux/users/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { PageCounterComponent } from '../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { exportReferrals } from '../../../helpers/exportToCsv/headers';
var self;
const { showUserDetails } = userAction;
const { logout } = authAction;
const Search = Input.Search;

class Referrals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: [],
            allReferralCount: 0,
            page: 1,
            limit: PAGESIZE,
            searchReferral: '',
            fields: {},
            prevDefaultReferral: '',
            errType: 'Success',
            openCsvModal:false,
            csvData:[]
        }
        self = this;
    }

    static edit = (id,first_name,last_name,email) => {
        let full_name=first_name +" "+last_name;
        self.props.showUserDetails({full_name,email})
        self.props.history.push("/dashboard/referral/" + id);
    };


    componentDidMount = () => {
        this._getAllReferredAdmins();
    }

    _getAllReferredAdmins = (isExportToCsv=false) => {
        const { token } = this.props;
        const { limit, page, searchReferral, sorterCol, sortOrder } = this.state;
        let _this = this;

        this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getAllReferrals(1, EXPORT_LIMIT_SIZE, token, "", "", ""):ApiUtils.getAllReferrals(page, limit, token, searchReferral, sorterCol, sortOrder))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    if (isExportToCsv) _this.setState({ csvData: res.data });
                    else
                      _this.setState({
                        allReferral: res.data,
                        allReferralCount: res.referralCount,
                        showReferralModal: true
                      });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                });
            });
    }

    _handleReferralPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllReferredAdmins();
        });
    }

    _searchReferral = (val) => {
        this.setState({ searchReferral: val, page: 1 }, () => {
            this._getAllReferredAdmins();
        });
    }

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
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllReferredAdmins();
            // this._getContactDetails();
        })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _cancelDefaultReferral = () => {
        let fields = this.state.fields;
        fields['percentage'] = this.state.prevDefaultReferral;
        this.setState({ fields });
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllReferredAdmins();
        });
    }

    render() {
        const { allReferral, allReferralCount, loader, fields, errMsg, errType, page, limit,openCsvModal,csvData} = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }
        let pageSizeOptions = PAGE_SIZE_OPTIONS

        return (
          <div>
            <ExportToCSVComponent
              isOpenCSVModal={openCsvModal}
              onClose={() => {
                this.setState({ openCsvModal: false });
              }}
              filename="referrals"
              data={csvData}
              header={exportReferrals}
            />
            <PageCounterComponent
              page={page}
              limit={limit}
              dataCount={allReferralCount}
              syncCallBack={() => {
                this.setState({ searchReferral: "", page: 1 }, () =>
                  this._getAllReferredAdmins()
                );
              }}
            />
            <Row type="flex" justify="start" className="table-filter-row">
              <Col md={8}>
                <Search
                  placeholder="Search users"
                  onSearch={value => this._searchReferral(value)}
                  className="full-width"
                  enterButton
                />
              </Col>
              <Col md={3}>
                <Button
                  type="primary"
                  icon="export"
                  onClick={() => {
                    this.setState({ openCsvModal: true }, () =>
                      this._getAllReferredAdmins(true)
                    );
                  }}
                >
                  Export
                </Button>
              </Col>
            </Row>
            <TableWrapper
              rowKey="email"
              {...this.state}
              columns={referralInfos[0].columns}
              pagination={false}
              dataSource={allReferral}
              className="table-tb-margin"
              onChange={this._handleReferralChange}
              scroll={TABLE_SCROLL_HEIGHT}
              bordered
            />
            {loader && <FaldaxLoader />}
            {allReferralCount > 0 ? (
              <Pagination
                className="ant-users-pagination"
                onChange={this._handleReferralPagination.bind(this)}
                pageSize={limit}
                current={page}
                total={parseInt(allReferralCount)}
                showSizeChanger
                onShowSizeChange={this._changePaginationSize}
                pageSizeOptions={pageSizeOptions}
              />
            ) : (
              ""
            )}
          </div>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { logout,showUserDetails })(Referrals));
