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
        title: <IntlMessages id="subscribeTable.title.email" />,
        key: 'email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="subscribeTable.title.is_news_feed" />,
        key: 'is_news_feed',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'is_news_feed')
    },
    {
        title: <IntlMessages id="subscribeTable.title.created_at" />,
        key: 'created_at',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'created_at')
    }
];

const subscriberTableinfos = [
    {
        title: 'Subscribers',
        value: 'SubscribersTable',
        columns: clone(columns)
    }
];

export { columns, subscriberTableinfos };
