import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import {walletTableInfos} from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";

const TabPane = Tabs.TabPane;
const { logout } = authAction;

class AssetWalletHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletHistoryData: [],
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
        }
    }

    componentDidMount = () => {
        this._getAllWalletHistory();
    }

    _getAllWalletHistory = () => {
        const { token, asset_id } = this.props;
        let formData = {
            coinReceive: asset_id,
            is_admin: true
        }
        let _this = this;

        ApiUtils.getWalletDetails(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ walletHistoryData: res.walletTransData })
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
            })
            .catch((err) => {
                _this.setState({ errMsg: true, errMessage: err, errType: 'error' });
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
        const { walletHistoryData, errType, errMsg, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            
                <TableDemoStyle className="isoLayoutContent">
                    {loader && <FaldaxLoader />}
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={walletTableInfos[0].columns}
                        pagination={false}
                        dataSource={walletHistoryData}
                        bordered
                        
                    />
                </TableDemoStyle>
            
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AssetWalletHistory);

export { AssetWalletHistory, walletTableInfos };
