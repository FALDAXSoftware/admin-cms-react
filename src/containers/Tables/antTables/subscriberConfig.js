import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, SubscriberActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, emailId = null, is_news = null, created = null) => {
    const value = object[key];
    const email = object[emailId];
    const is_news_feed = object[is_news];
    const created_at = object[created];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'SubscriberActionCell':
            return SubscriberActionCell(value, email, is_news_feed, created_at);
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
    }, {
        title: <IntlMessages id="subscribeTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'SubscriberActionCell', 'id', 'email', 'is_news_feed', 'created_at')
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
