import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, JobAppActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailId = null, phone = null,
    created = null, resumeDoc = null, cover = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const phone_number = object[phone];
    const created_at = object[created];
    const resume = object[resumeDoc];
    const cover_letter = object[cover];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'JobAppActionCell':
            return JobAppActionCell(value, first_name, last_name, email, phone_number,
                created_at, resume, cover_letter);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="jobTable.title.first_name" />,
        key: 'first_name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'first_name')
    },
    {
        title: <IntlMessages id="jobTable.title.last_name" />,
        key: 'last_name',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'last_name')
    },
    {
        title: <IntlMessages id="jobTable.title.email" />,
        key: 'email',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="jobTable.title.phone_number" />,
        key: 'phone_number',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'phone_number')
    }, {
        title: <IntlMessages id="jobTable.title.applied_at" />,
        key: 'created_at',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'created_at')
    }, {
        title: <IntlMessages id="jobTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'JobAppActionCell', 'id', 'first_name', 'last_name', 'email', 'phone_number',
            'created_at', 'resume', 'cover_letter')
    }
];

const jobAppTableInfos = [
    {
        title: 'Job Applications',
        value: 'JobAppTable',
        columns: clone(columns)
    }
];

export { columns, jobAppTableInfos };
