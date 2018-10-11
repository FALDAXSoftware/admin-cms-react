import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, BlogActionCell, DateCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, blog_title = null, authorName = null, tag = null, created = null, desc = null) => {
    const value = object[key];
    const title = object[blog_title];
    const tags = object[tag];
    const created_at = object[created];
    const description = object[desc];

    switch (type) {
        case 'DateCell':
            return DateCell(created_at);
        case 'BlogActionCell':
            return BlogActionCell(value, title, tags, created_at, description);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="blogTable.title.title" />,
    key: 'title',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'title')
}, {
    title: <IntlMessages id="blogTable.title.author" />,
    key: 'author',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'author')
}, {
    title: <IntlMessages id="blogTable.title.tags" />,
    key: 'tags',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'tags')
}, {
    title: <IntlMessages id="blogTable.title.created_at" />,
    key: 'created_at',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="blogTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'BlogActionCell', 'id', 'title', 'author', 'tags', 'created_at', 'description')
}];

const blogsTableInfos = [
    {
        title: 'Blogs',
        value: 'blogsTable',
        columns: clone(columns)
    }
];

export { columns, blogsTableInfos };
