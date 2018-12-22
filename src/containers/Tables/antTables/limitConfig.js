import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, LimitActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, isUser = null, MonDepCrypto = null, MonDepFiat = null,
    MonWithCrypto = null, MonWithFiat = null, dailyDepCrypto = null, dailyDepFiat = null,
    dailyWithCrypto = null, dailyWithFiat = null, minWithCrypto = null, minWithFiat = null
) => {
    const value = object[key];
    const user = object[isUser];
    const monthly_deposit_crypto = object[MonDepCrypto];
    const monthly_deposit_fiat = object[MonDepFiat];
    const monthly_withdraw_crypto = object[MonWithCrypto];
    const monthly_withdraw_fiat = object[MonWithFiat];
    const daily_deposit_crypto = object[dailyDepCrypto];
    const daily_deposit_fiat = object[dailyDepFiat];
    const daily_withdraw_crypto = object[dailyWithCrypto];
    const daily_withdraw_fiat = object[dailyWithFiat];
    const min_withdrawl_crypto = object[minWithCrypto];
    const min_withdrawl_fiat = object[minWithFiat];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'LimitActionCell':
            return LimitActionCell(value, user, monthly_deposit_crypto, monthly_deposit_fiat,
                monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat,
                daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat
            );
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="limitTable.title.user" />,
        key: 'user',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'user')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyDepositCrypto" />,
        key: 'monthly_deposit_crypto',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'monthly_deposit_crypto')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyDepositFiat" />,
        key: 'monthly_deposit_fiat',
        maxWidth: 200,
        render: object => renderCell(object, 'TextCell', 'monthly_deposit_fiat')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyWithdrawCrypto" />,
        key: 'monthly_withdraw_crypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'monthly_withdraw_crypto')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyWithdrawFiat" />,
        key: 'monthly_withdraw_fiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'monthly_withdraw_fiat')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyDepositCrypto" />,
        key: 'daily_deposit_crypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'daily_deposit_crypto')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyDepositFiat" />,
        key: 'daily_deposit_fiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'daily_deposit_fiat')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyWithdrawCrypto" />,
        key: 'daily_withdraw_crypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'daily_withdraw_crypto')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyWithdrawFiat" />,
        key: 'daily_withdraw_fiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'daily_withdraw_fiat')
    },
    {
        title: <IntlMessages id="limitTable.title.minWithdrawlCrypto" />,
        key: 'min_withdrawl_crypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'min_withdrawl_crypto')
    },
    {
        title: <IntlMessages id="limitTable.title.minWithdrawlFiat" />,
        key: 'min_withdrawl_fiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'min_withdrawl_fiat')
    },
    {
        title: <IntlMessages id="limitTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'LimitActionCell', 'id', 'user', 'monthly_deposit_crypto', 'monthly_deposit_fiat',
            'monthly_withdraw_crypto', 'monthly_withdraw_fiat', 'daily_deposit_crypto', 'daily_deposit_fiat',
            'daily_withdraw_crypto', 'daily_withdraw_fiat', 'min_withdrawl_crypto', 'min_withdrawl_fiat')
    }
];

const limitTableInfos = [
    {
        title: 'Limit Management',
        value: 'LimitTable',
        columns: clone(columns)
    }
];

export { columns, limitTableInfos };
