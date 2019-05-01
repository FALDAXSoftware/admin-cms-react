import React, { Component } from 'react';
import { Tabs, Input, Pagination, notification, Button } from 'antd';
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

const Search = Input.Search;
const TabPane = Tabs.TabPane;
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
            loader: false
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
        street_address, street_address_2, phone_number, country, dob, is_active, kyc) {
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
    }

    _getAllUsers = () => {
        const { token } = this.props;
        const { searchUser, limit, page, sorterCol, sortOrder } = this.state;
        var _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllUsers(page, limit, token, searchUser, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allUsers: res.data, allUserCount: res.userCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, message: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, message: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _searchUser = (val) => {
        this.setState({ searchUser: val, page: 1 }, () => {
            this._getAllUsers();
        });
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

    _addUser

    render() {
        const { allUsers, allUserCount, page, loader, errMsg, errType } = this.state;
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
                                    <div style={{
                                        "display": "flex", "width": "100%",
                                        "alignItems": "center",
                                    }}>
                                        {/* <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._addUser}>Add User</Button> */}
                                        <Search
                                            placeholder="Search users"
                                            onSearch={(value) => this._searchUser(value)}
                                            style={{ "width": "250px", "marginRight": "20px" }}
                                            enterButton
                                        />
                                        {allUsers && allUsers.length > 0 ?
                                            <CSVLink
                                                data={allUsers}
                                                filename={'users.csv'}
                                                headers={headers}
                                            >
                                                <Button type="primary">Export</Button>
                                            </CSVLink> : ''}
                                    </div>
                                    {loader && <FaldaxLoader />}
                                    <div style={{ marginTop: "30px" }}>
                                        <TableWrapper
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
