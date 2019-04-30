import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, KYCActionCell, KYCStatusCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailId = null,
    response = null, details = null, fDoc = null, bDoc = null, ssnNum = null,
    w_response = null, add = null, countryName = null, cityName = null, zipcode = null,
    dateOfBirth = null, idType = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const direct_response = object[response];
    const kycDoc_details = object[details];
    const front_doc = object[fDoc];
    const back_doc = object[bDoc];
    const ssn = object[ssnNum];
    const webhook_response = object[w_response];
    const address = object[add];
    const country = object[countryName];
    const city = object[cityName];
    const zip = object[zipcode];
    const dob = object[dateOfBirth];
    const id_type = object[idType];

    switch (type) {
        case 'KYCStatusCell':
            return KYCStatusCell(value, first_name, last_name, email, direct_response,
                kycDoc_details, front_doc, back_doc, ssn, webhook_response, address,
                country, city, zip, dob, id_type);
        case 'KYCActionCell':
            return KYCActionCell(value, first_name, last_name, email, direct_response,
                kycDoc_details, front_doc, back_doc, ssn, webhook_response, address,
                country, city, zip, dob, id_type);
        default:
            return TextCell(value);
    }
};

const columns = [{
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
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="kycTable.title.direct_response" />,
    key: 'direct_response',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'direct_response')
}, {
    title: <IntlMessages id="kycTable.title.kycDoc_details" />,
    key: 'webhook_response',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'webhook_response')
}, {
    title: <IntlMessages id="kycTable.title.status" />,
    key: 'status',
    width: 100,
    render: object => renderCell(object, 'KYCStatusCell', 'id', 'first_name'
        , 'last_name', 'email', 'direct_response', 'kycDoc_details', 'front_doc',
        'back_doc', 'ssn', 'webhook_response', 'address', 'country', 'city', 'zip',
        'dob', 'id_type'
    )
}, {
    title: <IntlMessages id="kycTable.title.actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'KYCActionCell', 'id', 'first_name'
        , 'last_name', 'email', 'direct_response', 'kycDoc_details', 'front_doc',
        'back_doc', 'ssn', 'webhook_response', 'address', 'country', 'city', 'zip',
        'dob', 'id_type'
    )
}];

const KYCInfos = [
    {
        title: 'KYC',
        value: 'KYCTable',
        columns: clone(columns)
    }
];

export { columns, KYCInfos };
