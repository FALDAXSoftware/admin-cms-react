import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    UserImageCell,
    LinkCell,
    TextCell,
    ActiveUserActionCell,
    TierCell,
    ReferralCell,
    DateTimeCell,
    ToolTipsCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, image = null, fname = null, lname = null,
    emailID = null, city = null, street = null, street_1 = null, phone = null,
    countryName = null, bdate = null, status = null, isKyc = null, format = null, tier = null,
    aClass = null, stateName = null, referrals = null, created = null, deleted = null) => {
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
    const date_format = object[format];
    const account_tier = object[tier];
    const account_class = object[aClass];
    const state = object[stateName];
    const no_of_referrals = object[referrals]
    const created_at = object[created]
    const deleted_at = object[deleted];

    switch (type) {
        case 'UserImageCell':
            return UserImageCell(value);
        case 'DateCell':
            return DateTimeCell(value);
        case 'LinkCell':
            return LinkCell(value);
        case 'TierCell':
            return TierCell(value);
        case 'ReferralCell':
            return ReferralCell(value);
        case 'ActiveUserActionCell':
            return ActiveUserActionCell(value, profile_pic, first_name, last_name, email, city_town,
                street_address, street_address_2, phone_number, country, dob, is_active, kyc,
                date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 120,
    render: object => renderCell(object,
        'ActiveUserActionCell', 'id', 'profile_pic', 'first_name', 'last_name', 'email', 'city_town',
        'street_address', 'street_address_2', 'phone_number', 'country', 'dob', 'is_active', 'kyc',
        'date_format', 'account_tier', 'account_class', 'state', 'no_of_referrals', 'created_at',
        'deleted_at')
},
{
    title: <IntlMessages id="userTable.title.id" />,
    align:"left",
    ellipsis:true,
    key: 'uuid',
    width: 75,
    render: object => renderCell(object, 'TextCell', 'uuid')
} , 
 {
    title: <IntlMessages id="userTable.title.created_at" />,
    align:"left",
    ellipsis:true,
    key: 'created_at',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
},
// {
//     title: "",
//    align:"left",
//     ellipsis:true,
//     key: 'profile_pic',
//     width: 75,
//     className: 'isoImageCell',
//     render: object => renderCell(object, 'UserImageCell', 'profile_pic')
// },
 {
    title: <IntlMessages id="antTable.title.name" />,
   align:"left",
    ellipsis:true,
    key: 'first_name',
    width: 200,
    sorter: true,
    render: object =>ToolTipsCell(object['first_name']+" "+object['last_name'])
}, 
{
    title: <IntlMessages id="antTable.title.email" />,
    align:"left",
    key: 'email',
    width: 250,
    ellipsis:true,
    sorter: true,
    dataIndex:'email',
    render:(value)=>ToolTipsCell(value)
}, {
    title: <IntlMessages id="antTable.title.country" />,
   align:"left",
    ellipsis:true,
    key: 'country',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'country')
}, {
    title: <IntlMessages id="antTable.title.state" />,
    align:"left",
    ellipsis:true,
    key: 'state',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'state')
},
{
    title: <IntlMessages id="antTable.title.zip" />,
     align:"left",
    ellipsis:true,
    key: 'postal_code',
    width: 150,
    render: object => renderCell(object, 'TextCell', 'postal_code')
},{
    title: <IntlMessages id="antTable.title.tier" />,
    align:"left",
    ellipsis:true,
    key: 'account_tier',
    width: 150,
    render: object => renderCell(object, 'TierCell', 'account_tier')
}, {
    title: <IntlMessages id="antTable.title.numReferral" />,
   align:"left",
    ellipsis:true,
    key: 'no_of_referrals',
    width: 150,
    render: object => renderCell(object, 'ReferralCell', 'no_of_referrals')
}];

const tableinfos = [
    {
        title: 'Users',
        value: 'UsersTable',
        columns: clone(columns)
    }
];

export { columns, tableinfos };
