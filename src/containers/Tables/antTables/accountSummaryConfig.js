import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  DateTimeCell,
  IPCell,
  LogoutDateCell
} from "../../../components/tables/helperCells";

const renderCell = (
  object,
  type,
  key,
  is_login = null,
  created_date = null,
  updated_date = null
) => {
  const value = object[key];
  const is_logged_in = object[is_login];
  const created_at = object[created_date];
  const updated_at = object[updated_date];

  switch (type) {
    case "DateTimeCell":
      return DateTimeCell(value, is_logged_in, created_at, updated_at);
    case "LogoutDateCell":
      return LogoutDateCell(value, is_logged_in, created_at, updated_at);
    case "IPCell":
      return IPCell(value);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="summaryTableInfos.title.coin_name" />,
    key: "coin_name",
    width: 100,
    render: object => renderCell(object, "TextCell", "coin_name")
  },
  {
    title: <IntlMessages id="summaryTableInfos.title.receive_address" />,
    key: "receive_address",
    width: 100,
    render: object => renderCell(object, "TextCell", "receive_address")
  },
  {
    title: <IntlMessages id="summaryTableInfos.title.balance" />,
    key: "totalAmount",
    width: 100,
    render: object => renderCell(object, "TextCell", "balance")
  },
  {
    title: <IntlMessages id="summaryTableInfos.title.fiat" />,
    key: "fiat",
    width: 100,
    render: object => renderCell(object, "TextCell", "fiat")
  }
];

const summaryTableInfos = [
  {
    title: " History",
    value: "historyTable",
    columns: clone(columns)
  }
];

export { columns, summaryTableInfos };
