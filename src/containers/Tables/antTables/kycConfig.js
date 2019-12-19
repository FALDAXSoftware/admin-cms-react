import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, KYCActionCell, TierCell, DateCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, IDM_ID = null, fname = null, lname = null, emailId = null,
    response = null, details = null, w_response = null, add = null, countryName = null,
    cityName = null, zipcode = null, dateOfBirth = null, idType = null, createdOn = null) => {
    const value = object[key];
    const mtid = object[IDM_ID];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const direct_response = object[response];
    const kycDoc_details = object[details];
    const webhook_response = object[w_response];
    const address = object[add];
    const country = object[countryName];
    const city = object[cityName];
    const zip = object[zipcode];
    const dob = object[dateOfBirth];
    const id_type = object[idType];
    const created_at = object[createdOn];

    switch (type) {
        case 'KYCActionCell':
            return KYCActionCell(value, mtid, first_name, last_name, email, direct_response,
                kycDoc_details, webhook_response, address,
                country, city, zip, dob, id_type, created_at);
        case 'TierCell':
            return TierCell(value);
        case 'DateCell':
            return DateCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="kycTable.title.actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'KYCActionCell', 'id', 'mtid', 'first_name'
        , 'last_name', 'email', 'direct_response', 'kycDoc_details', 'webhook_response', 'address',
        'country', 'city', 'zip', 'dob', 'id_type', 'created_at'
    )
}, {
    title: <IntlMessages id="kycTable.title.created_at" />,
    key: 'created_at_1',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="kycTable.title.mtid" />,
    key: 'mtid',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'mtid')
}, {
    title: <IntlMessages id="kycTable.title.name" />,
    key: 'first_name',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'first_name')
}, {
    title: <IntlMessages id="kycTable.title.last_name" />,
    key: 'last_name',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'last_name')
}, {
    title: <IntlMessages id="kycTable.title.email" />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="kycTable.title.country" />,
    key: 'country',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'country')
}, {
    title: <IntlMessages id="kycTable.title.account_tier" />,
    key: 'account_tier',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TierCell', 'account_tier')
}, {
    title: <IntlMessages id="kycTable.title.direct_response" />,
    key: 'direct_response',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'direct_response')
}];

const KYCInfos = [
    {
        title: 'KYC',
        value: 'KYCTable',
        columns: clone(columns)
    }
];

export { columns, KYCInfos };
