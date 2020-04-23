import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row, Col, Input, DatePicker, Button, Select, Form, Icon } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, S3BucketImageURL, EXPORT_LIMIT_SIZE } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DateTimeCell, TransactionIdHashCell, PrecisionCell, ToolTipsCell } from '../../../../components/tables/helperCells';
import { PageCounterComponent } from '../../../Shared/pageCounter';
import { exportDirectDeposit, exportOwnTrade } from '../../../../helpers/exportToCsv/headers';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';


const { RangePicker } = DatePicker;
const { Option } = Select;
const columns = [
  {
    title: "Created At",
    key: "created_at",
    align: "left",
    width: 150,
    sorter: true,
    render: object => DateTimeCell(object, "DateCell", "created_at")
  },
  {
    title: "User Email",
    key: "user_email",
    width: 250,
    align: "left",
    sorter: true,
    dataIndex: "email",
    render: object => ToolTipsCell(object)
  },
  {
    title: <IntlMessages id="tradeTable.title.symbol" />,
    key: "symbol",
    width: 100,
    align: "left",
    sorter: true,
    dataIndex: 'symbol'
  },
  {
    title: <IntlMessages id="tradeTable.title.side" />,
    key: "side",
    width: 75,
    sorter: true,
    align: "left",
    dataIndex: "side",
    render: data => (
      <span
        className={data.toLowerCase() == "sell" ? "field-error" : "color-green"}
      >
        <Icon
          type={data.toLowerCase() == "sell" ? "arrow-up" : "arrow-down"}
        />&nbsp;{data}
      </span>
    )
  },
  {
    title: <IntlMessages id="tradeTable.title.order_id" />,
    key: "order_id",
    width: 150,
    sorter: true,
    align: "left",
    dataIndex: "order_id"
  },
  {
    title: <IntlMessages id="tradeTable.title.order_status" />,
    key: "order_status",
    sorter: true,
    align: "left",
    width: 100,
    dataIndex: "order_status",
    render: data => (
      <span className={"status-" + data + ""}>
        {data.charAt(0).toUpperCase() + data.slice(1).replace("_", " ")}
      </span>
    )
  },
  {
    title: "Fill Price",
    key: "fill_price",
    sorter: true,
    align: "left",
    width: 100,
    dataIndex: "fill_price",
    render: (columns) => <span>{columns != 0 || columns != "0" ? parseFloat(columns).toFixed(8) : columns}</span>
  },
  {
    title: "Amount",
    key: "quantity",
    sorter: true,
    align: "left",
    width: 150,
    render: (row) => (<span>{parseFloat(row["quantity"]).toFixed(8) + " " + row["settle_currency"]}</span>)
  },
  {
    title: "Maker Fee",
    key: "maker_fee",
    sorter: true,
    align: "left",
    width: 100,
    render: (row) => (<span>{parseFloat(row["maker_fee"]).toFixed(8)}</span>)
  },
  {
    title: "Taker Fee",
    key: "taker_fee",
    sorter: true,
    align: "left",
    width: 100,
    render: (row) => (<span>{parseFloat(row["taker_fee"]).toFixed(8)}</span>)
  }
]

class WalletTradeDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      walletValue: [],
      openCsvModal: false,
      csvData: [],
      limit: PAGESIZE,
      page: 1,
      transaction_type: "",
      sortOrder: "descend",
      sorterCol: "created_at",
      count: 0,
      searchData: "",
      coin_code: "",
      rangeDate: "",
      assetsList: []
    };
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
  }

  onExport = () => {
    this.setState({ openCsvModal: true }, () => this.getWalletData(true));
  };

  componentDidMount() {
    this.setState({
      coin_code: this.props.match.params.coin,
      assetsList: JSON.parse(
        this.props.location.state ? this.props.location.state.assets : "[]"
      )
    });
    this.getWalletData();
  }

  openNotificationWithIcon = (
    type = "Error",
    message = "Unable to complete the requested action."
  ) => {
    notification[type.toLowerCase()]({
      message: type,
      description: message
    });
  };

  handleTableChange = (pagination, filter, sorter) => {
    this.setState(
      { sorterCol: sorter.field, sortOrder: sorter.order, page: 1 },
      () => {
        this.getWalletData();
      }
    );
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

  _copyNotification = () => {
    this.openNotificationWithIcon("Info", "Copied to Clipboard!!");
  };

  getWalletData = async (isExportCsv = false) => {
    try {
      await this.loader.show();
      const {
        page,
        sortOrder,
        sorterCol,
        limit,
        searchData,
        rangeDate,
        coin_code,
        transaction_type
      } = this.state;
      let start_date = rangeDate ? moment(rangeDate[0]).toISOString() : "",
        end_date = rangeDate ? moment(rangeDate[1]).toISOString() : "";
      let res = await (
        await (isExportCsv ? ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(
          "",
          1,
          EXPORT_LIMIT_SIZE,
          "",
          "",
          "",
          "",
          "",
          5,
          ""
        ) : ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(
          coin_code,
          page,
          limit,
          sorterCol,
          sortOrder,
          searchData,
          start_date,
          end_date,
          5,
          transaction_type
        )
        )).json();
      let [{ status, tradeValue, err, tradeCount }, logout] = [
        res,
        this.props.logout
      ];
      if (status == 200) {
        if (isExportCsv) {
          this.setState({ csvData: tradeValue });
        } else {
          this.setState({ walletValue: tradeValue, count: tradeCount });
        }
      } else if (status == 400 || status == 403) {
        this.openNotificationWithIcon("Error", err);
        logout();
      } else {
        this.openNotificationWithIcon("Error", err);
      }
    } catch (error) {
      this.openNotificationWithIcon("Error", "Unable to complete the requested action.");
    } finally {
      this.loader.hide();
    }
  };
  render() {
    const [
      {
        loader,
        walletValue,
        count,
        limit,
        page,
        searchData,
        rangeDate,
        coin_code,
        assetsList,
        transaction_type,
        csvData,
        openCsvModal
      },
      pageSizeOptions
    ] = [this.state, PAGE_SIZE_OPTIONS];
    return (
      <>
        <ExportToCSVComponent
          isOpenCSVModal={openCsvModal}
          onClose={() => {
            this.setState({ openCsvModal: false });
          }}
          filename="trade_wallet_dashboard.csv"
          data={csvData}
          header={exportOwnTrade}
        />
        <TableDemoStyle className="isoLayoutContent">
          <PageCounterComponent
            page={page}
            limit={limit}
            dataCount={count}
            syncCallBack={() => {
              this.setState(
                {
                  rangeDate: "",
                  searchData: "",
                  coin_code: this.props.match.params.coin,
                  transaction_type: undefined
                },
                () => this.getWalletData()
              );
            }}
          />
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.setState({ page: 1 }, () => this.getWalletData());
            }}
          >
            <Row justify="start" type="flex" className="table-filter-row">
              <Col xs={12} md={5}>
                <Input
                  placeholder="Search"
                  className="full-width"
                  value={searchData}
                  onChange={value =>
                    this.setState({ searchData: value.target.value })
                  }
                />
              </Col>
              <Col xs={12} md={4}>
                <RangePicker
                  format="YYYY-MM-DD"
                  value={rangeDate}
                  onChange={date => this.setState({ rangeDate: date })}
                />
              </Col>
              <Col xs={12} md={3}>
                <Select
                  className="full-width"
                  value={coin_code}
                  onChange={value => this.setState({ coin_code: value })}
                >
                  <Option value="">All</Option>
                  {assetsList.map(ele => (
                    <Option key={ele.key} value={ele.value}>
                      <span>
                        <img
                          className="small-icon-img"
                          alt=""
                          src={S3BucketImageURL + ele.icon}
                        />
                        &nbsp;{ele.name}
                      </span>
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} md={3}>
                <Select
                  className="full-width"
                  value={transaction_type}
                  onChange={value => this.setState({ transaction_type: value })}
                >
                  <Option value="">All</Option>
                  <Option value="Sell">
                    <span className="error-danger">
                      <Icon type="arrow-up" />
                      &nbsp;Sell
                    </span>
                  </Option>
                  <Option value="Buy">
                    <span className="color-green">
                      <Icon type="arrow-down" />
                      &nbsp;Buy
                    </span>
                  </Option>
                </Select>
              </Col>
              <Col xs={12} md={3}>
                <Button
                  type="primary"
                  icon="search"
                  className="filter-btn btn-full-width"
                  htmlType="submit"
                >
                  Search
                </Button>
              </Col>
              <Col xs={12} md={3}>
                <Button
                  type="primary"
                  icon="reload"
                  className="filter-btn btn-full-width"
                  onClick={() => {
                    this.setState(
                      {
                        rangeDate: "",
                        searchData: "",
                        coin_code: this.props.match.params.coin,
                        transaction_type: undefined
                      },
                      () => this.getWalletData()
                    );
                  }}
                >
                  Reset
                </Button>
              </Col>
              <Col xs={12} md={3}>
                <Button
                  type="primary"
                  onClick={this.onExport}
                  icon="export"
                  className="filter-btn btn-full-width"
                >
                  Export
                    </Button>
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
            onChange={this.handleTableChange}
            bordered
            scroll={TABLE_SCROLL_HEIGHT}
            expandedRowRender={record => {
              return (
                <div>
                  <span><b>Created At</b>&nbsp;:&nbsp; {record['created_at']}</span><br />
                  <span><b>Fill Price</b>&nbsp;:&nbsp;{PrecisionCell(record['fill_price'])}</span><br />
                  <span><b>Side</b>&nbsp;:&nbsp;{record['side']}</span><br />
                  <span><b>Order Type</b>&nbsp;:&nbsp;{record['order_type']}</span><br />
                  <span><b>User Email</b>&nbsp;:&nbsp;{record['email']}</span><br />
                  <span><b>Requested Email</b>&nbsp;:&nbsp;{record['requested_email']}</span><br />
                  <span><b>Order Status</b>&nbsp;:&nbsp;{record['order_status']}</span><br />
                  <span><b>Limit price</b>&nbsp;:&nbsp;{PrecisionCell(record['limit_price'])}</span><br />
                  <span><b>Stop Price</b>&nbsp;:&nbsp;{PrecisionCell(record['stop_price'])}</span><br />
                  <span><b>User Fees</b>&nbsp;:&nbsp;{record["user_fee"] + " " + record['user_coin']}</span><br />
                  <span><b>Requested Fees</b>&nbsp;:&nbsp;{record["requested_fee"] + " " + record['requested_coin']}</span><br />
                </div>
              )
            }}
          />
          <Pagination
            className="ant-users-pagination"
            onChange={this.handlePagination}
            pageSize={limit}
            current={page}
            total={count}
            showSizeChanger
            onShowSizeChange={this.changePaginationSize}
            pageSizeOptions={pageSizeOptions}
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
  }), { ...authAction })(WalletTradeDetailsComponent))

