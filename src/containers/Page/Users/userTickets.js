import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { ticketsTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, notification } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { withRouter } from 'react-router';

const { logout } = authAction;
const TabPane = Tabs.TabPane;

class UserTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTickets: [],
            loader: false,
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
        let _this = this;

        let formData = {
            user_id,
        };

        _this.setState({ loader: true })
        ApiUtils.getUserTickets(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let tickets = [];
                    let url = 'https://app.hubspot.com/contacts/';
                    for (var i = 0; i < res.tickets.length; i++) {
                        tickets.push({
                            'redirect_url': url + res.tickets[i].portalId + '/ticket/' + res.tickets[i].objectId,
                            'created_by': res.tickets[i]['properties'].created_by.timestamp,
                            'pipeline_stage': res.tickets[i]['properties'].hs_pipeline_stage.value,
                            'subject': res.tickets[i]['properties'].subject.value,
                            'content': res.tickets[i]['properties'].content.value,
                        });
                    }
                    _this.setState({ allTickets: tickets, loader: false });
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _changeRow = (value) => {
        window.open(value.redirect_url, '_blank');
    }

    render() {
        const { allTickets, loader, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {ticketsTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div>
                                    <TableWrapper
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onClick: () => { this._changeRow(record) },
                                            };
                                        }}
                                        style={{ marginTop: '20px' }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allTickets}
                                        className="isoCustomizedTable"
                                        expandedRowRender={record => <p style={{ margin: 0 }}>{record.content}</p>}
                                    />
                                    {loader && <FaldaxLoader />}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        )
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserTickets));
