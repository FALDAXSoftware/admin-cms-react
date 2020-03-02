import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeCell } from '../../../components/tables/helperCells';

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
    title: <IntlMessages id="walletTable.title.user_coin" />,
    key: 'user_coin',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'user_coin')
}, {
    title: <IntlMessages id="walletTable.title.fee" />,
    key: 'fee',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'fee')
}];

const walletFeeTableinfos = [
    {
        title: 'Wallet Fee',
        value: 'walletFeeTable',
        columns: clone(columns)
    }
];

export { columns, walletFeeTableinfos };
