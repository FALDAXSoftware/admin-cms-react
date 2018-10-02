import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, PageActionCell, StaticSwitchCell, ContentCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, page_name = null, page_title = null, desc = null, active = null) => {
    const value = object[key];
    const name = object[page_name];
    const title = object[page_title];
    const content = object[desc];
    const is_active = object[active];

    switch (type) {
        case 'StaticSwitchCell':
            return StaticSwitchCell(value, name, title, content, is_active);
        case 'ContentCell':
            return ContentCell(value, name, title, content, is_active);
        case 'PageActionCell':
            return PageActionCell(value, name, title, content, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="staticPageTable.title.srNo" />,
    key: 'id',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'id')
}, {
    title: <IntlMessages id="staticPageTable.title.slug" />,
    key: 'name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'name')
}, {
    title: <IntlMessages id="staticPageTable.title.title" />,
    key: 'title',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'title')
}, {
    title: <IntlMessages id="staticPageTable.title.content" />,
    key: 'updatedOn',
    width: 50,
    render: object => renderCell(object, 'ContentCell', 'content')
}, {
    title: <IntlMessages id="staticPageTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'PageActionCell', 'id', 'name', 'title', 'content', 'is_active')
}];

const staticPagesInfos = [
    {
        title: 'Static Pages',
        value: 'StaticPagesTable',
        columns: clone(columns)
    }
];

export { columns, staticPagesInfos };
