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
    const monthlyDepositCrypto = object[MonDepCrypto];
    const monthlyDepositFiat = object[MonDepFiat];
    const monthlyWithdrawCrypto = object[MonWithCrypto];
    const monthlyWithdrawFiat = object[MonWithFiat];
    const dailyDepositCrypto = object[dailyDepCrypto];
    const dailyDepositFiat = object[dailyDepFiat];
    const dailyWithdrawCrypto = object[dailyWithCrypto];
    const dailyWithdrawFiat = object[dailyWithFiat];
    const minWithdrawlCrypto = object[minWithCrypto];
    const minWithdrawlFiat = object[minWithFiat];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'LimitActionCell':
            return LimitActionCell(value, user, monthlyDepositCrypto, monthlyDepositFiat,
                monthlyWithdrawCrypto, monthlyWithdrawFiat, dailyDepositCrypto, dailyDepositFiat,
                dailyWithdrawCrypto, dailyWithdrawFiat, minWithdrawlCrypto, minWithdrawlFiat
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
        key: 'monthlyDepositCrypto',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'monthlyDepositCrypto')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyDepositFiat" />,
        key: 'monthlyDepositFiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'monthlyDepositFiat')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyWithdrawCrypto" />,
        key: 'monthlyWithdrawCrypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'monthlyWithdrawCrypto')
    },
    {
        title: <IntlMessages id="limitTable.title.monthlyWithdrawFiat" />,
        key: 'monthlyWithdrawFiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'monthlyWithdrawFiat')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyDepositCrypto" />,
        key: 'dailyDepositCrypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'dailyDepositCrypto')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyDepositFiat" />,
        key: 'dailyDepositFiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'dailyDepositFiat')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyWithdrawCrypto" />,
        key: 'dailyWithdrawCrypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'dailyWithdrawCrypto')
    },
    {
        title: <IntlMessages id="limitTable.title.dailyWithdrawFiat" />,
        key: 'dailyWithdrawFiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'dailyWithdrawFiat')
    },
    {
        title: <IntlMessages id="limitTable.title.minWithdrawlCrypto" />,
        key: 'minWithdrawlCrypto',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'minWithdrawlCrypto')
    },
    {
        title: <IntlMessages id="limitTable.title.minWithdrawlFiat" />,
        key: 'minWithdrawlFiat',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'minWithdrawlFiat')
    },
    {
        title: <IntlMessages id="limitTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'LimitActionCell', 'id', 'user', 'monthlyDepositCrypto', 'monthlyDepositFiat',
            'monthlyWithdrawCrypto', 'monthlyWithdrawFiat', 'dailyDepositCrypto', 'dailyDepositFiat',
            'dailyWithdrawCrypto', 'dailyWithdrawFiat', 'minWithdrawlCrypto', 'minWithdrawlFiat')
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
