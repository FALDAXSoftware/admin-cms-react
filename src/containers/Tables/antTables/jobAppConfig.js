import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, JobAppActionCell, DateTimeCell, ToolTipsCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailId = null, phone = null,
    created = null, resumeDoc = null, cover = null, linkedin = null, url = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailId];
    const phone_number = object[phone];
    const created_at = object[created];
    const resume = object[resumeDoc];
    const cover_letter = object[cover];
    const linkedin_profile = object[linkedin];
    const website_url = object[url];

    switch (type) {
        case 'DateCell':
            return DateTimeCell(value);
        case 'JobAppActionCell':
            return JobAppActionCell(value, first_name, last_name, email, phone_number,
                created_at, resume, cover_letter, linkedin_profile, website_url);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="jobTable.title.Actions" />,
    key: 'action',
    width: 100,
    align:"left",
    ellipsis:true,
    render: object => renderCell(object,
        'JobAppActionCell', 'id', 'first_name', 'last_name', 'email', 'phone_number',
        'created_at', 'resume', 'cover_letter', 'linkedin_profile', 'website_url')
}, {
    title: <IntlMessages id="jobTable.title.applied_at" />,
    key: 'created_at',
    sorter: true,
    align:"left",
    ellipsis:true,
    width: 200,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="jobTable.title.first_name" />,
    key: 'first_name',
    align:"left",
    ellipsis:true,
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'first_name')
}, {
    title: <IntlMessages id="jobTable.title.last_name" />,
    key: 'last_name',
    align:"left",
    ellipsis:true,
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'last_name')
}, {
    title: <IntlMessages id="jobTable.title.email" />,
    key: 'email',
    align:"left",
    ellipsis:true,
    width: 200,
    sorter: true,
    dataIndex:"email",
    render:data=>ToolTipsCell(data)
}, {
    title: <IntlMessages id="jobTable.title.phone_number" />,
    key: 'phone_number',
    align:"left",
    ellipsis:true,
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'phone_number')
}];

const jobAppTableInfos = 
    {
        title: 'Job Applications',
        value: 'JobAppTable',
        columns: clone(columns)
    }
;

export { columns, jobAppTableInfos };
