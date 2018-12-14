import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, ContentCell, CoinReqActionCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null, emailId = null, date = null, msg = null, reqUrl = null) => {
    const value = object[key];
    const coin_name = object[name];
    const email = object[emailId];
    const target_date = object[date];
    const message = object[msg];
    const url = object[reqUrl];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'ContentCell':
            return ContentCell(value);
        case 'CoinReqActionCell':
            return CoinReqActionCell(value, coin_name, email, target_date, message, url);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.name" />,
        key: 'coin_name',
        width: 100,
        render: object => renderCell(object, 'ContentCell', 'coin_name')
    },
    {
        title: <IntlMessages id="coinTable.title.email" />,
        key: 'email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="coinTable.title.target_date" />,
        key: 'target_date',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'target_date')
    },
    {
        title: <IntlMessages id="coinTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'CoinReqActionCell', 'id', 'coin_name', 'email', 'target_date', 'message', 'url')
    }
];

const coinReqTableInfos = [
    {
        title: 'Coin Requests',
        value: 'CoinsTable',
        columns: clone(columns)
    }
];

export { columns, coinReqTableInfos };
