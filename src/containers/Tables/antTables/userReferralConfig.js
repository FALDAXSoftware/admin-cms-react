import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ReferralNameCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, Name = null, isDeleted = null) => {
    const value = object[key];
    const full_name = object[Name];
    const deleted_at = object[isDeleted]

    switch (type) {
        case 'ReferralNameCell':
            return ReferralNameCell(value, full_name, deleted_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Name" />,
    key: 'full_name',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'ReferralNameCell', 'id', 'full_name', 'deleted_at')
}, {
    title: <IntlMessages id="antTable.title.email" />,
    key: 'email',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="antTable.title.country" />,
    key: 'country',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'country')
}];

const userReferralInfos = [
    {
        title: 'Referred Users',
        value: 'ReferralsTable',
        columns: clone(columns)
    }
];

export { columns, userReferralInfos };
