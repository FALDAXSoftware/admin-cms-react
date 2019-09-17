import React, { Component } from 'react';
import { notification } from 'antd';
import { tierPendingReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import ApiUtils from '../../../helpers/apiUtills';

const { logout } = authAction;
var self;

class PendingRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingRequests: this.props.data,
        }
        self = this;
        PendingRequests.approvePendingReq = PendingRequests.approvePendingReq.bind(this);
    }

    static approvePendingReq(value, first_name, last_name, tier_step, is_approved, user_id) {
        console.log('>>>self', value, first_name, last_name, tier_step, is_approved, user_id)
        const { token } = self.props;

        self.setState({ loader: true })
        ApiUtils.getAllTierRequests(token, value, is_approved)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    self.setState({
                        allPendingReq: res.getUserPendingTierData,
                        allApprovedReq: res.getUserApprovedTierData,
                        allRejectedReq: res.getUserRejectedTierData
                    });
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                self.setState({ loader: false })
            })
            .catch(() => {
                self.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.setState({ pendingRequests: nextProps.data })
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
        const { errType, errMsg, pendingRequests } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                {tierPendingReqTableInfos.map(tableInfo => (
                    <TableWrapper
                        {...this.state}
                        columns={tableInfo.columns}
                        pagination={false}
                        dataSource={pendingRequests}
                        className="isoCustomizedTable"
                        onChange={this._handlePairsChange}
                    />
                ))}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(PendingRequests);

export { PendingRequests, tierPendingReqTableInfos };
