import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, PendingTierReqActionCell, FullNameTextCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, tierStep = null,
    isApproved = null, userId = null) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const tier_step = object[tierStep];
    const is_approved = object[isApproved];
    const user_id = object[userId];

    switch (type) {
        case 'PendingTierReqActionCell':
            return PendingTierReqActionCell(value, first_name, last_name, tier_step,
                is_approved, user_id);
        case 'FullNameTextCell':
            return FullNameTextCell(value, first_name, last_name);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="tierTable.title.actions" />,
    key: 'actions',
    width: 80,
    render: object => renderCell(object, 'PendingTierReqActionCell', 'id', 'first_name',
        'last_name', 'tier_step', 'is_approved', 'user_id')
},
{
    title:"Unique Key",
    key :"unique_key",
    dataIndex:"unique_key",
    width:100
},
{
    title:"SSN",
    key :"ssn",
    dataIndex:"ssn",
    width:100
},
 {
    title: <IntlMessages id="tierTable.title.first_name" />,
    key: 'first_name',
    width: 150,
    render: object => renderCell(object, 'FullNameTextCell', 'id', 'first_name', 'last_name')
}, {
    title: <IntlMessages id="tierTable.title.email" />,
    key: 'email',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'email')
},
{
    title:"Type",
    key: 'type',
    dataIndex:"type",
    width:250,
    render: object => <span>{object=="1"?"Valid ID":object=="2"?"Proof of Residence":"Social Security Number or Equivalent Govt"}</span>
}
]

const tierPendingReqTableInfos = [
    {
        title: 'Account Tier Pending Request',
        value: 'tiersTable',
        columns: clone(columns)
    }
];

export { columns, tierPendingReqTableInfos };
