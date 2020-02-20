import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Row, Col, Input, Icon, Tooltip, Button, Modal, Form } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from './../../../../helpers/accessControl';
import { PrecisionCell } from '../../../../components/tables/helperCells';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';
import { exportWallet } from '../../../../helpers/exportToCsv/headers';

var self

const columns = [
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.action" />,
        align: "left",
        key: 9,
        width: 200,
        // fixed: 'left',
        render: object => (
            <>
                {isAllowed("send_coin_admin") && <Tooltip className="cursor-pointer" title="Send"><Icon type="export" onClick={() => WalletFaldaxDashboard.openSendModal(object)}></Icon></Tooltip>}
                {isAllowed("admin_faldax_wallet_details") && <Tooltip className="btn-icon" title="View"><Icon onClick={() => WalletFaldaxDashboard.navigateToView(object["coin_code"])} type="info-circle"></Icon></Tooltip>}
            </>
        )
    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.coin" />,
        align: "left",
        key: 1,
        width: 100,
        render: object => <span><img className="small-icon-img" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"] + " (" + object["coin_name"] + ")"}</span>
    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.total" />,
        align: "left",
        key: 5,
        dataIndex: "total",
        width: 100,
        render: data => <span>{data ? parseFloat(data).toFixed(8) : "0"}</span>
    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_forfeit" />,
        align: "left",
        key: 2,
        dataIndex: "total_earned_from_forfeit",
        width: 100,
        render: data => <span>{data ? parseFloat(data).toFixed(8) : "0"}</span>
    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_jst" />,
        align: "left",
        key: 3,
        dataIndex: "total_earned_from_jst",
        width: 100,
        render: data => <span>{data ? parseFloat(data).toFixed(8) : "0"}</span>

    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_wallets" />,
        align: "left",
        key: 4,
        dataIndex: "total_earned_from_wallets",
        width: 100,
        render: data => <span>{data ? parseFloat(data).toFixed(8) : "0"}</span>
    },
    // {
    //     title:<IntlMessages id="walletFaldaxDashboardTable.title.send_address"/>,
    //     align:"left",
    //     key:7,
    //     width:100,
    //     render:data=><span>{data["send_address"]?data["send_address"]: <Button size="small" type="dashed" onClick={()=>self.props.history.push(`./assets/wallet/${data["coin_code"]}`)}>Create</Button>}</span>,
    //     class:"copy-text-container"
    // },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.receive_address" />,
        align: "left",
        key: 8,
        dataIndex: "receive_address",
        width: 100,
        class: "copy-text-container"

    },

]

class WalletFaldaxDashboard extends Component {
    constructor(props) {
        super(props)
        this.timer = 1000;//1.5 seconds
        this.timeCounter = undefined;
        this.state = { openCsvModal: false, csvData: [], loader: false, walletValue: [], availableBalance: "", searchData: "", sendModal: false, walletDetails: {}, fields: {}, networkFee: 0 }
        this.loader = { show: () => this.setState({ loader: true }), hide: () => this.setState({ loader: false }) };
        self = this;
        this.validator = new SimpleReactValidator({
            gtzero: {
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
    }

    onExport = () => {
        this.setState({ openCsvModal: true }, () => this.getWalletData(true));
    }

    componentDidMount() {
        this.getWalletData();
    }

    static openSendModal = async (values) => {
        await self.getAssetAvailableBalance(values.coin_code);
        self.setState({ sendModal: true, walletDetails: values });
    }

    static navigateToView = (coin_code) => {
        let { walletValue } = self.state;
        let assets = []
        walletValue.map((ele) => {
            assets.push({ name: ele.coin, value: ele.coin_code, icon: ele.coin_icon })
            return ele;
        })
        self.props.history.push({ pathname: `./wallet/faldax/${coin_code}`, state: { assets: JSON.stringify(assets) } })
    }

    openNotificationWithIcon = (type = "Error", message = "Unable to complete the requested action.") => {
        notification[(type).toLowerCase()]({
            message: type,
            description: message
        });
    }

    getWalletData = async (isExportToCsv = false) => {
        try {
            await this.loader.show()
            const { searchData } = this.state;
            let res = await (await (isExportToCsv ? ApiUtils.getAllWallets(this.props.token) : ApiUtils.getAllWallets(this.props.token, searchData))).json();
            let [{ status, data, err, message }, logout] = [res, this.props.logout];
            if (status == 200) {
                if (isExportToCsv) {
                    this.setState({ csvData: data })
                } else {
                    this.setState({ walletValue: data });
                }
            } else if (status == 400 || status == 403) {
                this.openNotificationWithIcon("Error", err)
                logout();
            } else {
                this.openNotificationWithIcon("Error", err)
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            this.loader.hide();
        }
    }

    _handleChange = async (field, e) => {
        if (this.state.loader) {
            return false;
        }
        clearTimeout(this.timeCounter);
        let { token } = this.props,
            { fields, walletDetails } = this.state;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields }, async () => {
            if (this.validator.allValid()) {
                this.timeCounter = setTimeout(async () => {
                    try {
                        this.loader.show();
                        let res = await (await ApiUtils.getWalletNetworkFee(token, { dest_address: fields['dest_address'], amount: fields['amount'], coin: walletDetails.coin_code })).json();
                        if (res.status == 200) {
                            this.setState({ networkFee: res.data })
                        } else if (res.status == 400 || res.status == 401 || res.status == 403) {

                        }
                    } catch (error) {

                    } finally {
                        this.loader.hide();
                    }
                }, this.timer)
            } else {
                this.setState({ networkFee: 0 })
                this.validator.showMessages();
                this.forceUpdate();
            }
        });
    }

    sendWalletBal = async () => {
        const { token } = this.props;
        const { fields, walletDetails, networkFee } = this.state;
        let formData = {
            amount: fields['amount'],
            destination_address: fields['dest_address'],
            coin_code: walletDetails.coin_code,
            networkFees: parseFloat(networkFee) ? parseFloat(networkFee) : 0,
            total_fees: parseFloat(fields['amount']) && parseFloat(networkFee) ? (parseFloat(fields['amount']) + parseFloat(networkFee)).toFixed(8) : 0
        };
        if (this.validator.allValid()) {
            try {
                this.loader.show();
                let res = await (await ApiUtils.sendWalletBalance(token, formData)).json();
                let [{ data, status, err, message }, { logout }] = [res, this.props];
                if (status == 200) {
                    this.setState({ allWallets: data }, () => { this.openNotificationWithIcon("Success", message); this.getWalletData(); });
                } else if (status == 403) {
                    this.openNotificationWithIcon("Error", err)
                    logout();
                } else {
                    this.openNotificationWithIcon("Error", message)
                }
                this.closeSendModal();
            } catch (err) {
                console.log(err)
            } finally {
                this.loader.hide();
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    getAssetAvailableBalance = async (asset) => {
        try {
            this.setState({ loader: true });
            let res = await (await ApiUtils.getAvailableBalance(this.props.token, asset)).json();
            let { status, data, err, message } = res;
            if (status == 200) {
                this.setState({ availableBalance: data })
            } else if (status == 403) {
                this.openNotificationWithIcon("Error", err);
                this.props.logout();
            } else {
                this.openNotificationWithIcon("Error", message);
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({ loader: false });
        }
    }


    closeSendModal = () => {
        this.validator = new SimpleReactValidator({
            gtzero: {  // name the rule
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true  // optional
            }
        });
        this.setState({ sendModal: false, fields: {}, walletDetails: [], networkFee: 0 });
    }

    render() {
        const { loader, walletValue, walletDetails, searchData, sendModal, fields, networkFee, availableBalance, openCsvModal, csvData } = this.state;
        return (
            <>
                <TableDemoStyle className="isoLayoutContent">
                    <ExportToCSVComponent
                        isOpenCSVModal={openCsvModal}
                        onClose={() => {
                            this.setState({ openCsvModal: false });
                        }}
                        filename="under_review_customer_id_verification"
                        data={csvData}
                        header={exportWallet}
                    />
                    <Form onSubmit={(e) => { e.preventDefault(); this.getWalletData(); }}>
                        <Row justify="start" type="flex">
                            <Col className="table-column" xs={12} md={7}>
                                <Input placeholder="Search Asset" value={searchData} onChange={value => this.setState({ searchData: value.target.value })} />
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" htmlType="submit" icon="search" className="filter-btn btn-full-width">Search</Button>
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="export" onClick={this.onExport} className="filter-btn btn-full-width">Export</Button>
                            </Col>
                        </Row>
                    </Form>
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={columns}
                        pagination={false}
                        dataSource={walletValue}
                        className="isoCustomizedTable table-tb-margin"
                        bordered
                    />
                    <Modal
                        title="Send"
                        visible={sendModal}
                        onOk={this.closeSendModal}
                        onCancel={this.closeSendModal}
                        footer={[
                            <Button key="submit-a" type="primary" onClick={this.sendWalletBal}>Send {walletDetails.coin}</Button>
                        ]}
                    >
                        <span className="wallet-send-summery-title"><b>Total Balance  </b></span><span>{PrecisionCell(walletDetails.total_earned_from_wallets) == "-" ? 0 : PrecisionCell(walletDetails.total_earned_from_wallets)} {walletDetails.coin}</span><br />
                        <span className="wallet-send-summery-title"><b>Available Balance </b></span><span>{PrecisionCell(availableBalance) == "-" ? 0 : PrecisionCell(availableBalance)} {walletDetails.coin}</span>
                        <Form onSubmit={this._sendWalletBal}>
                            <div className="table-tb-margin">
                                <span>Destination Address:</span>
                                <Input placeholder="Destination Address" onChange={this._handleChange.bind(this, "dest_address")} value={fields["dest_address"]} />
                                <span style={{ "color": "red" }}>
                                    {this.validator.message('destination address', fields["dest_address"], 'required', 'text-danger-validation')}
                                </span>
                            </div>
                            <div style={{ "marginBottom": "15px" }}>
                                <span>Amount:</span>
                                <Input placeholder="Amount" onChange={this._handleChange.bind(this, "amount")} value={fields["amount"]} />
                                <span style={{ "color": "red" }}>
                                    {this.validator.message('amount', fields["amount"], `required|numeric|gte:${walletDetails.min_limit == 0 ? 0 : walletDetails.min_limit ? parseFloat(walletDetails.min_limit).toFixed(8) : 0}|lte:${availableBalance}`, 'text-danger')}
                                </span>
                            </div>
                            <div className="clearfix">
                                <div className="float-left">
                                    <span className="wallet-send-summery-head"><b>Sending Amount</b></span><span>{fields["amount"] || 0} {walletDetails.coin}</span><br />
                                    <span className="wallet-send-summery-head"><b>Network Fee</b></span><span>{networkFee} {walletDetails.coin}</span><br />
                                    <span className="wallet-send-summery-head"><b>Total Payload</b></span><span>{parseFloat(fields['amount']) && parseFloat(networkFee) ? (parseFloat(fields['amount']) + parseFloat(networkFee)).toFixed(8) : 0} {walletDetails.coin}</span><br />
                                </div>
                                <div className="float-right">
                                    <span className="wallet-send-summery-head"><b>Fiat Value</b></span><span>$&nbsp;{parseFloat(walletDetails.fiat || 0)}</span><br />
                                </div>
                            </div>
                        </Form>
                    </Modal>
                    {loader && <Loader />}
                </TableDemoStyle>
            </>);
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get("token")
    }), { ...authAction })(WalletFaldaxDashboard))

