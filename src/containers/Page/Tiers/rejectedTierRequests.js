import React, { Component } from 'react';
import { notification } from 'antd';
import { tierReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class RejectedRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rejectedRequests: this.props.data,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.setState({ rejectedRequests: nextProps.data })
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
        const { errType, errMsg, rejectedRequests } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                {tierReqTableInfos.map(tableInfo => (
                    <TableWrapper
                        {...this.state}
                        columns={tableInfo.columns}
                        pagination={false}
                        dataSource={rejectedRequests}
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
    }), { logout })(RejectedRequests);

export { RejectedRequests, tierReqTableInfos };
