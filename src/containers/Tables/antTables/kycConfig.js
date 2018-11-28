import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, ContentCell, KYCActionCell, KYCStatusCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailId = null, response = null, details = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const direct_response = object[response];
    const kycDoc_details = object[details];

    switch (type) {
        case 'ContentCell':
            return ContentCell(value);
        case 'KYCStatusCell':
            return KYCStatusCell(value, first_name, last_name, email, direct_response, kycDoc_details);
        case 'KYCActionCell':
            return KYCActionCell(value, first_name, last_name, email, direct_response, kycDoc_details);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="kycTable.title.name" />,
    key: 'first_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'first_name')
}, {
    title: <IntlMessages id="kycTable.title.last_name" />,
    key: 'last_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'last_name')
}, {
    title: <IntlMessages id="kycTable.title.email" />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="kycTable.title.direct_response" />,
    key: 'direct_response',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'direct_response')
}, {
    title: <IntlMessages id="kycTable.title.kycDoc_details" />,
    key: 'kycDoc_details',
    width: 100,
    render: object => renderCell(object, 'ContentCell', 'kycDoc_details')
}, {
    title: <IntlMessages id="kycTable.title.status" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'KYCStatusCell', 'id', 'first_name'
        , 'last_name', 'email', 'direct_response', 'kycDoc_details'
    )
}, {
    title: <IntlMessages id="kycTable.title.actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'KYCActionCell', 'id', 'first_name'
        , 'last_name', 'email', 'direct_response', 'kycDoc_details'
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
