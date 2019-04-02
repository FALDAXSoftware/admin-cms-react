import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, CoinActionCell, SwitchCell, ContentCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null, code = null, minlimit = null, maxlimit = null,
    wallet = null, cratedAt = null, status = null, erc = null, icon = null) => {
    const value = object[key];
    const coin_name = object[name];
    const coin_code = object[code];
    const minLimit = object[minlimit];
    const maxLimit = object[maxlimit];
    //const description = object[desc];
    const wallet_address = object[wallet];
    const created_at = object[cratedAt];
    const is_active = object[status];
    const isERC = object[erc];
    const coin_icon = object[icon];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'ContentCell':
            return ContentCell(value);
        case 'SwitchCell':
            return SwitchCell(value, coin_name, coin_code, minLimit, maxLimit, wallet_address, created_at, is_active, isERC, coin_icon);
        case 'CoinActionCell':
            return CoinActionCell(value, coin_name, coin_code, minLimit, maxLimit, wallet_address, created_at, is_active, isERC, coin_icon);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.coin" />,
        key: 'coin_name',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'coin_name')
    },
    {
        title: <IntlMessages id="coinTable.title.code" />,
        key: 'coin_code',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'coin_code')
    },
    {
        title: <IntlMessages id="coinTable.title.limit" />,
        key: 'minLimit',
        width: 200,
        sorter: true,
        render: object => renderCell(object, 'LinkCell', 'minLimit')
    },
    {
        title: <IntlMessages id="coinTable.title.maxlimit" />,
        key: 'maxLimit',
        width: 200,
        sorter: true,
        render: object => renderCell(object, 'LinkCell', 'maxLimit')
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
        render: object => renderCell(object, 'SwitchCell', 'id', 'coin_name', 'coin_code',
            'minLimit', 'maxLimit', 'wallet_address', 'created_at', 'is_active', 'isERC', 'coin_icon')
    },
    {
        title: <IntlMessages id="coinTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'CoinActionCell', 'id', 'coin_name', 'coin_code',
            'minLimit', 'maxLimit', 'wallet_address', 'created_at', 'is_active', 'isERC', 'coin_icon')
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
