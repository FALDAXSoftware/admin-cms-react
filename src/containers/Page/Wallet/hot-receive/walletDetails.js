import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Row, Col, Input, Button, Select, Form, Icon } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, S3BucketImageURL } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import { DateTimeCell, TransactionIdHashCell, ConvertSatoshiToAssetCell } from '../../../../components/tables/helperCells';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';
import { exportHotReceiveWalletDetails } from '../../../../helpers/exportToCsv/headers';

const { Option } = Select;
const columns = [
    // {
    //     title:<IntlMessages id="walletWarmDetailsTable.title.coin"/>,
    //     key:4,
    //     dataIndex:"coin",
    //     width:100,
    //     render:data=><span>{data.toUpperCase()}</span>
    // },
    {
        title: <IntlMessages id="walletWarmDetailsTable.title.created_on" />,
        key: "createdTime",
        dataIndex: "createdTime",
        sorter: true,
        width: 100,
        render: data => <span>{DateTimeCell(data)}</span>
    },
    {
        title: <IntlMessages id="walletWarmDetailsTable.title.baseValue" />,
        key: "baseValue",
        sorter: true,
        width: 75,
        render: data => ConvertSatoshiToAssetCell(data["coin"], data["baseValue"])
    },
    {
        title: <IntlMessages id="walletWarmDetailsTable.title.type" />,
        key: "type",
        dataIndex: "type",
        width: 50,
        render: data => <span className={data == "send" ? "error-danger" : "color-green"}><Icon type={data == "send" ? "arrow-up" : "arrow-down"} />&nbsp;{data.charAt(0).toUpperCase() + data.slice(1)}</span>
    },
    {
        title: <IntlMessages id="walletWarmDetailsTable.title.txid" />,
        key: "txid",
        width: 250,
        ellipsis: true,
        render: data => TransactionIdHashCell(data["coin"], data["txid"])
    },
    {
        title: <IntlMessages id="walletWarmDetailsTable.title.network_fee" />,
        key: "baseValue",
        sorter: true,
        width: 75,
        render: data => ConvertSatoshiToAssetCell(data["coin"], data["feeString"])
    },
    // {
    //     title:<IntlMessages id="walletWarmDetailsTable.title.normalizedTxHash"/>,
    //     key:3,
    //     dataIndex:"normalizedTxHash",
    //     width:100,
    // },

]

class WalletWarmDetailsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = { csvData: [], openCsvModal: false, loader: false, transfers: [], count: 0, searchData: "", coin_code: "", assetsList: [] }
        this.loader = { show: () => this.setState({ loader: true }), hide: () => this.setState({ loader: false }) };
    }
    onExport = () => {
        this.setState({ openCsvModal: true }, () => this.getWalletData(true));
    }

    componentDidMount() {
        this.setState({ coin_code: this.props.match.params.coin, assetsList: JSON.parse(this.props.location.state ? this.props.location.state.assets : "[]") })
        this.getWalletData();
    }

    openNotificationWithIcon = (type = "Error", message = "Unable to complete the requested action.") => {
        notification[(type).toLowerCase()]({
            message: type,
            description: message
        });
    }

    handleTableChange = (pagination, filter, sorter) => {
        let { transfers } = this.state;
        if (sorter.columnKey == 'createdTime') {
            if (sorter.order == "ascend") {
                transfers = transfers.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime))
            } else if (sorter.order == "descend") {
                transfers = transfers.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
            }
            this.setState(transfers);
        } else if (sorter.columnKey == "baseValue") {
            if (sorter.order == "ascend") {
                transfers = transfers.sort((a, b) => parseFloat(a.baseValue) - parseFloat(b.baseValue))
            } else if (sorter.order == "descend") {
                transfers = transfers.sort((a, b) => parseFloat(b.baseValue) - parseFloat(a.baseValue))
            }
            this.setState(transfers, () => this.loader.hide());
        }
    };

    changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this.getWalletData();
        });
    };

    handlePagination = page => {
        this.setState({ page }, () => {
            this.getWalletData();
        });
    };

    getWalletData = async (isExportToCsv = false) => {
        try {
            await this.loader.show()
            const { coin_code, searchData } = this.state;
            let res = await (await (isExportToCsv ? ApiUtils.walletDashboard(this.props.token).getHotReceiveWalletDetails(coin_code, "") : ApiUtils.walletDashboard(this.props.token).getHotReceiveWalletDetails(coin_code, searchData))).json();
            let [{ status, data, err, tradeCount }, logout] = [res, this.props.logout];
            if (status == 200) {
                if (isExportToCsv)
                    this.setState({ csvData: data.transfers })
                else
                    this.setState({ transfers: data.transfers, count: tradeCount });
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
    render() {
        const [{ loader, transfers, searchData, coin_code, assetsList, csvData, openCsvModal }, pageSizeOptions] = [this.state, PAGE_SIZE_OPTIONS];
        return (
            <>
                <ExportToCSVComponent
                    isOpenCSVModal={openCsvModal}
                    onClose={() => {
                        this.setState({ openCsvModal: false });
                    }}
                    filename="hot_receive_wallet_details.csv"
                    data={csvData}
                    header={exportHotReceiveWalletDetails}
                />
                <TableDemoStyle className="isoLayoutContent">
                    <Form onSubmit={(e) => { e.preventDefault(); this.getWalletData(); }}>
                        <Row justify="start" type="flex" className="table-filter-row">
                            <Col xs={12} md={8}>
                                <Input placeholder="Search" value={searchData} onChange={value => this.setState({ searchData: value.target.value })} />
                            </Col>
                            <Col xs={12} md={7}>
                                <Select className="full-width" value={coin_code} onChange={value => this.setState({ coin_code: value })}>
                                    {assetsList.map((ele) => <Option key={ele.key} value={ele.value}><span><img className="small-icon-img" src={S3BucketImageURL + ele.icon} />&nbsp;{ele.name}</span></Option>)}
                                </Select>
                            </Col>
                            <Col xs={12} md={3}>
                                <Button type="primary" icon="search" htmlType="submit" className="filter-btn btn-full-width">Search</Button>
                            </Col>
                            <Col xs={12} md={3}>
                                <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={() => { this.setState({ rangeDate: "", searchData: "", coin_code: this.props.match.params.coin }, () => this.getWalletData()) }}>Reset</Button>
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
                        dataSource={transfers}
                        className="isoCustomizedTable table-tb-margin"
                        onChange={this.handleTableChange}
                        scroll={TABLE_SCROLL_HEIGHT}
                        bordered
                    />
                    {/* <Pagination
                            className="ant-users-pagination"
                            onChange={this.handlePagination}
                            pageSize={limit}
                            current={page}
                            total={count}
                            showSizeChanger
                            onShowSizeChange={this.changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
                      /> */}
                    {loader && <Loader />}
                </TableDemoStyle>
            </>
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get("token")
    }), { ...authAction })(WalletWarmDetailsComponent))

