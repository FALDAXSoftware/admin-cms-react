import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ReferralNameCell, CollectedAmountCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, Name = null, isDeleted = null) => {
    const value = object[key];
    const full_name = object[Name];
    const deleted_at = object[isDeleted]

    switch (type) {
        case 'ReferralNameCell':
            return ReferralNameCell(value, full_name, deleted_at);
        case 'CollectedAmountCell':
            return CollectedAmountCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Name" />,
   align:"left",
    ellipsis:true,
    key: 'full_name',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'ReferralNameCell', 'id', 'full_name', 'deleted_at')
}, {
    title: <IntlMessages id="antTable.title.email" />,
   align:"left",
    ellipsis:true,
    key: 'email',
    width: 250,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="antTable.title.country" />,
   align:"left",
    ellipsis:true,
    key: 'country',
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'country')
}, {
    title: <IntlMessages id="antTable.title.collectamount" />,
   align:"left",
    ellipsis:true,
    key: 'collected_amount',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'CollectedAmountCell', 'collected_amount')
}
];

const userReferralInfos = [
    {
        title: 'Referred Users',
        value: 'ReferralsTable',
        columns: clone(columns)
    }
];

export { columns, userReferralInfos };
