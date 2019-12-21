import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeCell, SimplexStatusCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, paymentID = null, quoteID = null, pair = null,
    pair1 = null, emailID = null, buy = null, quant = null, fillPrice = null,
    simplexStatus = null, createdOn = null) => {
    const value = object[key];
    const payment_id = object[paymentID];
    const quote_id = object[quoteID];
    const currency = object[pair];
    const settle_currency = object[pair1];
    const email = object[emailID];
    const side = object[buy];
    const quantity = object[quant];
    const fill_price = object[fillPrice];
    const simplex_payment_status = object[simplexStatus]
    const created_at = object[createdOn];

    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(value, payment_id, quote_id, currency, settle_currency,
                email, side, quantity, fill_price, simplex_payment_status, created_at);
        case 'SimplexStatusCell':
            return SimplexStatusCell(value, payment_id, quote_id, currency, settle_currency,
                email, side, quantity, fill_price, simplex_payment_status, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [
  {
    title: <IntlMessages id="simplexTradeTable.title.email" />,
    key: "email",
    align:"center",
    width: 250,
    sorter: true,
    render: object => renderCell(object, "TextCell", "email")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.currency" />,
    key: "currency",
    align:"center",
    width: 150,
    sorter: true,
    render: object => renderCell(object, "TextCell", "currency")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.created_at" />,
    key: "created_at",
    width: 150,
    align:"center",
    sorter: true,
    render: object => renderCell(object, "DateTimeCell", "created_at")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.fill_price" />,
    key: "fill_price",
    width: 150,
    align:"center",
    sorter: true,
    render: object => renderCell(object, "TextCell", "fill_price")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.quantity" />,
    key: "quantity",
    align:"center",
    width: 150,
    sorter: true,
    render: object => <span>{object.quantity+" "+object.settle_currency}</span>
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.address" />,
    key: "address",
    width: 320,
    align:"center",
    sorter: true,
    render: object => renderCell(object, "TextCell", "address")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.payment_id" />,
    key: "payment_id",
    width: 250,
    align:"center",
    sorter: true,
    render: object => renderCell(object, "TextCell", "payment_id")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.quote_id" />,
    key: "quote_id",
    width: 250,
    align:"center",
    sorter: true,
    render: object => renderCell(object, "TextCell", "quote_id")
  },
  {
    title: <IntlMessages id="simplexTradeTable.title.simplex_payment_status" />,
    key: "simplex_payment_status",
    width: 150,
    align:"center",
    sorter: true,
    render: object =>
      renderCell(
        object,
        "SimplexStatusCell",
        "id",
        "payment_id",
        "quote_id",
        "currency",
        "settle_currency",
        "email",
        "side",
        "quantity",
        "fill_price",
        "simplex_payment_status",
        "created_at"
      )
  }
];

const simplexTableInfos = [
    {
        title: 'Simplex History',
        value: 'SimplexTable',
        columns: clone(columns)
    }
];

export { columns, simplexTableInfos };
