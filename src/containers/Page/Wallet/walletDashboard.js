import React, { Component } from 'react';
import { notification, Card } from 'antd';
import { dashboardTableinfos, walletFeeTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class WalletDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allWallets: [],
            allWalletFee: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
        }
    }

    componentDidMount = () => {
        this._getAllWallets();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllWallets = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWallets(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allWallets: res.data, allWalletFee: res.FeeData });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _handleWalletChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
            this._getAllWallets();
        })
    }

    render() {
        const { allWallets, errType, errMsg, loader, allWalletFee } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                {loader && <FaldaxLoader />}
                <Card title="Wallet Dashboard">
                    <Card type="inner" title="FALDAX Wallets">
                        {dashboardTableinfos.map(tableInfo => (
                            <TableWrapper
                                {...this.state}
                                columns={tableInfo.columns}
                                pagination={false}
                                dataSource={allWallets}
                                className="isoCustomizedTable"
                                onChange={this._handleWalletChange}
                            />
                        )
                        )}
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="Asset Fees"
                    >
                        {walletFeeTableinfos.map(tableInfo => (
                            <TableWrapper
                                {...this.state}
                                columns={tableInfo.columns}
                                pagination={false}
                                dataSource={allWalletFee}
                                className="isoCustomizedTable"
                                onChange={this._handleWalletChange}
                            />
                        )
                        )}
                    </Card>
                </Card>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(WalletDashboard);

export { WalletDashboard, dashboardTableinfos };
