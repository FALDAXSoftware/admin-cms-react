import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, TierActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, tier = null) => {
    const value = object[key];

    switch (type) {
        case 'TierActionCell':
            return TierActionCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="tierTable.title.tier_step" />,
    key: 'tier_step',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'tier_step')
}, {
    title: <IntlMessages id="tierTable.title.first_name" />,
    key: 'first_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'first_name')
}, {
    title: <IntlMessages id="tierTable.title.email" />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email')
}];

const tierReqTableInfos = [
    {
        title: 'Account Tier Request',
        value: 'tiersTable',
        columns: clone(columns)
    }
];

export { columns, tierReqTableInfos };
