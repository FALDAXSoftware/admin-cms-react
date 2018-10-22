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
        title: <IntlMessages id="orderTable.title.pair" />,
        key: 'symbol',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'symbol')
    },
    {
        title: <IntlMessages id="orderTable.title.quantity" />,
        key: 'quantity',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'quantity')
    },
    {
        title: <IntlMessages id="orderTable.title.fill_price" />,
        key: 'fill_price',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'fill_price')
    },
    {
        title: <IntlMessages id="orderTable.title.volume" />,
        key: 'stop_price',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'stop_price')
    },
    {
        title: <IntlMessages id="orderTable.title.created_at" />,
        key: 'created_at',
        width: 100,
        render: object => renderCell(object, 'DateCell', 'created_at')
    },
];

const sellOrderTableInfos = [
    {
        title: 'User Sell Orders',
        value: 'userOrderTable',
        columns: clone(columns)
    }
];

export { columns, sellOrderTableInfos };
