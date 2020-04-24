import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  VolumeCell,
  ObjectCell,
  DateTimeCell,
  ToolTipsCell
} from "../../../components/tables/helperCells";
import { Icon } from "antd";

const renderCell = (
  object,
  type,
  key,
  pair = null,
  pair1 = null,
  reqested_email = null,
  emailID = null,
  buy = null,
  quant = null,
  Price = null,
  fillPrice = null,
  makerFee = null,
  takerFee = null,
  Vol = null,
  createdOn = null,
  report = null,
  transaction_id = null
) => {
  const value = object[key];
  const currency = object[pair];
  const settle_currency = object[pair1];
  const reqested_user_email = object[reqested_email];
  const email = object[emailID];
  const side = object[buy];
  const quantity = object[quant];
  const price = object[Price];
  const fill_price = object[fillPrice];
  const maker_fee = object[makerFee];
  const taker_fee = object[takerFee];
  const volume = object[Vol];
  const created_at = object[createdOn];
  const execution_report = [object[report]];
  const transaction_id1 = object[transaction_id];

  switch (type) {
    case "DateCell":
      return DateTimeCell(
        value,
        currency,
        settle_currency,
        reqested_user_email,
        email,
        side,
        quantity,
        price,
        fill_price,
        maker_fee,
        taker_fee,
        volume,
        created_at
      );
    case "VolumeCell":
      return VolumeCell(
        value,
        currency,
        settle_currency,
        reqested_user_email,
        email,
        side,
        quantity,
        price,
        fill_price,
        maker_fee,
        taker_fee,
        volume,
        created_at
      );
    case "ExecutionReport":
      return ObjectCell(value, execution_report);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="tradeTable.title.created_at" />,
    key: "created_at",
    align: "left",
    width: 150,
    sorter: true,
    render: object => renderCell(object, "DateCell", "created_at")
  },
  {
    title: <IntlMessages id="tradeTable.title.symbol" />,
    key: "symbol",
    width: 100,
    align: "left",
    sorter: true,
    render: object => renderCell(object, "TextCell", "symbol")
  },
  {
    title: <IntlMessages id="tradeTable.title.side" />,
    key: "side",
    width: 75,
    sorter: true,
    align: "left",
    dataIndex: "side",
    render: (data) => <span className={data.toLowerCase() == "sell" ? "field-error" : "color-green"}><Icon type={data.toLowerCase() == "sell" ? "arrow-up" : "arrow-down"} />&nbsp;{data}</span>
  },
  {
    title: <IntlMessages id="tradeTable.title.email" />,
    key: "email",
    width: 250,
    align: "left",
    sorter: true,
    dataIndex: "email",
    render: object => ToolTipsCell(object)
  },
  {
    title: <IntlMessages id="tradeTable.title.order_id" />,
    key: "order_id",
    width: 150,
    sorter: true,
    align: "left",
    dataIndex:"order_id",
    ellipses:true,
    render: object =>ToolTipsCell(object) 
  },
  {
    title: <IntlMessages id="tradeTable.title.order_status" />,
    key: "order_status",
    sorter: true,
    align: "left",
    width: 100,
    dataIndex: "order_status",
    render: data => <span className={"status-" + data + ""}>{data.charAt(0).toUpperCase() + data.slice(1)}</span>
  },
  {
    title: <IntlMessages id="tradeTable.title.you_send" />,
    key: "sell_currency_amount",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{(object["side"].toLowerCase() == "buy" ? parseFloat(object["sell_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[1] : parseFloat(object["sell_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[0])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.you_received" />,
    key: "buy_currency_amount",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{(object["side"].toLowerCase() == "buy" ? parseFloat(object["buy_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[0] : parseFloat(object["buy_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[1])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.faldax_fees" />,
    key: "faldax_fees",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{(parseFloat(object["faldax_fees"]).toFixed(8)) + " " + (object["side"].toLowerCase() == "buy" ? (object["symbol"].split("/")[0]) : (object["symbol"].split("/")[1]))}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.network_fees" />,
    key: "network_fees",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{(parseFloat(object["network_fees"]).toFixed(8)) + " " + (object["side"].toLowerCase() == "buy" ? (object["symbol"].split("/")[0]) : (object["symbol"].split("/")[1]))}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.limit_price" />,
    key: "limit_price",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{parseFloat(object["limit_price"]).toFixed(8) + " " + (object["symbol"].split("/")[1])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.fill_price" />,
    key: "fill_price",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{parseFloat(object.fill_price).toFixed(8) + " " + (object.settle_currency)}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.commission" />,
    key: "difference_faldax_commission",
    width: 200,
    align: "left",
    sorter: true,
    render: object => (<span>{parseFloat(object["difference_faldax_commission"]).toFixed(8) + " " + (object["symbol"].split("/")[1])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.offer" />,
    key: "apply_offer",
    width: 100,
    align: "left",
    dataIndex: "offer_code",
    render: (data) => <span className="color-green">{data}</span>
  },
  // {
  //   title: <IntlMessages id="tradeTable.title.quantity" />,
  //   key: "quantity",
  //   width: 100,
  //   sorter: true,
  //   render: object => (<span>{parseFloat(object.quantity).toFixed(8) + " " + (object.currency)}</span>)
  // },
  // {
  //   title: <IntlMessages id="tradeTable.title.subtotal" />,
  //   key: "subtotal",
  //   width: 100,
  //   sorter: true,
  //   render: object => (<span>{(object["side"].toLowerCase() == "Buy" ? (parseFloat(object["buy_currency_amount"]).toFixed(8) + parseFloat(object["faldax_fees"]).toFixed(8) + parseFloat(object["network_fees"]).toFixed(8)) + " " + object["symbol"].split("/")[0] : (parseFloat(object["buy_currency_amount"]).toFixed(8) + parseFloat(object["faldax_fees"]).toFixed(8) + parseFloat(object["network_fees"]).toFixed(8)) + " " + object["symbol"].split("/")[1])}</span>)
  // },
  // {
  //   title: <IntlMessages id="tradeTable.title.execution_report" />,
  //   key: "execution_report",
  //   width: 100,
  //   sorter: true,
  //   render: object =>
  //     renderCell(
  //       object,
  //       "ExecutionReport",
  //       "id",
  //       "currency",
  //       "settle_currency",
  //       "reqested_user_email",
  //       "email",
  //       "side",
  //       "quantity",
  //       "price",
  //       "fill_price",
  //       "maker_fee",
  //       "taker_fee",
  //       "volume",
  //       "created_at",
  //       "execution_report"
  //     )
  // }
];

const columns1 = [
  {
    title: "Created At",
    key: "created_at",
    align: "left",
    width: 150,
    sorter: true,
    render: object => renderCell(object, "DateCell", "created_at")
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
    title: "Requested Email",
    key: "requested_mail",
    width: 250,
    align: "left",
    sorter: true,
    dataIndex: "requested_email",
    render: object => ToolTipsCell(object)
  },
  {
    title: <IntlMessages id="tradeTable.title.symbol" />,
    key: "symbol",
    width: 100,
    align: "left",
    sorter: true,
    render: object => renderCell(object, "TextCell", "symbol")
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
    title: <IntlMessages id="tradeTable.title.transaction_id" />,
    key: "transaction_id1",
    width: 350,
    sorter: true,
    align: "left",
    dataIndex: "transaction_id"
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
  // {
  //   title:"Limit Price",
  //   key: "limit_price",
  //   sorter: true,
  //   align: "left",
  //   width: 100,
  //   dataIndex: "limit_price",
  //   render:(columns)=><span>{columns!=0 || columns!="0" ?parseFloat(columns).toFixed(8):columns}</span>
  // },
  // {
  //   title:"Stop Price",
  //   key: "stop_price",
  //   sorter: true,
  //   align: "left",
  //   width: 100,
  //   dataIndex: "stop_price",
  //   render:(columns)=><span>{columns!=0 || columns!="0" ?parseFloat(columns).toFixed(8):columns}</span>
  // },
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
];

const tradeTableInfos = [
  {
    title: "Trade History",
    value: "TradeTable",
    columns: clone(columns)
  }
];
const ownTradeTable = [
  {
    title: "Trade History",
    value: "TradeTable",
    columns: clone(columns1)
  }
];

export { columns, columns1, tradeTableInfos, ownTradeTable };
