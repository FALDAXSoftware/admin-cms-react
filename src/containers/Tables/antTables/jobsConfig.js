import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, JobActionCell, JobSwitchCell, JobButtonCell, LocationCell, DateTimeCell
} from '../../../components/tables/helperCells';
import { isAllowed } from '../../../helpers/accessControl';

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
            return DateTimeCell(value);
        case 'LocationCell':
            return LocationCell(value);
        case 'JobButtonCell':
            return JobButtonCell(value);
        case 'JobSwitchCell':
            return JobSwitchCell(value, position, location, short_desc, job_desc, category_id, is_active, category,!isAllowed("update_job"));
        case 'JobActionCell':
            return JobActionCell(value, position, location, short_desc, job_desc, category_id, is_active, category);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="jobTable.title.Actions" />,
    key: 'action',
    width: 100,
   align:"left",
    render: object => renderCell(object,
        'JobActionCell', 'id', 'position', 'location', 'short_desc', 'job_desc',
        'category_id', 'is_active', 'category')
}, {
    title: <IntlMessages id="jobTable.title.created_at" />,
    key: 'created_at',
    sorter: true,
   align:"left",
    width: 150,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="jobTable.title.position" />,
    key: 'position',
    width: 200,
   align:"left",
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'position')
},
{
    title: <IntlMessages id="jobTable.title.category" />,
    key: 'category',
    width: 200,
    align:"left",
    render: object => renderCell(object, 'TextCell', 'category')
}, {
    title: <IntlMessages id="jobTable.title.location" />,
    key: 'location',
   align:"left",
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'LocationCell', 'location')
}, {
    title: <IntlMessages id="jobTable.title.active" />,
    key: 'is_active',
    align:"left",
    width: 100,
    render: object =>{
        return renderCell(object, 'JobSwitchCell', 'id', 'position', 'location',
        'short_desc', 'job_desc', 'category_id', 'is_active', 'category')
    } 
}, {
    title: <IntlMessages id="jobTable.title.app" />,
    key: 'button',
    align:"left",
    width: 150,
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
