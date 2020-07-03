import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Tooltip, Icon, Row, Input, Button, Col, Form } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import { isAllowed } from '../../../../helpers/accessControl';
import { ConvertSatoshiToAssetCell } from '../../../../components/tables/helperCells';
import { exportWallet } from '../../../../helpers/exportToCsv/headers';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';
import { Precise } from "../../../../components/tables/helperCells";
var self;
const columns = [
    {
        title: <IntlMessages id="walletWarmDashboardTable.title.action" />,
        align: "left",
        key: 3,
        width: 100,
        render: object => (<>{isAllowed("admin_hotreceive_wallet_details") && <Tooltip className="btn-icon" title="View"><Icon onClick={() => WalletWarmDashboard.navigateToView(object["coin_code"])} type="info-circle"></Icon></Tooltip>}</>)
    },

    {
        title: <IntlMessages id="walletWarmDashboardTable.title.asset" />,
        align: "left",
        key: 4,
        width: 100,
        render: object => <span><img className="small-icon-img" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"] + " (" + object["coin_name"] + ")"}</span>
    },
    {
        title: <IntlMessages id="walletWarmDashboardTable.title.balance" />,
        align: "left",
        key: 1,
        width: 100,
        render: data => ConvertSatoshiToAssetCell(data["coin"], data["balance"], data["coin_precision"])
    },
    {
        title: <IntlMessages id="walletFaldaxDashboardTable.title.fiat" />,
        align: "left",
        key: 1,
        width: 100,
        dataIndex: "total_value",
        render: (data) => <span>{data ? Precise(data, "8") : "0"}</span>,
    },
    {
        title: <IntlMessages id="walletWarmDashboardTable.title.address" />,
        align: "left",
        key: 2,
        dataIndex: "address",
        width: 100,
    },
]

class WalletWarmDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = { csvData: [], openCsvModal: false, loader: false, data: [], searchData: "" }
        this.loader = { show: () => this.setState({ loader: true }), hide: () => this.setState({ loader: false }) };
        self = this;
    }

    componentDidMount() {
        this.getWalletData();
    }

    static navigateToView = (coin_code) => {
        let { data } = self.state;
        let assets = []
        data.map((ele) => {
            assets.push({ name: ele.coin, value: ele.coin_code, icon: ele.coin_icon })
            return ele;
        })
        self.props.history.push({ pathname: `./wallet/hotreceive/${coin_code}`, state: { assets: JSON.stringify(assets) } })
    }

    openNotificationWithIcon = (type = "Error", message = "Unable to complete the requested action.") => {
        notification[(type).toLowerCase()]({
            message: type,
            description: message
        });
    }
    onExport = () => {
        this.setState({ openCsvModal: true }, () => this.getWalletData(true));
    }

    getWalletData = async (isExportToCsv = false) => {
        try {
            await this.loader.show()
            let { searchData } = this.state;
            let res = await (await (isExportToCsv ? ApiUtils.walletDashboard(this.props.token).getHotReceiveWallet("") : ApiUtils.walletDashboard(this.props.token).getHotReceiveWallet(searchData))).json();
            let [{ status, data, err }, logout] = [res, this.props.logout];
            if (status == 200) {
                // Remove susu coin wallet 
                let index = data.findIndex((ele) => ele.coin.toLowerCase() == "susu");
                if (index > -1)
                    data.splice(index, 1)
                if (isExportToCsv)
                    this.setState({ csvData: data })
                else
                    this.setState({ data });
            } else if (status == 400 || status == 403) {
                this.openNotificationWithIcon("Error", err)
                logout();
            } else {
                this.openNotificationWithIcon("Error", err)
            }
        } catch (error) {
            this.openNotificationWithIcon("Error", "Unable to complete the requested action.");
        } finally {
            this.loader.hide();
        }
    }
    render() {
        const [{ loader, data, searchData, openCsvModal, csvData }] = [this.state];
        return (
            <>
                <ExportToCSVComponent
                    isOpenCSVModal={openCsvModal}
                    onClose={() => {
                        this.setState({ openCsvModal: false });
                    }}
                    filename="hot_receive_wallet.csv"
                    data={csvData}
                    header={exportWallet}
                />
                <TableDemoStyle className="isoLayoutContent">
                    <Form onSubmit={(e) => { e.preventDefault(); this.getWalletData(); }}>
                        <Row justify="start" type="flex" className="table-filter-row">
                            <Col xs={12} md={7}>
                                <Input placeholder="Search Asset" value={searchData} onChange={value => this.setState({ searchData: value.target.value })} />
                            </Col>
                            <Col xs={12} md={3}>
                                <Button type="primary" htmlType="submit" icon="search" className="filter-btn btn-full-width">Search</Button>
                            </Col>
                            <Col xs={12} md={3}>
                                <Button type="primary" icon="export" onClick={this.onExport} className="filter-btn btn-full-width">Export</Button>
                            </Col>
                        </Row>
                    </Form>
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={columns}
                        pagination={false}
                        dataSource={data}
                        className="isoCustomizedTable table-tb-margin"
                        onChange={this.handleTableChange}
                        bordered
                    />
                    {loader && <Loader />}
                </TableDemoStyle>
            </>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get("token")
    }), { ...authAction })(WalletWarmDashboard))

