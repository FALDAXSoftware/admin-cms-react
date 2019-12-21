import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, JobCatSwitchCell, JobCatActionCell } from '../../../components/tables/helperCells';
import { isAllowed } from '../../../helpers/accessControl';

const renderCell = (object, type, key, jobCat = null, active = null) => {
    const value = object[key];
    const category = object[jobCat];
    const is_active = object[active]

    switch (type) {
        case 'JobCatSwitchCell':
            return JobCatSwitchCell(value, category, is_active);
        case 'JobCatActionCell':
            return JobCatActionCell(value, category, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="jobTable.title.Actions" />,
    key: 'action',
    width: 100,
   align:"left",
    render: object => renderCell(object, 'JobCatActionCell', 'id', 'category', 'is_active')
}, {
    title: <IntlMessages id="jobTable.title.category" />,
    key: 'category',
    width: 100,
   align:"left",
    render: object => renderCell(object, 'TextCell', 'category')
}, {
    title: <IntlMessages id="jobTable.title.active" />,
    key: 'is_active',
    width: 100,
   align:"left",
    render: object => {
        if (isAllowed("update_job_category")) {
            return renderCell(object, 'JobCatSwitchCell', 'id', 'category', 'is_active')
        } else {
            return renderCell(object, 'TextCell', 'is_active')
        }
    }
}];

const jobCategoryTableInfos = [
    {
        title: 'Job Category',
        value: 'JobCategoryTable',
        columns: clone(columns)
    }
];

export { columns, jobCategoryTableInfos };
