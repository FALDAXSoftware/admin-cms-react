import React from "react";
import clone from "clone";
import IntlMessages from "../../../components/utility/intlMessages";
import {
  TextCell,
  TierThresholdCell,
  TierActionCell,
  TierReqCell,
} from "../../../components/tables/helperCells";

const renderCell = (
  object,
  type,
  key,
  tier = null,
  dailyLimit = null,
  monthlyLimit = null,
  minThreshold = null,
  req = null,
  req2 = null,
  maxTradeAmount = null,
  maxAllowedDays = null
) => {
  const value = object[key];
  const tier_step = object[tier];
  const daily_withdraw_limit = object[dailyLimit];
  const monthly_withdraw_limit = object[monthlyLimit];
  const minimum_activity_thresold = object[minThreshold];
  const requirements = object[req];
  const requirements2 = object[req2];
  const max_trade_amount = object[maxTradeAmount];
  const max_allowed_days = object[maxAllowedDays];

  switch (type) {
    case "TierActionCell":
      return TierActionCell(value);
    case "TierReqCell":
      return TierReqCell(
        value,
        tier_step,
        daily_withdraw_limit,
        monthly_withdraw_limit,
        minimum_activity_thresold,
        requirements,
        requirements2
      );
    case "TierThresholdCell":
      return TierThresholdCell(
        value,
        tier_step,
        daily_withdraw_limit,
        monthly_withdraw_limit,
        minimum_activity_thresold,
        requirements,
        max_trade_amount,
        max_allowed_days
      );
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="tierTable.title.actions" />,
    key: "actions",
    width: 100,
    render: (object) => renderCell(object, "TierActionCell", "id"),
  },
  {
    title: <IntlMessages id="tierTable.title.tier_step" />,
    key: "tier_step",
    width: 100,
    dataIndex: "tier_step",
    render: (object) => <span>Tier&nbsp; {object}</span>,
  },
  {
    title: <IntlMessages id="tierTable.title.daily_withdraw_limit" />,
    key: "daily_withdraw_limit",
    width: 100,
    render: (object) => renderCell(object, "TextCell", "daily_withdraw_limit"),
  },
  {
    title: <IntlMessages id="tierTable.title.monthly_withdraw_limit" />,
    key: "monthly_withdraw_limit",
    width: 100,
    render: (object) =>
      renderCell(object, "TextCell", "monthly_withdraw_limit"),
  },
  {
    title: <IntlMessages id="tierTable.title.minimum_activity_thresold" />,
    key: "minimum_activity_thresold",
    width: 100,
    render: (object) =>
      renderCell(
        object,
        "TierThresholdCell",
        "id",
        "tier_step",
        "daily_withdraw_limit",
        "monthly_withdraw_limit",
        "minimum_activity_thresold",
        "requirements",
        "requirements2",
        "max_trade_amount",
        "max_allowed_days"
      ),
  },
  {
    title: <IntlMessages id="tierTable.title.requirements" />,
    key: "requirements",
    width: 100,
    render: (object) =>
      renderCell(
        object,
        "TierReqCell",
        "id",
        "tier_step",
        "daily_withdraw_limit",
        "monthly_withdraw_limit",
        "minimum_activity_thresold",
        "requirements",
        "requirements_two"
      ),
  },
];

const tierTableInfos = [
  {
    title: "Account Tiers",
    value: "tiersTable",
    columns: clone(columns),
  },
];

export { columns, tierTableInfos };
