import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  CoinFeesActionCell,
  CoinNoteCell,
} from "../../../components/tables/helperCells";

const renderCell = (object, maker_fee, taker_fee, trade_volume) => {
  //   const value = object[key];
  const makerfee = object[maker_fee];
  const takerfee = object[taker_fee];
  const tradevolume = object[trade_volume];
  //   switch (
  //     type
  //     // case "CoinFeesActionCell":
  //     //   return CoinFeesActionCell(value, makerfee, takerfee);
  //     // case "NoteCell":
  //     //   return CoinNoteCell(fees_slug);
  //     // default:
  //     //   return TextCell(
  //     //     value,
  //     //     fees_name,
  //     //     fees_slug,
  //     //     fees_type,
  //     //     fees_updated_at,
  //     //     fees_value
  //     //   );
  //   ) {
  //   }
};

const columns = [
  //   {
  //     title: <IntlMessages id="roleTable.title.actions" />,
  //     key: "action",
  //     width: 100,
  //     align: "left",
  //     render: (object) =>
  //       renderCell(
  //         object,
  //         "CoinFeesActionCell",
  //         "id",
  //         "name",
  //         "slug",
  //         "type",
  //         "updated_at",
  //         "value"
  //       ),
  //   },
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
