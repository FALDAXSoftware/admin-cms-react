import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, CoinActionCell, SwitchCell, ContentCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null, code = null, Limit = null, desc = null, wallet = null, cratedAt = null, status = null) => {
    const value = object[key];
    const coin_name = object[name];
    const coin_code = object[code];
    const limit = object[Limit];
    const description = object[desc];
    const wallet_address = object[wallet];
    const created_at = object[cratedAt];
    const is_active = object[status];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'ContentCell':
            return ContentCell(value);
        case 'SwitchCell':
            return SwitchCell(value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active);
        case 'CoinActionCell':
            return CoinActionCell(value, coin_name, coin_code, limit, description, wallet_address, created_at, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.coin" />,
        key: 'coin_name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'coin_name')
    },
    {
        title: <IntlMessages id="coinTable.title.code" />,
        key: 'coin_code',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'coin_code')
    },
    {
        title: <IntlMessages id="coinTable.title.limit" />,
        key: 'limit',
        width: 200,
        render: object => renderCell(object, 'LinkCell', 'limit')
    },
    {
        title: <IntlMessages id="coinTable.title.description" />,
        key: 'description',
        width: 200,
        render: object => renderCell(object, 'ContentCell', 'description')
    },
    {
        title: <IntlMessages id="coinTable.title.walletAddress" />,
        key: 'wallet_address',
        width: 200,
        render: object => renderCell(object, 'LinkCell', 'wallet_address')
    },
    {
        title: <IntlMessages id="coinTable.title.active" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'SwitchCell', 'id', 'coin_name', 'coin_code', 'limit', 'description', 'wallet_address', 'created_at', 'is_active')
    },
    {
        title: <IntlMessages id="coinTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'CoinActionCell', 'id', 'coin_name', 'coin_code', 'limit', 'description', 'wallet_address', 'created_at', 'is_active')
    }
];

const coinTableInfos = [
    {
        title: 'Coins',
        value: 'CoinsTable',
        columns: clone(columns)
    }
];

export { columns, coinTableInfos };
