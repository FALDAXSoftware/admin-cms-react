import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  FeeActionCell,
  DateCell,
  FeeSwitchCell,
} from "../../../components/tables/helperCells";
import { isAllowed } from "../../../helpers/accessControl";

const renderCell = (
  object,
  type,
  key,
  fee_name = null,
  price_precision = null,
  quantity_precision = null,
  order_maximum = null,
  created = null,
  status = null
) => {
  const value = object[key];
  const name = object[fee_name];
  const price_Precision = object[price_precision];
  const quantity_Precision = object[quantity_precision];
  const order_Maximum = object[order_maximum];
  const created_at = object[created];
  const is_active = object[status];

  switch (type) {
    case "DateCell":
      return DateCell(
        value,
        name,
        price_precision,
        quantity_precision,
        created_at,
        is_active
      );
    case "FeeSwitchCell":
      return FeeSwitchCell(
        value,
        name,
        price_precision,
        quantity_precision,
        created_at,
        is_active
      );
    case "FeeActionCell":
      return FeeActionCell(
        value,
        name,
        price_Precision,
        quantity_Precision,
        order_Maximum,
        created_at,
        is_active
      );
    case "FixedCell":
      if (value) {
        var temp = value;
        var temp1 = value.toString();
        var res = temp1.split(".");
        var result = temp - Math.floor(temp) !== 0;
        if (result && res[1].length > 8) {
          var val = temp.toFixed(8);
        } else {
          var val = value;
        }
      } else {
        var val = value;
      }
      return TextCell(val);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="feeTable.title.Actions" />,
    key: "action",
    width: 150,
    render: (object) =>
      renderCell(
        object,
        "FeeActionCell",
        "id",
        "name",
        "price_precision",
        "quantity_precision",
        "order_maximum",
        "created_at",
        "is_active"
      ),
  },
  {
    title: <IntlMessages id="feeTable.title.created_at" />,
    key: "created_at",
    width: 150,
    sorter: true,
    render: (object) => renderCell(object, "DateCell", "created_at"),
  },
  {
    title: <IntlMessages id="feeTable.title.name" />,
    key: "name",
    width: 150,
    sorter: true,
    render: (object) => renderCell(object, "TextCell", "name"),
  },
  {
    title: <IntlMessages id="feeTable.title.price_precision" />,
    key: "price_precision",
    width: 150,
    sorter: true,
    render: (object) => renderCell(object, "FixedCell", "price_precision"),
  },
  {
    title: <IntlMessages id="feeTable.title.quantity_precision" />,
    key: "quantity_precision",
    width: 150,
    sorter: true,
    render: (object) => renderCell(object, "FixedCell", "quantity_precision"),
  },
  {
    title: <IntlMessages id="feeTable.title.order_maximum" />,
    key: "order_maximum",
    width: 250,
    sorter: true,
    dataIndex: "order_maximum",
  },
  {
    title: <IntlMessages id="feeTable.title.status" />,
    key: "is_active",
    width: 150,
    render: (object) => {
      if (isAllowed("admin_edit_pair")) {
        return renderCell(
          object,
          "FeeSwitchCell",
          "id",
          "name",
          "price_precision",
          "quantity_precision",
          "order_maximum",
          "created_at",
          "is_active"
        );
      } else {
        return renderCell(object, "TextCell", "is_active");
      }
    },
  },
];

const pairsTableInfos = [
  {
    title: "Fees & Pairs",
    value: "pairsTable",
    columns: clone(columns),
  },
];

export { columns, pairsTableInfos };
