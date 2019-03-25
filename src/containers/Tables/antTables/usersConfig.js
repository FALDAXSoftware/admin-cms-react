import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    ImageCell,
    LinkCell,
    TextCell,
    ActionCell,
    DateCell,
    ButtonCell,
    UserSwitchCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, image = null, fname = null, lname = null,
    emailID = null, city = null, street = null, street_1 = null, phone = null,
    countryName = null, bdate = null, status = null, isKyc = null) => {
    const value = object[key];
    const profile_pic = object[image];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailID];
    const city_town = object[city];
    const street_address = object[street];
    const street_address_2 = object[street_1];
    const phone_number = object[phone];
    const country = object[countryName];
    const dob = object[bdate];
    const is_active = object[status];
    const kyc = object[isKyc];

    switch (type) {
        case 'ImageCell':
            return ImageCell(value);
        case 'DateCell':
            return DateCell(value);
        case 'LinkCell':
            return LinkCell(value);
        case 'ButtonCell':
            return ButtonCell(value);
        // case 'UserSwitchCell':
        //     return UserSwitchCell(value, profile_pic, first_name, last_name, email, city_town,
        //         street_address, street_address_2, phone_number, country, dob, is_active, kyc);
        case 'ActionCell':
            return ActionCell(value, profile_pic, first_name, last_name, email, city_town,
                street_address, street_address_2, phone_number, country, dob, is_active, kyc);
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
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="antTable.title.country" />,
        key: 'country',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'country')
    },
    // {
    //     title: <IntlMessages id="antTable.title.phone" />,
    //     key: 'phone',
    //     width: 200,
    //     render: object => renderCell(object, 'TextCell', 'phone_number')
    // },
    // {
    //     title: <IntlMessages id="antTable.title.referrals" />,
    //     key: 'button',
    //     width: 200,
    //     render: object => renderCell(object, 'ButtonCell', 'id')
    // },
    // {
    //     title: <IntlMessages id="antTable.title.Active" />,
    //     key: 'is_active',
    //     width: 200,
    //     render: object => renderCell(object, 'UserSwitchCell', 'id', 'profile_pic', 'first_name',
    //         'last_name', 'email', 'city_town', 'street_address', 'street_address_2', 'phone_number',
    //         'country', 'dob', 'is_active', 'kyc')
    // },
    {
        title: <IntlMessages id="antTable.title.details" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'ActionCell', 'id', 'profile_pic', 'first_name', 'last_name', 'email', 'city_town',
            'street_address', 'street_address_2', 'phone_number', 'country', 'dob', 'is_active', 'kyc')
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
