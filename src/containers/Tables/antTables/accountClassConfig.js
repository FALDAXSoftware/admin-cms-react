import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, coin_pair = null, Quantity = null, price = null,
    vol = null, createdOn = null) => {
    const value = object[key];
    const pair = object[coin_pair];
    const quantity = object[Quantity];
    const fill_price = object[price];
    const volume = object[vol];
    const created_at = object[createdOn];

    switch (type) {
        case 'DateCell':
            return DateCell(value, pair, quantity, fill_price, volume, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="accountTable.title.name" />,
        key: 'name',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'name')
    }
];

const accountClassTableinfos = [
    {
        title: 'Account Class Management',
        value: 'accountClassTable',
        columns: clone(columns)
    }
];

export { columns, accountClassTableinfos };
