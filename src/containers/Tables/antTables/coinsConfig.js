import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  CoinActionCell,
  SwitchCell,
  DateTimeCell
} from "../../../components/tables/helperCells";
import { isAllowed } from "../../../helpers/accessControl";

const renderCell = (
  object,
  type,
  key,
  name = null,
  code = null,
  minlimit = null,
  maxlimit = null,
  wallet = null,
  cratedAt = null,
  status = null,
  erc = null,
  icon = null,
  warmAddress = null,
  hotSendAddress = null,
  hotReceiveAddress = null,
  custodyAddress = null
) => {
  const value = object[key];
  const coin_name = object[name];
  const coin_code = object[code];
  const min_limit = object[minlimit];
  const max_limit = object[maxlimit];
  const wallet_address = object[wallet];
  const created_at = object[cratedAt];
  const is_active = object[status];
  const isERC = object[erc];
  const coin_icon = object[icon];
  const warm_wallet_address = object[warmAddress];
  const hot_send_wallet_address = object[hotSendAddress];
  const hot_receive_wallet_address = object[hotReceiveAddress];
  const custody_wallet_address = object[custodyAddress];

  switch (type) {
    case "DateCell":
      return DateTimeCell(value);
    case "SwitchCell":
      return SwitchCell(
        value,
        coin_name,
        coin_code,
        min_limit,
        max_limit,
        wallet_address,
        created_at,
        is_active,
        isERC,
        coin_icon,
        !isAllowed("update_coins")
      );
    case "CoinActionCell":
      return CoinActionCell(
        value,
        coin_name,
        coin_code,
        min_limit,
        max_limit,
        wallet_address,
        created_at,
        is_active,
        isERC,
        coin_icon,
        warm_wallet_address,
        hot_send_wallet_address,
        hot_receive_wallet_address,
        custody_wallet_address
      );
    case "FixedCell":
      if (value) {
        var temp = value;
        var val = temp.toFixed(8);
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
    title: <IntlMessages id="coinTable.title.Actions" />,
    key: "action",
    width: "20%",
    align: "left",
    render: object =>
      renderCell(
        object,
        "CoinActionCell",
        "id",
        "coin_name",
        "coin_code",
        "min_limit",
        "max_limit",
        "wallet_address",
        "created_at",
        "is_active",
        "isERC",
        "coin_icon",
        "warm_wallet_address",
        "hot_send_wallet_address",
        "hot_receive_wallet_address",
        "custody_wallet_address"
      )
  },
  {
    title: <IntlMessages id="coinTable.title.coin" />,
    width: "20%",
    align: "left",
    sorter: true,
    render: object => <span><img className="small-icon-img" alt="asset" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"] + " (" + object["coin_name"] + ")"}</span>
  },
  {
    title: <IntlMessages id="coinTable.title.code" />,
    key: "coin_code",
    width: 100,
    sorter: true,
    render: object => renderCell(object, "TextCell", "coin_code")
  },
  {
    title: <IntlMessages id="coinTable.title.limit" />,
    key: "min_limit",
    align: "left",
    width: "20%",
    sorter: true,
    render: object => renderCell(object, "FixedCell", "min_limit")
  },
  // {
  //   title: <IntlMessages id="coinTable.title.maxlimit" />,
  //   key: "max_limit",
  //   align: "left",
  //   width: "20%",
  //   sorter: true,
  //   render: object => renderCell(object, "FixedCell", "max_limit")
  // },
  {
    title: <IntlMessages id="coinTable.title.active" />,
    key: "is_active",
    align: "left",
    width: "20%",
    render: object => {
      return renderCell(
        object,
        "SwitchCell",
        "id",
        "coin_name",
        "coin_code",
        "min_limit",
        "max_limit",
        "wallet_address",
        "created_at",
        "is_active",
        "isERC",
        "coin_icon",
        "warm_wallet_address",
        "hot_send_wallet_address",
        "hot_receive_wallet_address",
        "custody_wallet_address"
      )
    }

  }
];

const assetTableInfos =
{
  title: "Assets",
  value: "CoinsTable",
  columns: clone(columns)
};

export { columns, assetTableInfos };
