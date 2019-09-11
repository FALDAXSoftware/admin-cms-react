import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, TierThresholdCell, DateCell, TierReqCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, tier = null, dailyLimit = null, monthlyLimit = null,
    minThreshold = null, req = null) => {
    const value = object[key];
    const tier_step = object[tier];
    const daily_withdraw_limit = object[dailyLimit];
    const monthly_withdraw_limit = object[monthlyLimit];
    const minimum_activity_thresold = object[minThreshold];
    const requirements = object[req];

    switch (type) {
        case 'DateCell':
            return DateCell(value, tier_step, daily_withdraw_limit, monthly_withdraw_limit,
                minimum_activity_thresold, requirements);
        case 'TierReqCell':
            return TierReqCell(value, tier_step, daily_withdraw_limit, monthly_withdraw_limit,
                minimum_activity_thresold, requirements);
        case 'TierThresholdCell':
            return TierThresholdCell(value, tier_step, daily_withdraw_limit, monthly_withdraw_limit,
                minimum_activity_thresold, requirements);
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
    title: <IntlMessages id="tierTable.title.daily_withdraw_limit" />,
    key: 'daily_withdraw_limit',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'daily_withdraw_limit')
}, {
    title: <IntlMessages id="tierTable.title.monthly_withdraw_limit" />,
    key: 'monthly_withdraw_limit',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'monthly_withdraw_limit')
}, {
    title: <IntlMessages id="tierTable.title.minimum_activity_thresold" />,
    key: 'minimum_activity_thresold',
    width: 100,
    render: object => renderCell(object, 'TierThresholdCell', 'id', 'tier_step', 'daily_withdraw_limit',
        'monthly_withdraw_limit', 'minimum_activity_thresold', 'requirements')
}, {
    title: <IntlMessages id="tierTable.title.requirements" />,
    key: 'requirements',
    width: 100,
    render: object => renderCell(object, 'TierReqCell', 'id', 'tier_step', 'daily_withdraw_limit',
        'monthly_withdraw_limit', 'minimum_activity_thresold', 'requirements')
}];

const tierTableInfos = [
    {
        title: 'Account Tiers',
        value: 'tiersTable',
        columns: clone(columns)
    }
];

export { columns, tierTableInfos };
