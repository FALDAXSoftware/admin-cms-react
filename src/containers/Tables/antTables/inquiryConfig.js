import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ContentCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'ContentCell':
            return ContentCell(value);
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
        title: <IntlMessages id="inquiryTable.title.message" />,
        key: 'message',
        width: 200,
        render: object => renderCell(object, 'ContentCell', 'message')
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
