import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, BlogActionCell, DateCell, TagsCell, BlogSwitchCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, blog_title = null, authorName = null, tag = null,
    created = null, desc = null, id = null, image = null, feature = null) => {
    const value = object[key];
    const title = object[blog_title];
    const admin_name = object[authorName];
    const tags = object[tag];
    const created_at = object[created];
    const description = object[desc];
    const admin_id = object[id];
    const cover_image = object[image];
    const is_featured = object[feature]

    switch (type) {
        case 'DateCell':
            return DateCell(value, created_at);
        case 'TagsCell':
            return TagsCell(value, title, admin_name, tags, created_at, description,
                admin_id, cover_image, is_featured);
        case 'BlogActionCell':
            return BlogActionCell(value, title, admin_name, tags, created_at, description,
                admin_id, cover_image, is_featured);
        case 'BlogSwitchCell':
            return BlogSwitchCell(value, title, admin_name, tags, created_at, description,
                admin_id, cover_image, is_featured);
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
    key: 'admin_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'admin_name')
}, {
    title: <IntlMessages id="blogTable.title.tags" />,
    key: 'tags',
    width: 100,
    render: object => renderCell(object, 'TagsCell', 'tags')
}, {
    title: <IntlMessages id="blogTable.title.created_at" />,
    key: 'created_at',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="blogTable.title.is_featured" />,
    key: 'is_featured',
    width: 100,
    render: object => renderCell(object, 'BlogSwitchCell', 'id', 'title', 'admin_name', 'tags', 'created_at',
        'description', 'admin_id', 'cover_image', 'is_featured')
}, {
    title: <IntlMessages id="blogTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'BlogActionCell', 'id', 'title', 'admin_name', 'tags', 'created_at',
        'description', 'admin_id', 'cover_image', 'is_featured')
}];

const blogsTableInfos = [
    {
        title: 'Blogs',
        value: 'blogsTable',
        columns: clone(columns)
    }
];

export { columns, blogsTableInfos };
