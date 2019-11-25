import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateTimeCell, TransactionTypeCell, TagsCell, TransactionHashCell
} from '../../../components/tables/helperCells';

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
        case 'TransactionHashCell':
            return TransactionHashCell(value, email, source_address, destination_address,
                amount, transaction_type, created_at, transaction_id, coin_id, coin_code);
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
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
}, {
    title: <IntlMessages id="transactionTable.title.transactionId" />,
    key: 'transaction_id',
    width: 200,
    render: object => renderCell(object, 'TransactionHashCell', 'id', 'source_address',
        'destination_address', 'amount', 'transaction_type', 'created_at',
        'transaction_id', 'coin_id', 'coin_code')
}, {
    title: <IntlMessages id="transactionTable.title.email" />,
    key: 'email',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="transactionTable.title.source_address" />,
    key: 'source_address',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'source_address')
}, {
    title: <IntlMessages id="transactionTable.title.destination_address" />,
    key: 'destination_address',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'destination_address')
}, {
    title: <IntlMessages id="transactionTable.title.amount" />,
    key: 'amount',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'amount')
}, {
    title: <IntlMessages id="transactionTable.title.coin" />,
    key: 'coin',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'coin')
}, {
    title: <IntlMessages id="transactionTable.title.transactionType" />,
    key: 'transaction_type',
    width: 100,
    render: object => renderCell(object, 'TransactionTypeCell', 'transaction_type')
},
{
    title: <IntlMessages id="transactionTable.title.transactionFees" />,
    key: 'transaction_fees',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'transaction_fees')
}
];

const transactionTableInfos = [
    {
        title: 'Transactions',
        value: 'TransactionTable',
        columns: clone(columns)
    }
];

export { columns, transactionTableInfos };
