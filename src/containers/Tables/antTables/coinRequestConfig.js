import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, ContentCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'ContentCell':
            return ContentCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.name" />,
        key: 'coin_name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'coin_name')
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
        title: <IntlMessages id="coinTable.title.message" />,
        key: 'message',
        width: 200,
        render: object => renderCell(object, 'ContentCell', 'message')
    },
    {
        title: <IntlMessages id="coinTable.title.url" />,
        key: 'url',
        width: 200,
        render: object => renderCell(object, 'LinkCell', 'url')
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
