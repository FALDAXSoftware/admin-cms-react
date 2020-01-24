import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, createdOn = null, t_type = null, source = null,
    destination = null, Amount = null) => {
    const value = object[key];
    const created_at = object[createdOn];
    const transaction_type = object[t_type];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[Amount];
    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(value, created_at, transaction_type, source_address,
                destination_address, amount);
        case 'TextCell':
            return TextCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="walletTable.title.created_at" />,
    key: 'created_at',
    ellipsis:true,
    width: 150,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
}, {
    title: <IntlMessages id="walletTable.title.transaction_type" />,
    key: 'transaction_type',
    dataIndex:'transaction_type',
    ellipsis:true,
    width: 75,
    render:(data)=><span className="camel-case">{data}</span>
}, {
    title: <IntlMessages id="walletTable.title.source_address" />,
    key: 'source_address',
    ellipsis:true,
    width: 300,
    render: object => renderCell(object, 'TextCell', 'source_address')
}, {
    title: <IntlMessages id="walletTable.title.destination_address" />,
    key: 'destination_address',
    ellipsis:true,
    width: 300,
    render: object => renderCell(object, 'TextCell', 'destination_address')
}, {
    title: <IntlMessages id="walletTable.title.amount" />,
    key: 'amount',
    ellipsis:true,
    width: 150,
    render: object => renderCell(object, 'TextCell', 'amount')
}];

const walletTableInfos = [
    {
        title: 'Wallet History',
        value: 'WalletTable',
        columns: clone(columns)
    }
];

export { columns, walletTableInfos };
