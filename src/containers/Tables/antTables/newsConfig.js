import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, StaticImageCell, NewsDescCell, NewsSwitchCell, NewsLinkCell
} from '../../../components/tables/helperCells';
import { isAllowed } from '../../../helpers/accessControl';

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
        case 'DateCell':
            return DateCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        case 'NewsLinkCell':
            return NewsLinkCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        case 'StaticImageCell':
            return StaticImageCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        case 'NewsDescCell':
            return NewsDescCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        case 'NewsSwitchCell':
            return NewsSwitchCell(value, cover_image, title, link, posted_at, description, is_active, owner);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: '',
    key: 'cover_image',
    width: 100,
   align:"left",
    render: object => renderCell(object, 'StaticImageCell', 'cover_image')
}, {
    title: <IntlMessages id="newsTable.title.title" />,
   align:"left",
    key: 'title',
    width: 200,
    render: object => renderCell(object, 'NewsDescCell', 'title')
}, {
    title: <IntlMessages id="newsTable.title.link" />,
   align:"left",
    key: 'link',
    width: 200,
    render: object => renderCell(object, 'NewsLinkCell', 'link')
}, {
    title: <IntlMessages id="newsTable.title.posted_at" />,
   align:"left",
    key: 'posted_at',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'posted_at')
}, {
    title: <IntlMessages id="newsTable.title.active" />,
   align:"left",
    key: 'is_active',
    width: 100,
    render: object => {
        if (isAllowed("update_news_status")) {
            return renderCell(object, 'NewsSwitchCell', 'id', 'cover_image', 'title',
            'link', 'posted_at', 'description', 'is_active', 'owner')
        } else {
            return <span>{(object['is_active'])?"Active":"Inactive"}</span>
        }
    }
}];

const newsTableInfos = [
    {
        title: 'News',
        value: 'NewsTable',
        columns: clone(columns)
    }
];

export { columns, newsTableInfos };
