import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, beer_name = null, beer_price = null, desc = null) => {
    const value = object[key];
    const name = object[beer_name];
    const price = object[beer_price];
    const description = object[desc];

    switch (type) {
        case 'ActionCell':
            return ActionCell(value, name, price, description);
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
    key: 'slug',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'slug')
}, {
    title: <IntlMessages id="staticPageTable.title.title" />,
    key: 'title',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'title')
}, {
    title: <IntlMessages id="staticPageTable.title.updatedOn" />,
    key: 'updatedOn',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'updatedOn')
}, {
    title: <IntlMessages id="staticPageTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'ActionCell', 'id', 'name', 'description', 'price')
}];

const staticPagesInfos = [
    {
        title: 'Static Pages',
        value: 'StaticPagesTable',
        columns: clone(columns)
    }
];

export { columns, staticPagesInfos };
