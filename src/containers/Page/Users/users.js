import React, { Component } from 'react';
import { Tabs, Input, Pagination, Spin, notification } from 'antd';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { tableinfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
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
        self.props.push('dashboard/users/' + value)
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
                self._getAllUsers();
                self.setState({
                    errMsg: true, errMessage: message, errType: 'Success', loader: false
                })
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllUsers();
    }

    _getAllUsers = () => {
        const { token } = this.props;
        const { searchUser, limit, page } = this.state;
        var _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllUsers(page, limit, token, searchUser)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allUsers: res.data, allUserCount: res.userCount });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    _searchUser = (val) => {
        this.setState({ searchUser: val, page: 1 }, () => {
            this._getAllUsers(1);
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

    render() {
        const { allUsers, allUserCount, showViewUserModal, page, userDetails, userId, loader,
            errMsg, errType
        } = this.state;

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
                                        <Search
                                            placeholder="Search users"
                                            onSearch={(value) => this._searchUser(value)}
                                            style={{ "float": "right", "width": "250px" }}
                                            enterButton
                                        />
                                    </div>
                                    {loader && <span className="loader-class">
                                        <Spin />
                                    </span>}
                                    <div>
                                        <TableWrapper
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allUsers}
                                            className="isoCustomizedTable"
                                        />
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleUserPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allUserCount}
                                        />
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
    }))(Users);

export { Users, tableinfos };
