import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import {
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  PAGE_SIZE_OPTIONS,
  EXPORT_LIMIT_SIZE
} from "../../../helpers/globals";
import FaldaxLoader from "../faldaxLoader";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TableWrapper from "../../Tables/antTables/antTable.style";
import moment from "moment";
import { PrecisionCell } from "../../../components/tables/helperCells";
import authAction from "../../../redux/auth/actions";
import {
  Icon,
  Pagination,
  notification,
  Form,
  Row,
  Select,
  Input,
  DatePicker,
  Button
} from "antd";
import { residualTransactionTableColumn } from "../../Tables/antTables/transactionConfig";
import { ColWithMarginBottom } from "../common.style";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { exportResidualHeaders } from "../../../helpers/exportToCsv/headers";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { logout } = authAction;
const ResidualTransactionHistory = props => {
  const token = useSelector(state => state.Auth.get("token"));
  const dispatch = useDispatch();
  let [isLoading, setIsLoading] = useState(false),
    [page, setPage] = useState(1),
    [openCsvModal,setOpenCsvModal]=useState(false),
    [csvData,setCsvData]=useState([]),
    [limit, setLimit] = useState(PAGESIZE),
    [data, setData] = useState([]),
    [searchTransaction, setSearchTransaction] = useState(""),
    [dataCount, setDataCount] = useState(0),
    [filterVal, setFilterVal] = useState(""),
    [dateRange, setDateRange] = useState({
      rangeDate: [],
      startDate: "",
      endDate: ""
    }),
    [isReset,setIsReset]=useState(false),
    [isInitLoad,setInitLoad]=useState(false);
  const [error, setError] = useState({
    errType: "",
    errMessage: "",
    showError: false
  });

  const getAllResidualTransactionHistory = async (isExportToCsv=false) => {
    try {
      setIsLoading(true);
      setIsReset(false);
      let res = await (
        await(isExportToCsv?ApiUtils.getResidualTransactions(token,1,EXPORT_LIMIT_SIZE):ApiUtils.getResidualTransactions(token, page, limit,searchTransaction,dateRange.startDate,dateRange.endDate,filterVal))
      ).json();
      let { status, data } = res;
      if (status == 200) {
        if(isExportToCsv){
          setCsvData(data.transactions);
        }else{
          setData(data.transactions);
          setDataCount(data.total);
        }
      } else if (status == 400 || status == 403 || status == 401) {
        setError({
          errType: "Error",
          errMessage: res.err,
          showError: true
        });
        dispatch(logout());
      } else {
        setError({
          errType: "Error",
          errMessage: res.err,
          showError: true
        });
      }
    } catch (error) {
      setError({
        errType: "Error",
        errMessage: "Unable to complete the requested action.",
        showError: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onExport=()=>{
    setOpenCsvModal(true);
    getAllResidualTransactionHistory(true);
  }

  const _copyNotification = () => {
    setError({
      showError: true,
      errType: "Info",
      errMessage: "Copied to Clipboard!!"
    });
  };

  const _changeFilter = val => {
    setFilterVal(val);
  };

  const _handleTransactionPagination = p => {
    setPage(p);
  };

  const _changeSearch = (field, e) => {
    setSearchTransaction(field.target.value);
  };

  const _changeDate = (date, dateString) => {
    setDateRange({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };

  useEffect(() => {
    getAllResidualTransactionHistory();
    setInitLoad(true);
  }, []);

  useEffect(() => {
    if(isInitLoad && isReset)
      getAllResidualTransactionHistory();
  }, [isReset]);

  useEffect(() => {
    if (error.showError) {
      notification[error.errType.toLowerCase()]({
        message: error.errType,
        description: error.errMessage
      });
      setError({
        errType: "",
        errMessage: "",
        showError: false
      });
    }
  }, [error]);

  useEffect(() => {
    if(isInitLoad)
     getAllResidualTransactionHistory();
  }, [limit, page]);
  
  const _changePaginationSize = (current, pageSize) => {
    setPage(current);
    setLimit(pageSize);
  };

  const _searchTransaction = e => {
    e.preventDefault();
    getAllResidualTransactionHistory();
  };

  const _resetFilters = () => {
    setFilterVal("");
    setSearchTransaction("");
    setDateRange({
      startDate: "",
      rangeDate: "",
      endDate: ""
    });
    setPage(1);
    setIsReset(true);
  };

  return (
    <>
      <TableDemoStyle className="isoLayoutContent">
      <ExportToCSVComponent isOpenCSVModal={openCsvModal} onClose={()=>{setOpenCsvModal(false)}} filename="residual_transaction_history.csv" data={csvData} header={exportResidualHeaders}/>
        <Form onSubmit={_searchTransaction}>
          <Row type="flex" justify="start">
            <ColWithMarginBottom md={6}>
              <Input
                placeholder="Search transactions"
                onChange={(field, e) => _changeSearch(field, e)}
                value={searchTransaction}
              />
            </ColWithMarginBottom>
            <ColWithMarginBottom md={3}>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                placeholder="Select a type"
                onChange={val => _changeFilter(val)}
                value={filterVal}
              >
                <Option value={""}>All</Option>
                <Option value={"send"}>Send</Option>
                <Option value={"receive"}>Receive</Option>
              </Select>
            </ColWithMarginBottom>
            <ColWithMarginBottom md={6}>
              <RangePicker
                value={dateRange.rangeDate}
                onChange={_changeDate}
                format="YYYY-MM-DD"
                className="full-width"
              />
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} md={3}>
              <Button
                htmlType="submit"
                className="filter-btn btn-full-width"
                type="primary"
              >
                <Icon type="search" />
                Search
              </Button>
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} md={3}>
              <Button
                className="filter-btn btn-full-width"
                type="primary"
                onClick={_resetFilters}
              >
                <Icon type="reload" />
                Reset
              </Button>
            </ColWithMarginBottom>
            <ColWithMarginBottom xs={12} md={3}>
              <Button className="filter-btn btn-full-width" type="primary" icon="export" onClick={onExport}>
                Export
              </Button>
            </ColWithMarginBottom>
          </Row>
        </Form>
        {isLoading && <FaldaxLoader />}
        <TableWrapper
          className="float-clear"
          rowKey="id"
          columns={residualTransactionTableColumn.columns}
          pagination={false}
          dataSource={data}
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
                  onCopy={_copyNotification}
                >
                  <span>{record.transaction_id}</span>
                </CopyToClipboard>
                <br />
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
                  &nbsp;{record.transaction_type == "send" ? "Send" : "Receive"}
                </span>
                <br />
                {/* <span>
                          <b>Transaction Fees: </b>
                        </span>{" "}
                        {record.transaction_fees}
                        <br /> */}
                {/* {record.transaction_type == "send" && (
                  <>
                    <span>
                      <b>FALDAX Fees: </b>
                    </span>{" "}
                    {record.transaction_type == "send"
                      ? PrecisionCell(record.faldax_fee)
                      : "-"}
                    <br />
                  </>
                )} */}
                {/* <span>
                          <b>Network Fees: </b>
                        </span>{" "}
                        {record.transaction_type=="send"?PrecisionCell(record.network_fees):'-'}
                        <br /> */}
                <span>
                  <b>Estimated Network Fees: </b>
                </span>{" "}
                {PrecisionCell(record.estimated_network_fees)}
                <br />
                <span>
                  <b>Actual Network Fees: </b>
                </span>{" "}
                {PrecisionCell(record.actual_network_fees)}
                <br />
                <span>
                  <b>Residual Amount:</b>
                </span>{" "}
                {PrecisionCell(record.residual_amount)}
                <br />
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
        {dataCount > 0 ? (
          <Pagination
            style={{ marginTop: "15px" }}
            className="ant-users-pagination"
            onChange={p => _handleTransactionPagination(p)}
            pageSize={limit}
            current={page}
            total={parseInt(dataCount)}
            showSizeChanger
            onShowSizeChange={(a, b) => _changePaginationSize(a, b)}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        ) : (
          ""
        )}
      </TableDemoStyle>
    </>
  );
};

export { ResidualTransactionHistory };
