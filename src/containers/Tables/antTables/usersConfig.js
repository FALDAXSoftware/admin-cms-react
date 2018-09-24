import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../../components/utility/intlMessages';
import {
    ImageCell,
    TextCell,
    ActionCell
} from '../../../../components/tables/helperCells';

const renderCell = (object, type, key, beer_name = null, beer_price = null, desc = null, img = null) => {
    const value = object[key];
    const name = object[beer_name];
    const price = object[beer_price];
    const description = object[desc];
    const beer_image = object[img];

    switch (type) {
        case 'ImageCell':
            return ImageCell(value);
        case 'ActionCell':
            return ActionCell(value, name, price, description, beer_image);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.beerImage" />,
    key: 'Image',
    width: '1%',
    className: 'isoImageCell',
    render: (object) => renderCell(object, 'ImageCell', 'image')
},
{
    title: <IntlMessages id="antTable.title.name" />,
    key: 'name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'name')
},
{
    title: <IntlMessages id="antTable.title.beerDescription" />,
    key: 'description',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'description')
},
{
    title: <IntlMessages id="antTable.title.beerPrice" />,
    key: 'price',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'price')
},
{
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'ActionCell', 'id', 'image', 'name', 'description', 'price')
}];

const tableinfos = [
    {
        title: 'Users',
        value: 'UsersTable',
        columns: clone(columns)
    }
];

export { columns, tableinfos };
