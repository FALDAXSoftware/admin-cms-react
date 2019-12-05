import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  FeeActionCell,
  DateCell,
  FeeSwitchCell
} from "../../../components/tables/helperCells";
import { isAllowed } from "../../../helpers/accessControl";

const renderCell = (
  object,
  type,
  key,
  fee_name = null,
  maker = null,
  taker = null,
  created = null,
  status = null
) => {
  const value = object[key];
  const name = object[fee_name];
  const maker_fee = object[maker];
  const taker_fee = object[taker];
  const created_at = object[created];
  const is_active = object[status];

  switch (type) {
    case "DateCell":
      return DateCell(value, name, maker_fee, taker_fee, created_at, is_active);
    case "FeeSwitchCell":
      return FeeSwitchCell(
        value,
        name,
        maker_fee,
        taker_fee,
        created_at,
        is_active
      );
    case "FeeActionCell":
      return FeeActionCell(
        value,
        name,
        maker_fee,
        taker_fee,
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
    width: 200,
    render: object =>
      renderCell(
        object,
        "FeeActionCell",
        "id",
        "name",
        "maker_fee",
        "taker_fee",
        "created_at",
        "is_active"
      )
  },
  {
    title: <IntlMessages id="feeTable.title.created_at" />,
    key: "created_at",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "DateCell", "created_at")
  },
  {
    title: <IntlMessages id="feeTable.title.name" />,
    key: "name",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "TextCell", "name")
  },
  {
    title: <IntlMessages id="feeTable.title.maker_fee" />,
    key: "maker_fee",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "FixedCell", "maker_fee")
  },
  {
    title: <IntlMessages id="feeTable.title.taker_fee" />,
    key: "taker_fee",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "FixedCell", "taker_fee")
  },
  {
    title: <IntlMessages id="feeTable.title.status" />,
    key: "is_active",
    width: 100,
    render: object =>{
      if (isAllowed("update_pair")) {
        return renderCell(
          object,
          "FeeSwitchCell",
          "id",
          "name",
          "maker_fee",
          "taker_fee",
          "created_at",
          "is_active"
        )  
      }else{
        return renderCell(object, "TextCell", "is_active")
      }
    }
      
  }
];

const pairsTableInfos = [
  {
    title: "Fees & Pairs",
    value: "pairsTable",
    columns: clone(columns)
  }
];

export { columns, pairsTableInfos };
