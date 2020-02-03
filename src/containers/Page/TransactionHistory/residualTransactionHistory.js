import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import {
  PAGESIZE,
  TABLE_SCROLL_HEIGHT,
  PAGE_SIZE_OPTIONS
} from "../../../helpers/globals";
import FaldaxLoader from "../faldaxLoader";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { transactionTableInfos } from "../../Tables/antTables";
import moment from "moment";
import { PrecisionCell } from "../../../components/tables/helperCells";
import authAction from '../../../redux/auth/actions'; 
import { Icon, Pagination, notification } from "antd";
import { residualTransactionTableColumn } from "../../Tables/antTables/transactionConfig";
const { logout } = authAction;
const ResidualTransactionHistory = props => {
  const token = useSelector(state => state.Auth.get("token"));
  const dispatch = useDispatch();
  let [isLoading, setIsLoading] = useState(false),
    [page, setPage] = useState(1),
    [limit, setLimit] = useState(PAGESIZE),
    [data, setData] = useState([]),
    [dataCount, setDataCount] = useState(0);
  const [error, setError] = useState({
    errType: "",
    errMessage: "",
    showError: false
  });

  const getAllResidualTransactionHistory = async () => {
    try {
      setIsLoading(true);
      console.log(page);
      let res = await (
        await ApiUtils.getResidualTransactions(token, page, limit)
      ).json();
      let { status, data } = res;
      if (status == 200) {
        setData(data.transactions);
        setDataCount(data.total);
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
      console.log("Error in getAllResidualTransactionHistory api", error);
    } finally {
      setIsLoading(false);
    }
  };
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
    getAllResidualTransactionHistory();
  }, [limit, page]);

  const _copyNotification = () => {
    setError({
      errMsg: true,
      errType: "info",
      errMessage: "Copied to Clipboard!!"
    });
  };

  const _handleTransactionPagination = p => {
    setPage(p);
  };

  useEffect(() => {
    getAllResidualTransactionHistory();
  }, []);

  const _changePaginationSize = (current, pageSize) => {
    setPage(current);
    setLimit(pageSize);
  };

  return (
    <>
      {isLoading && <FaldaxLoader />}
      <TableDemoStyle className="isoLayoutContent">
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
                  style={{ cursor: "pointer" }}
                  text={record.transaction_id}
                  onCopy={_copyNotification}
                >
                  <span>{record.transaction_id}</span>
                </CopyToClipboard>
                <br/>
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
                {record.transaction_type == "send" && (
                  <>
                    <span>
                      <b>FALDAX Fees: </b>
                    </span>{" "}
                    {record.transaction_type == "send"
                      ? PrecisionCell(record.faldax_fee)
                      : "-"}
                    <br />
                  </>
                )}
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
