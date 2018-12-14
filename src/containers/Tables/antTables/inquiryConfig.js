import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ContentCell, InquiryActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailId = null,
    msg = null, created = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const message = object[msg];
    const created_at = object[created];

    switch (type) {
        case 'ContentCell':
            return ContentCell(value);
        case 'InquiryActionCell':
            return InquiryActionCell(value, first_name, last_name, email, message, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="inquiryTable.title.first_name" />,
        key: 'first_name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'first_name')
    },
    {
        title: <IntlMessages id="inquiryTable.title.last_name" />,
        key: 'last_name',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'last_name')
    },
    {
        title: <IntlMessages id="inquiryTable.title.email" />,
        key: 'email',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="blogTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'InquiryActionCell', 'id', 'first_name', 'last_name', 'email', 'message',
            'created_at')
    }
];

const inquiryTableInfos = [
    {
        title: 'Inquiries',
        value: 'InquiryTable',
        columns: clone(columns)
    }
];

export { columns, inquiryTableInfos };
