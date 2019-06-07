import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, NewsSourceSwitchCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, source = null, news_slug = null, active = null) => {
    const value = object[key];
    const source_name = object[source];
    const slug = object[news_slug];
    const is_active = object[active];

    switch (type) {
        case 'NewsSourceSwitchCell':
            return NewsSourceSwitchCell(value, source_name, slug, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="newsTable.title.source_name" />,
        key: 'source_name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'source_name')
    },
    {
        title: <IntlMessages id="newsTable.title.slug" />,
        key: 'slug',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'slug')
    },
    {
        title: <IntlMessages id="newsTable.title.active" />,
        key: 'is_active',
        width: 100,
        render: object => renderCell(object, 'NewsSourceSwitchCell', 'id', 'source_name', 'slug', 'is_active')
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
