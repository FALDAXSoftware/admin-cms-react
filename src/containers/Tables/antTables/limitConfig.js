import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, LimitActionCell, DateTimeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, DailyWithCrypto = null, DailyWithFiat = null,
    MinWithCrypto = null, MinWithFiat = null) => {
    const value = object[key];
    const daily_withdraw_crypto = object[DailyWithCrypto];
    const daily_withdraw_fiat = object[DailyWithFiat];
    const min_withdrawl_crypto = object[MinWithCrypto];
    const min_withdrawl_fiat = object[MinWithFiat];

    switch (type) {
        case 'DateCell':
            return DateTimeCell(value);
        case 'LimitActionCell':
            return LimitActionCell(value, daily_withdraw_crypto, daily_withdraw_fiat,
                min_withdrawl_crypto, min_withdrawl_fiat);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="limitTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'LimitActionCell', 'id', 'daily_withdraw_crypto', 'daily_withdraw_fiat',
        'min_withdrawl_crypto', 'min_withdrawl_fiat')
}, {
    title: <IntlMessages id="limitTable.title.dailyWithdrawCrypto" />,
    key: 'daily_withdraw_crypto',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'daily_withdraw_crypto')
}, {
    title: <IntlMessages id="limitTable.title.dailyWithdrawFiat" />,
    key: 'daily_withdraw_fiat',
    maxWidth: 200,
    render: object => renderCell(object, 'TextCell', 'daily_withdraw_fiat')
}, {
    title: <IntlMessages id="limitTable.title.minWithdrawCrypto" />,
    key: 'min_withdrawl_crypto',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'min_withdrawl_crypto')
}, {
    title: <IntlMessages id="limitTable.title.minWithdrawlFiat" />,
    key: 'min_withdrawl_fiat',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'min_withdrawl_fiat')
}];

const limitTableInfos = [
    {
        title: 'Limit Management',
        value: 'LimitTable',
        columns: clone(columns)
    }
];

export { columns, limitTableInfos };
