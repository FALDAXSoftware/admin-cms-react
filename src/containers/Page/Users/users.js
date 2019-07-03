import React, { Component } from 'react';
import { Tabs, Input, Pagination, notification, Button, Row, Select, Form } from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { CSVLink } from "react-csv";
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ColWithPadding from '../common.style';
import CountryData from 'country-state-city';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { logout } = authAction;
var self;

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            allUserCount: 0,
            searchUser: '',
            userDetails: [],
            page: 1,
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            allCountries: []
        }
        self = this;
        Users.view = Users.view.bind(this);
        Users.changeStatus = Users.changeStatus.bind(this);
    }

    static view(value, profile_pic, first_name, last_name, email, city_town, street_address,
        street_address_2, phone_number, country, dob, is_active, kyc) {
        self.props.history.push('/dashboard/users/' + value)
    }

    static changeStatus(value, profile_pic, first_name, last_name, email, city_town,
        street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state) {
        const { token } = this.props;

        let formData = {
            user_id: value,
            email: email,
            is_active: !is_active
        };

        self.setState({ loader: true });
        let message = is_active ? 'User has been inactivated successfully.' : 'User has been activated successfully.'
        ApiUtils.activateUser(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self._getAllUsers();
                    self.setState({
                        errMsg: true, errMessage: message, errType: 'Success', loader: false
                    })
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllUsers();
        let allCountries = CountryData.getAllCountries();
        this.setState({ allCountries });
    }

    _getAllUsers = () => {
        const { token } = this.props;
        const { searchUser, limit, page, sorterCol, sortOrder, filterVal } = this.state;
        var _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllUsers(page, limit, token, searchUser, sorterCol, sortOrder, filterVal)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allUsers: res.data, allUserCount: res.userCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
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

    _searchUser = (e) => {
        e.preventDefault();
        this._getAllUsers();
    }

    _handleUserPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllUsers();
        });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getAllUsers();
        })
    }

    _changeSearch = (field, e) => {
        this.setState({ searchUser: field.target.value })
    }

    _addUser = () => {
        this.props.history.push('/dashboard/users/add-user')
    }

    _changeCountry = (val) => {
        this.setState({ filterVal: val });
    }

    _resetFilters = () => {
        this.setState({
            filterVal: '', searchUser: '', page: 1, sorterCol: '', sortOrder: ''
        }, () => {
            this._getAllUsers();
        })
    }

    _goToUserDetails = (user) => {
        this.props.history.push('/dashboard/users/' + user.id)
    }

    render() {
        const { allUsers, allUserCount, page, loader, errMsg, errType, searchUser, filterVal, allCountries } = this.state;

        const headers = [
            { label: "First Name", key: "first_name" },
            { label: "Last Name", key: "last_name" },
            { label: "Full Name", key: "full_name" },
            { label: "Email", key: "email" },
            { label: "Country", key: "country" },
            { label: "State", key: "state" },
            { label: "City", key: "city_town" },
            { label: "Street Address Line 1", key: "street_address" },
            { label: "Street Address Line 2", key: "street_address_2" },
            { label: "Postal Code", key: "postal_code" },
            { label: "DOB", key: "dob" },
            { label: "Active/Inactive", key: "is_active" },
            { label: "Verified/Non Verified", key: "is_verified" },
            { label: "Fiat Currency", key: "fiat" },
            { label: "Referral Percentage", key: "referal_percentage" },
            { label: "No Of Referrals", key: "no_of_referrals" },
            { label: "Account Tier", key: "account_tier" },
            { label: "Created On", key: "created_at" }
        ];

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <LayoutContentWrapper>
                    <TableDemoStyle className="isoLayoutContent">
                        <Tabs className="isoTableDisplayTab">
                            {tableinfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <div style={{ "display": "inline-block", "width": "100%" }}>
                                        <Form onSubmit={this._searchUser}>
                                            <Row type="flex" justify="end">
                                                <ColWithPadding sm={5}>
                                                    <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._addUser}>Add User</Button>
                                                </ColWithPadding>
                                                <ColWithPadding sm={5}>
                                                    <Input
                                                        placeholder="Search users"
                                                        onChange={this._changeSearch.bind(this)}
                                                        value={searchUser}
                                                    />
                                                </ColWithPadding>
                                                <ColWithPadding sm={5}>
                                                    <Select
                                                        getPopupContainer={trigger => trigger.parentNode}
                                                        placeholder="Select a country"
                                                        onChange={this._changeCountry}
                                                        value={filterVal}
                                                    >
                                                        {allCountries && allCountries.map((country, index) => {
                                                            return <Option key={country.id} value={country.name} >{country.name}</Option>
                                                        })}
                                                    </Select>
                                                </ColWithPadding>
                                                <ColWithPadding xs={12} sm={3}>
                                                    <Button htmlType="submit" className="search-btn" type="primary" >Search</Button>
                                                </ColWithPadding>
                                                <ColWithPadding xs={12} sm={3}>
                                                    <Button className="search-btn" type="primary" onClick={this._resetFilters}>Reset</Button>
                                                </ColWithPadding>
                                                <ColWithPadding sm={3}>
                                                    {allUsers && allUsers.length > 0 ?
                                                        <CSVLink
                                                            data={allUsers}
                                                            filename={'users.csv'}
                                                            headers={headers}
                                                        >
                                                            <Button style={{}} className="search-btn" type="primary">Export</Button>
                                                        </CSVLink> : ''}
                                                </ColWithPadding>
                                            </Row>
                                        </Form>
                                    </div>
                                    {loader && <FaldaxLoader />}
                                    <div style={{ marginTop: "30px" }}>
                                        <TableWrapper
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: () => { this._goToUserDetails(record) },
                                                };
                                            }}
                                            style={{ cursor: 'pointer' }}
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allUsers}
                                            className="isoCustomizedTable"
                                            onChange={this.handleTableChange}
                                        />
                                        {allUserCount > 0 ? <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleUserPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allUserCount}
                                        /> : ''}
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </TableDemoStyle>
                </LayoutContentWrapper>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Users);

export { Users, tableinfos };