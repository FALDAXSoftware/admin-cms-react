import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, Input, Pagination, notification } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const TabPane = Tabs.TabPane;

class UserTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTickets: [],
            loader: false,
            allTicketsCount: 0,
            page: 1,
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
        }
    }

    componentDidMount = () => {
        this._getAllUserTickets();
    }

    _getAllUserTickets = () => {
        const { token, user_id } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        let formData = {
            user_id,
        };

        _this.setState({ loader: true })
        ApiUtils.getUserTickets(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTickets: res.data, loader: false, allTicketsCount: res.allHistoryCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                _this.setState({ loader: false })
            });
    }

    _handleTicketsPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllUserTickets();
        })
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    render() {
        const { allTickets, loader, allTicketsCount, page, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {historyTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div>
                                    <TableWrapper
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allTickets}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <FaldaxLoader />}
                                    {allTicketsCount > 0 ?
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleTicketsPagination.bind(this)}
                                            pageSize={50}
                                            current={page}
                                            total={allTicketsCount}
                                        /> : ''}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        )
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserTickets);
