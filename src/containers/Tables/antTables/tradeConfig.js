import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  HistoryDateCell,
  VolumeCell,
  ObjectCell
} from "../../../components/tables/helperCells";

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
  report = null
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

  switch (type) {
    case "DateCell":
      return HistoryDateCell(
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
    width: 100,
    sorter: true,
    render: object => renderCell(object, "DateCell", "created_at")
  },
  {
    title: <IntlMessages id="tradeTable.title.symbol" />,
    key: "symbol",
    width: 200,
    sorter: true,
    render: object => renderCell(object, "TextCell", "symbol")
  },
  {
    title: <IntlMessages id="tradeTable.title.side" />,
    key: "side",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "TextCell", "side")
  },
  {
    title: <IntlMessages id="tradeTable.title.email" />,
    key: "email",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "TextCell", "email")
  },
  {
    title: <IntlMessages id="tradeTable.title.order_id" />,
    key: "order_id",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "TextCell", "order_id")
  },
  {
    title: <IntlMessages id="tradeTable.title.you_send" />,
    key: "sell_currency_amount",
    width: 100,
    sorter: true,
    render: object => (<span>{(object["side"].toLowerCase() == "buy" ? parseFloat(object["sell_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[1] : parseFloat(object["sell_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[0])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.you_received" />,
    key: "buy_currency_amount",
    width: 100,
    sorter: true,
    render: object => (<span>{(object["side"].toLowerCase() == "buy" ? parseFloat(object["buy_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[0] : parseFloat(object["buy_currency_amount"]).toFixed(8) + " " + object["symbol"].split("/")[1])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.faldax_fees" />,
    key: "faldax_fees",
    width: 100,
    sorter: true,
    render: object => (<span>{(parseFloat(object["faldax_fees"]).toFixed(8)) + " " + (object["side"].toLowerCase() == "buy" ? (object["symbol"].split("/")[0]) : (object["symbol"].split("/")[1]))}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.network_fees" />,
    key: "network_fees",
    width: 100,
    sorter: true,
    render: object => (<span>{(parseFloat(object["network_fees"]).toFixed(8)) + " " + (object["side"].toLowerCase() == "buy" ? (object["symbol"].split("/")[0]) : (object["symbol"].split("/")[1]))}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.limit_price" />,
    key: "limit_price",
    width: 100,
    sorter: true,
    render: object => (<span>{parseFloat(object["limit_price"]).toFixed(8) + " " + (object["symbol"].split("/")[1])}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.fill_price" />,
    key: "fill_price",
    width: 100,
    sorter: true,
    render: object => (<span>{parseFloat(object.fill_price).toFixed(8) + " " + (object.settle_currency)}</span>)
  },
  {
    title: <IntlMessages id="tradeTable.title.commission" />,
    key: "difference_faldax_commission",
    width: 100,
    sorter: true,
    render: object => (<span>{parseFloat(object["difference_faldax_commission"]).toFixed(8) + " " + (object["symbol"].split("/")[1])}</span>)
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

const tradeTableInfos = [
  {
    title: "Trade History",
    value: "TradeTable",
    columns: clone(columns)
  }
];

export { columns, tradeTableInfos };
