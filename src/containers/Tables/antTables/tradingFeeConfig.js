import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  TradeCoinFeesActionCell,
  CoinNoteCell,
} from "../../../components/tables/helperCells";

const renderCell = (
  object,
  type,
  key,
  ID,
  maker_fee,
  taker_fee,
  trade_volume
) => {
  const value = object[key];
  const id = object[ID];
  const makerfee = object[maker_fee];
  const takerfee = object[taker_fee];
  const tradevolume = object[trade_volume];
  switch (type) {
    case "TradeCoinFeesActionCell":
      return TradeCoinFeesActionCell(
        value,
        id,
        makerfee,
        takerfee,
        tradevolume
      );
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="roleTable.title.actions" />,
    key: "action",
    width: 100,
    align: "left",
    render: (object) =>
      renderCell(
        object,
        "TradeCoinFeesActionCell",
        "id",
        "maker_fee",
        "taker_fee",
        "trade_volume"
      ),
  },
  {
    title: <IntlMessages id="tradeFeeTable.title.makerfee" />,
    key: "makerfee",
    align: "left",
    width: 100,
    dataIndex: "maker_fee",
  },
  {
    title: <IntlMessages id="tradeFeeTable.title.takerfee" />,
    key: "takerfee",
    align: "left",
    width: 100,
    dataIndex: "taker_fee",
  },
  {
    title: <IntlMessages id="tradeFeeTable.title.tradevolume" />,
    key: "tradeVolume",
    align: "left",
    width: 100,
    dataIndex: "trade_volume",
  },
];

const tradingFeeTableInfos = [
  {
    title: "Trading Fees",
    value: "TradingFeeTable",
    columns: clone(columns),
  },
];

export { columns, tradingFeeTableInfos };
