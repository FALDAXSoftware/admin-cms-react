import React, { Component } from 'react';
import { notification } from 'antd';
import { tierReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class ApprovedRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            approvedRequests: this.props.data,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.setState({ approvedRequests: nextProps.data })
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
        const { errType, errMsg, approvedRequests } = this.state;
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
                        dataSource={approvedRequests}
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
    }), { logout })(ApprovedRequests);

export { ApprovedRequests, tierReqTableInfos };
