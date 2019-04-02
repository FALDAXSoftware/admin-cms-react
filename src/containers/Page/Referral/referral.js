import React, { Component } from 'react';
import { Tabs, Pagination, Input, Button, notification } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

class Referral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: [],
            allReferralCount: 0,
            page: 1,
            limit: 50,
            searchReferral: '',
            fields: {}
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getAllReferredAdmins();
        this._getContactDetails();
    }

    _getContactDetails = () => {
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getContactDetails()
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    let fields = _this.state.fields;
                    fields['percentage'] = res.data.default_referral_percentage;
                    _this.setState({ fields });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _getAllReferredAdmins = () => {
        const { token } = this.props;
        const { limit, page, searchReferral } = this.state;

        let _this = this;

        this.setState({ loader: true })
        ApiUtils.getAllReferrals(page, limit, token, searchReferral)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allReferral: res.data, allReferralCount: res.referralCount,
                        showReferralModal: true
                    });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    _handleReferralPagination = (page) => {
        this._getAllReferredAdmins(page);
    }

    _searchCoin = (val) => {
        this.setState({ searchReferral: val }, () => {
            this._getAllReferredAdmins();
        });
    }

    _changeRow = (referral) => {
        this.props.history.push('/dashboard/referral/' + referral.id)
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

    _updateDefaultReferral = () => {
        const { token } = this.props;
        const { userDetails } = this.state;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                referal_percentage: fields['percentage'],
            }

            ApiUtils.updateReferral(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        _this.setState({
                            errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success'
                        }, () => {
                            //  _this._getUserDetails();
                        })
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

    render() {
        const { allReferral, allReferralCount, loader, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {
                            referralInfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <div style={{ "display": "inline-block", "width": "100%" }}>
                                        <Search
                                            placeholder="Search users"
                                            onSearch={(value) => this._searchCoin(value)}
                                            style={{ "float": "right", "width": "250px" }}
                                            enterButton
                                        />
                                    </div>
                                    <TableWrapper
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: () => { this._changeRow(record) },
                                            };
                                        }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allReferral}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <FaldaxLoader />}
                                    {allReferralCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleReferralPagination.bind(this)}
                                            pageSize={50}
                                            defaultCurrent={1}
                                            total={allReferralCount}
                                        /> : ''}
                                </TabPane>
                            ))
                        }
                        <TabPane tab="Referral Percentage" key="2">
                            <div style={{ "marginTop": "10px", "marginLeft": "200px" }}>
                                <span>
                                    <b>Default Referral Percentage</b>
                                </span>
                                <Input addonAfter={'%'} placeholder="Referral Percentage" style={{ "marginTop": "15px", "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                                    onChange={this._onChangeFields.bind(this, "percentage")} value={fields["percentage"]} />
                                <span className="field-error">
                                    {this.validator.message('percentage', fields['percentage'], 'required|numeric')}
                                </span>
                                <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._updateDefaultReferral}> Update </Button>
                            </div>
                            {loader && <FaldaxLoader />}
                        </TabPane>
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }))(Referral);
