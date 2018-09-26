import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    ImageCell,
    LinkCell,
    TextCell,
    ActionCell,
    DateCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailID = null, city = null, street = null, phone = null, countryName = null, bdate = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailID];
    const city_town = object[city];
    const street_address = object[street];
    const phone_number = object[phone];
    const country = object[countryName];
    const dob = object[bdate];

    switch (type) {
        case 'ImageCell':
            return ImageCell(value);
        case 'DateCell':
            return DateCell(value);
        case 'LinkCell':
            return LinkCell(value);
        case 'ActionCell':
            return ActionCell(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="antTable.title.image" />,
        key: 'profile_pic',
        width: '1%',
        className: 'isoImageCell',
        render: object => renderCell(object, 'ImageCell', 'profile_pic')
    },
    {
        title: <IntlMessages id="antTable.title.firstName" />,
        key: 'firstName',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'first_name')
    },
    {
        title: <IntlMessages id="antTable.title.lastName" />,
        key: 'lastName',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'last_name')
    },
    {
        title: <IntlMessages id="antTable.title.email" />,
        key: 'email',
        width: 200,
        render: object => renderCell(object, 'LinkCell', 'email')
    },
    {
        title: <IntlMessages id="antTable.title.street" />,
        key: 'street',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'street_address')
    },
    {
        title: <IntlMessages id="antTable.title.city" />,
        key: 'city',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'city_town')
    },
    {
        title: <IntlMessages id="antTable.title.country" />,
        key: 'country',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'country')
    },
    {
        title: <IntlMessages id="antTable.title.phone" />,
        key: 'phone',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'phone_number')
    },
    {
        title: <IntlMessages id="antTable.title.dob" />,
        key: 'dob',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'dob')
    },
    {
        title: <IntlMessages id="antTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'ActionCell', 'id', 'first_name', 'last_name', 'email', 'city_town', 'street_address', 'phone_number', 'country', 'dob')
    }
];

const tableinfos = [
    {
        title: 'Users',
        value: 'UsersTable',
        columns: clone(columns)
    }
];

export { columns, tableinfos };
