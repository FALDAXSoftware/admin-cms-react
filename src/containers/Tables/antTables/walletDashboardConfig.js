import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, DateTimeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'DateCell':
            return DateTimeCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="walletTable.title.coin_id" />,
    key: 'coin',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'coin')
}, {
    title: <IntlMessages id="walletTable.title.send_address" />,
    key: 'send_address',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'send_address')
}, {
    title: <IntlMessages id="walletTable.title.receive_address" />,
    key: 'receive_address',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'receive_address')
}, {
    title: <IntlMessages id="walletTable.title.balance" />,
    key: 'balance',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'balance')
}, {
    title: <IntlMessages id="walletTable.title.fee" />,
    key: 'fee',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'fee')
}, {
    title: <IntlMessages id="walletTable.title.forfeit_funds" />,
    key: 'forfeit_funds',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'forfeit_funds')
}];

const dashboardTableinfos = [
    {
        title: 'Wallet Dashboard',
        value: 'dashboardTable',
        columns: clone(columns)
    }
];

export { columns, dashboardTableinfos };
