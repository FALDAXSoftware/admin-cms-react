import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateTimeCell, TransactionTypeCell, TagsCell,PrecisionCell, ToolTipsCell, TransactionIdHashCell
} from '../../../components/tables/helperCells';
import { Icon } from 'antd';

const renderCell = (object, type, key, user = null, source = null, destination = null, amt = null,
    tras_type = null, createdOn = null, transactionID = null, coin = null, code = null) => {
    const value = object[key];
    const email = object[user];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[amt];
    const transaction_type = object[tras_type];
    const created_at = object[createdOn];
    const transaction_id = object[transactionID];
    const coin_id = object[coin];
    const coin_code = object[code];

    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(value);
        case 'TransactionTypeCell':
            return TransactionTypeCell(value, email, source_address, destination_address,
                amount, transaction_type, created_at, transaction_id, coin_id);
        case 'TagsCell':
            return TagsCell(value, email, source_address, destination_address,
                amount, transaction_type, created_at, transaction_id, coin_id);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="transactionTable.title.created_at" />,
    key: 'created_at',
    width: 150,
   align:"left",
    sorter: true,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
}, {
    title: <IntlMessages id="transactionTable.title.transactionId" />,
    key: 'transaction_id',
    width: 450,
    align:"left",
    render: object => ToolTipsCell(TransactionIdHashCell(object["coin_code"],object["transaction_id"]))
}, {
    title: <IntlMessages id="transactionTable.title.email" />,
    key: 'email',
    width: 250,
    align:"left",
    sorter: true,
    dataIndex:"email",
    render:data=>ToolTipsCell(data)
}, {
    title: <IntlMessages id="transactionTable.title.source_address" />,
    key: 'source_address',
    width: 300,
   align:"left",
    render: object => renderCell(object, 'TextCell', 'source_address')
}, {
    title: <IntlMessages id="transactionTable.title.destination_address" />,
    key: 'destination_address',
    width: 300,
    align:"left",
    render: object => renderCell(object, 'TextCell', 'destination_address')
}, {
    title: <IntlMessages id="transactionTable.title.amount" />,
    key: 'amount',
    width: 100,
    align:"left",
    sorter: true,
    dataIndex:"amount",
    render:(data)=>PrecisionCell(data)
}, {
    title: <IntlMessages id="transactionTable.title.coin" />,
    key: 'coin',
    width: 100,
    align:"left",
    render: object => renderCell(object, 'TextCell', 'coin')
}, {
    title: <IntlMessages id="transactionTable.title.transactionType" />,
    key: 'transaction_type',
    width: 100,
    align:"left",
    dataIndex:"transaction_type",
    render: object =><span className={"camel-case"+" "+(object.toLowerCase()=="send"?"field-error":"color-green")}><Icon type={"arrow-"+(object.toLowerCase()=="send"?"up":"down")} />&nbsp;{object}</span>
},
// {
//     title: <IntlMessages id="transactionTable.title.transactionFees" />,
//     key: 'transaction_fees',
//     width: 150,
//     align:"left",
//     dataIndex:"transaction_fees",
//     // render:(data)=>PrecisionCell(data)
// },
{
    title: <IntlMessages id="tradeTable.title.faldax_fees" />,
    key: 'faldax_fees',
    width: 150,
    align:"left",
    render:(data)=>data["transaction_type"]=="send"?PrecisionCell(data["faldax_fee"]):"-"
},
{
    title: <IntlMessages id="tradeTable.title.network_fees" />,
    key: 'network_fees',
    width: 150,
    align:"left",
    render:(data)=>data["transaction_type"]=="send"?PrecisionCell(data["network_fees"]):"-"
},
];

const transactionTableInfos =
    {
        title: 'Transactions',
        value: 'TransactionTable',
        columns: clone(columns)
    };


export { columns, transactionTableInfos };
