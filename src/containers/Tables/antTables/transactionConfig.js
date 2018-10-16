import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, user = null, source = null, destination = null, amt = null,
    tras_type = null, createdOn = null, transactionID = null, coin = null) => {
    const value = object[key];
    const email = object[user];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[amt];
    const transactionType = object[tras_type];
    const created_at = object[createdOn];
    const transactionId = object[transactionID];
    const coin_id = object[coin];

    switch (type) {
        case 'DateCell':
            return DateCell(value, email, source_address, destination_address, amount, transactionType, created_at, transactionId, coin_id);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="transactionTable.title.transactionId" />,
        key: 'transactionId',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'transactionId')
    },
    {
        title: <IntlMessages id="transactionTable.title.email" />,
        key: 'email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="transactionTable.title.source_address" />,
        key: 'source_address',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'source_address')
    },
    {
        title: <IntlMessages id="transactionTable.title.destination_address" />,
        key: 'destination_address',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'destination_address')
    },
    {
        title: <IntlMessages id="transactionTable.title.amount" />,
        key: 'amount',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'amount', 'coin_id')
    },
    {
        title: <IntlMessages id="transactionTable.title.transactionType" />,
        key: 'transactionType',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'transactionType')
    },
    {
        title: <IntlMessages id="transactionTable.title.created_at" />,
        key: 'created_at',
        width: 100,
        render: object => renderCell(object, 'DateCell', 'created_at')
    },
];

const transactionTableInfos = [
    {
        title: 'Transactions',
        value: 'TransactionTable',
        columns: clone(columns)
    }
];

export { columns, transactionTableInfos };
