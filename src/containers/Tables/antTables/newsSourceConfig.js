import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, NewsSwitchCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, image = null, news_title = null, news_link = null, posted = null,
    desc = null, active = null, source = null) => {
    const value = object[key];
    const cover_image = object[image];
    const title = object[news_title];
    const link = object[news_link];
    const posted_at = object[posted];
    const description = object[desc];
    const is_active = object[active];
    const owner = object[source];

    switch (type) {
        case 'NewsSwitchCell':
            return NewsSwitchCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="newsTable.title.source_name" />,
        key: 'title',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'title')
    },
    {
        title: <IntlMessages id="newsTable.title.slug" />,
        key: 'slug',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'slug')
    },
    {
        title: <IntlMessages id="newsTable.title.is_active" />,
        key: 'is_active',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'NewsSourceSwitchCell', 'is_active')
    }
];

const newsSourceTableInfos = [
    {
        title: 'News Source',
        value: 'NewsSourceTable',
        columns: clone(columns)
    }
];

export { columns, newsSourceTableInfos };
