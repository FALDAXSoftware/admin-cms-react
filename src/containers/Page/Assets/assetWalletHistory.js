import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import { walletTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
const { logout } = authAction;

class AssetWalletHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allWalletHistory: [],
            limit: 50,
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
            coinReceive: asset_id
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
        console.log('walletHistoryData', walletHistoryData)
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {walletTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    style={{ marginTop: '20px' }}
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={walletHistoryData}
                                    className="isoCustomizedTable"
                                    onChange={this._handleHistoryTableChange}
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AssetWalletHistory);

export { AssetWalletHistory, walletTableInfos };
