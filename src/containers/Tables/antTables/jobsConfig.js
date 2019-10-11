import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, JobActionCell, JobSwitchCell, JobButtonCell, LocationCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, title = null, loc = null, desc = null, jobDesc = null,
    cat = null, active = null, categoryName = null) => {
    const value = object[key];
    const position = object[title];
    const location = object[loc];
    const short_desc = object[desc];
    const job_desc = object[jobDesc];
    const category_id = object[cat];
    const is_active = object[active]
    const category = object[categoryName]

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'LocationCell':
            return LocationCell(value);
        case 'JobButtonCell':
            return JobButtonCell(value);
        case 'JobSwitchCell':
            return JobSwitchCell(value, position, location, short_desc, job_desc, category_id, is_active, category);
        case 'JobActionCell':
            return JobActionCell(value, position, location, short_desc, job_desc, category_id, is_active, category);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="jobTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'JobActionCell', 'id', 'position', 'location', 'short_desc', 'job_desc',
        'category_id', 'is_active', 'category')
}, {
    title: <IntlMessages id="jobTable.title.created_at" />,
    key: 'created_at',
    sorter: true,
    width: 200,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="jobTable.title.position" />,
    key: 'position',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'position')
}, {
    title: <IntlMessages id="jobTable.title.location" />,
    key: 'location',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'LocationCell', 'location')
}, {
    title: <IntlMessages id="jobTable.title.active" />,
    key: 'is_active',
    width: 200,
    render: object => renderCell(object, 'JobSwitchCell', 'id', 'position', 'location',
        'short_desc', 'job_desc', 'category_id', 'is_active', 'category')
}, {
    title: <IntlMessages id="jobTable.title.app" />,
    key: 'button',
    width: 200,
    render: object => renderCell(object, 'JobButtonCell', 'id')
}];

const jobsTableInfos = [
    {
        title: 'Careers',
        value: '1',
        columns: clone(columns)
    }
];

export { columns, jobsTableInfos };
