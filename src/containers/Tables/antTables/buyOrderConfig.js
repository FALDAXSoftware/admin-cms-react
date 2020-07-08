import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeSecCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, coin_pair = null, Quantity = null, price = null,
    vol = null, createdOn = null) => {
    const value = object[key];
    const pair = object[coin_pair];
    const quantity = object[Quantity];
    const fill_price = object[price];
    const volume = object[vol];
    const created_at = object[createdOn];

    switch (type) {
        case 'DateTimeSecCell':
            return DateTimeSecCell(value, pair, quantity, fill_price, volume, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="orderTable.title.created_at" />,
    key: 'created_at',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'DateTimeSecCell', 'created_at')
}, {
    title: <IntlMessages id="orderTable.title.pair" />,
    key: 'symbol',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'symbol')
}, {
    title: <IntlMessages id="orderTable.title.quantity" />,
    key: 'quantity',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'quantity')
}, {
    title: <IntlMessages id="orderTable.title.limit_price" />,
    key: 'limit_price',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'limit_price')
}, {
    title: <IntlMessages id="orderTable.title.stop_price" />,
    key: 'stop_price',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'stop_price')
}, {
    title: <IntlMessages id="orderTable.title.fill_price" />,
    key: 'fill_price',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'fill_price')
}];

const buyOrderTableInfos = [
    {
        title: 'User Buy Orders',
        value: 'userOrderTable',
        columns: clone(columns)
    }
];

export { columns, buyOrderTableInfos };
