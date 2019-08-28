import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="walletTable.title.coin_id" />,
        key: 'coin_id',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'coin_id')
    },
    {
        title: <IntlMessages id="walletTable.title.send_address" />,
        key: 'send_address',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'send_address')
    },
    {
        title: <IntlMessages id="walletTable.title.receive_address" />,
        key: 'receive_address',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'receive_address')
    },
    {
        title: <IntlMessages id="walletTable.title.balance" />,
        key: 'balance',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'balance')
    }
];

const dashboardTableinfos = [
    {
        title: 'Wallet Dashboard',
        value: 'dashboardTable',
        columns: clone(columns)
    }
];

export { columns, dashboardTableinfos };
