import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, ContentCell, DateCell, JobActionCell, JobSwitchCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, title = null, loc = null, desc = null, jobDesc = null,
    active = null) => {
    const value = object[key];
    const position = object[title];
    const location = object[loc];
    const short_desc = object[desc];
    const job_desc = object[jobDesc];
    const is_active = object[active]

    switch (type) {
        case 'ContentCell':
            return ContentCell(value);
        case 'DateCell':
            return DateCell(value);
        case 'JobSwitchCell':
            return JobSwitchCell(value, position, location, short_desc, job_desc, is_active);
        case 'JobActionCell':
            return JobActionCell(value, position, location, short_desc, job_desc, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="jobTable.title.position" />,
        key: 'position',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'position')
    },
    {
        title: <IntlMessages id="jobTable.title.location" />,
        key: 'location',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'location')
    },
    {
        title: <IntlMessages id="jobTable.title.short_desc" />,
        key: 'short_desc',
        width: 200,
        render: object => renderCell(object, 'ContentCell', 'short_desc')
    },
    // {
    //     title: <IntlMessages id="jobTable.title.job_desc" />,
    //     key: 'job_desc',
    //     width: 200,
    //     render: object => renderCell(object, 'ContentCell', 'job_desc')
    // },
    {
        title: <IntlMessages id="jobTable.title.created_at" />,
        key: 'created_at',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'created_at')
    }, {
        title: <IntlMessages id="jobTable.title.active" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'JobSwitchCell', 'id', 'position', 'location', 'short_desc', 'job_desc', 'is_active')
    }, {
        title: <IntlMessages id="blogTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'JobActionCell', 'id', 'position', 'location', 'short_desc', 'job_desc', 'is_active')
    }
];

const jobsTableInfos = [
    {
        title: 'Jobs',
        value: 'JobsTable',
        columns: clone(columns)
    }
];

export { columns, jobsTableInfos };
