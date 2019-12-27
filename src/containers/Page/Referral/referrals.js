import React, { Component } from 'react';
import { Tabs, Pagination, Input, notification, Row, Col } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import { withRouter } from "react-router-dom";
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
var self;
const TabPane = Tabs.TabPane;
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
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator({
            className: 'text-danger',
            custom_between: {
                message: 'The :attribute must be between 1 to 100 %.',
                rule: function (val, params, validator) {
                    if (isNaN(val)) {
                        return false;
                    } else if (parseFloat(val) >= parseFloat(params[0]) && parseFloat(val) <= parseFloat(params[1])) {
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
    }

    _getReferalPercentage = () => {
        let _this = this;
        const { token } = this.props

        //_this.setState({ loader: true });
        ApiUtils.getReferPercentage(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let fields = _this.state.fields;
                    fields['percentage'] = res.data.value;
                    _this.setState({ fields, prevDefaultReferral: res.data.value });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                // _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            })
    }

    _getContactDetails = () => {
        let _this = this;

        //_this.setState({ loader: true });
        ApiUtils.getContactDetails()
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let fields = _this.state.fields;
                    // fields['percentage'] = res.data.default_referral_percentage;
                    _this.setState({ fields, prevDefaultReferral: res.data.default_referral_percentage });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                // _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    _getAllReferredAdmins = () => {
        const { token } = this.props;
        const { limit, page, searchReferral, sorterCol, sortOrder } = this.state;
        let _this = this;

        this.setState({ loader: true })
        ApiUtils.getAllReferrals(page, limit, token, searchReferral, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.referralCount, showReferralModal: true
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
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
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

    _updateDefaultReferral = () => {
        const { token } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                percentage: fields['percentage'],
            }

            ApiUtils.updateReferral(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        }, () => {
                            // _this._getContactDetails();
                        })
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
                    }
                })
                .catch(() => {
                    _this.setState({ loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
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
        const { allReferral, allReferralCount, loader, fields, errMsg, errType, page, limit } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }
        let pageSizeOptions = PAGE_SIZE_OPTIONS

        return (
            <div>
                <Row type="flex" justify="start">
                    <Col md={8}>
                        <Search
                            placeholder="Search users"
                            onSearch={(value) => this._searchReferral(value)}
                            className="full-width"
                            enterButton
                        />
                    </Col>
                </Row>
                <TableWrapper
                    rowKey="id"
                    {...this.state}
                    columns={referralInfos[0].columns}
                    pagination={false}
                    dataSource={allReferral}
                    className="isoCustomizedTable table-tb-margin"
                    onChange={this._handleReferralChange}
                    bordered
                    scroll={TABLE_SCROLL_HEIGHT}
                />
                {loader && <FaldaxLoader />}
                {allReferralCount > 0 ?
                    <Pagination
                        className="ant-users-pagination"
                        onChange={this._handleReferralPagination.bind(this)}
                        pageSize={limit}
                        current={page}
                        total={parseInt(allReferralCount)}
                        showSizeChanger
                        onShowSizeChange={this._changePaginationSize}
                        pageSizeOptions={pageSizeOptions}
                    /> : ''}
            </div>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { logout })(Referrals));
