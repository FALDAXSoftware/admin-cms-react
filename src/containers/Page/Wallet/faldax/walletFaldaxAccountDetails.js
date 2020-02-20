import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select, Form, Icon } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, S3BucketImageURL, EXPORT_LIMIT_SIZE } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DateTimeCell , TransactionIdHashCell, PrecisionCell, ToolTipsCell} from '../../../../components/tables/helperCells';
import { PageCounterComponent } from '../../../Shared/pageCounter';
import { exportCreditCard, exportResidualHeaders, exportDirectDeposit } from '../../../../helpers/exportToCsv/headers';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';


const {RangePicker}=DatePicker;
const {Option}=Select;
const columns=[
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.coin_code"/>,
        key:55,
        dataIndex:"coin_code",
        width:100,
        ellipsis:true,
        render:data=><span>{data.toUpperCase()}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.created_on"/>,
        key:1,
        dataIndex:"created_at",
        sorter: true,
        ellipsis:true,
        width:150,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    // {
    //     title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.coin_code"/>,
    //     key:55,
    //     dataIndex:"coin_code",
    //     width:100,
    //     render:data=><span>{data.toUpperCase()}</span>
    // },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.amount"/>,
        key:2,
        width:175,
        ellipsis:true,
        render:data=><span>{data?parseFloat(data["amount"]).toFixed(8)+" "+data["coin"]:"-"}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.type"/>,
        key:3,
        dataIndex:"transaction_type",
        width:100,
        ellipsis:true,
        render:data=><span className={data=="send"?"error-danger":"color-green"}><Icon type={data=="send"?"arrow-up":"arrow-down"}/>&nbsp;{data.charAt(0).toUpperCase()+data.slice(1)}</span>
    },
    {
      title:<IntlMessages id="transactionTable.title.tx_from"/>,
      key:8,
      width:200,
      ellipsis:true,
      dataIndex:"transaction_from",
      render:data=>ToolTipsCell(data)
  },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.source_address"/>,
        dataIndex:"source_address",
        key:4,
        ellipsis:true,
        width:300,
    },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.destination_address"/>,
        dataIndex:"destination_address",
        key:5,
        ellipsis:true,
        width:300,
    },
    {
        title:<IntlMessages id="walletFaldaxAccountDetailsTable.title.transaction_id"/>,
        key:6,
        width:300,
        ellipsis:true,
        render:data=>TransactionIdHashCell(data["coin_code"],data["transaction_id"])
       
    }
]

class WalletFaldaxDetailsComponent extends Component {
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

  getWalletData = async (isExportCsv=false) => {
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
        await (isExportCsv?ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(
          "",
          1,
          EXPORT_LIMIT_SIZE,
          "",
          "",
          "",
          "",
          "",
          2,
          ""
        ):ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(
          coin_code,
          page,
          limit,
          sorterCol,
          sortOrder,
          searchData,
          start_date,
          end_date,
          2,
          transaction_type
        )
      )).json();
      let [{ status, walletValue, err, message, tradeCount }, logout] = [
        res,
        this.props.logout
      ];
      if (status == 200) {
        if(isExportCsv){
          this.setState({csvData:walletValue});
        }else{
          this.setState({ walletValue, count: tradeCount });
        }
      } else if (status == 400 || status == 403) {
        this.openNotificationWithIcon("Error", err);
        logout();
      } else {
        this.openNotificationWithIcon("Error", err);
      }
    } catch (error) {
      console.log("error", error);
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
              filename="direct_deposit.csv"
              data={csvData}
              header={exportDirectDeposit}
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
                  <Option value="send">
                    <span className="error-danger">
                      <Icon type="arrow-up" />
                      &nbsp;Send
                    </span>
                  </Option>
                  <Option value="receive">
                    <span className="color-green">
                      <Icon type="arrow-down" />
                      &nbsp;Receive
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
              <Col className="table-column" xs={12} md={3}>
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
                  <span>
                    {" "}
                    <b>Created On: </b>
                  </span>{" "}
                  {moment
                    .utc(record.created_at)
                    .local()
                    .format("DD MMM, YYYY HH:mm:ss")}
                  <br />
                  <span>
                    <b>Transaction Hash: </b>
                  </span>
                  <CopyToClipboard
                    className="copy-text-container"
                    text={record.transaction_id}
                    onCopy={this._copyNotification}
                  >
                    <span>{record.transaction_id}</span>
                  </CopyToClipboard>
                  <br />
                  {/* <span>
                                      <b>Name: </b>
                                      </span>{" "}
                                      {record.first_name+" "+record.last_name}
                                      <br />
                                    <span>
                                      <b>Email: </b>
                                    </span>{" "}
                                    {record.email}
                                    <br /> */}
                  <span>
                    <b>Source Address: </b>
                  </span>{" "}
                  {record.source_address}
                  <br />
                  <span>
                    <b>Destination Address: </b>
                  </span>{" "}
                  {record.destination_address}
                  <br />
                  <span>
                    <b>Transaction Amount: </b>
                  </span>{" "}
                  {PrecisionCell(record.amount)}
                  <br />
                  <span>
                    <b>Base Amount: </b>
                  </span>{" "}
                  {PrecisionCell(record.actual_amount)}
                  <br />
                  <span>
                    <b>Asset: </b>
                  </span>{" "}
                  {record.coin}
                  <br />
                  <span>
                    <b>Transaction Type: </b>
                  </span>
                  <span
                    style={{
                      color: record.transaction_type == "send" ? "red" : "green"
                    }}
                  >
                    {" "}
                    <Icon
                      type={
                        record.transaction_type == "send"
                          ? "arrow-up"
                          : "arrow-down"
                      }
                    />
                    &nbsp;
                    {record.transaction_type == "send" ? "Send" : "Receive"}
                  </span>
                  <br />
                  <span>
                    <b>Estimated Network Fees: </b>
                  </span>{" "}
                  {PrecisionCell(record.estimated_network_fees)}
                  <br />
                  {record.transaction_type == "send" && (
                    <>
                      <span>
                        <b>Actual Network Fees: </b>
                      </span>{" "}
                      {PrecisionCell(record.actual_network_fees)}
                      <br />
                    </>
                  )}
                  {record.transaction_from == "Send to Destination" && (
                    <>
                      <span>
                        <b>Residual Amount:</b>
                        {PrecisionCell(record.residual_amount)}
                      </span>{" "}
                      <br />
                    </>
                  )}
                  <span>
                    <b>Transaction From: </b>
                  </span>{" "}
                  {record.transaction_from}
                  <br />
                  {record.transaction_from == "Warmwallet to Send" && (
                    <>
                      <span>
                        <b>User (Sender) Balance Before Transaction: </b>
                      </span>
                      {record.sender_user_balance_before}
                      <br />
                    </>
                  )}
                  {record.transaction_from == "Receive to Warmwallet" && (
                    <>
                      <span>
                        <b>User (Receiver) Balance Before Transaction: </b>
                      </span>
                      {record.receiver_user_balance_before}
                      <br />
                    </>
                  )}
                </div>
              );
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
    }),{ ...authAction})(WalletFaldaxDetailsComponent))
 
