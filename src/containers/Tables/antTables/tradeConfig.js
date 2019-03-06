import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, VolumeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, pair = null, m_email = null, t_email = null, buy = null,
    quant = null, fillPrice = null, makerFee = null, takerFee = null, Vol = null, createdOn = null) => {
    const value = object[key];
    const symbol = object[pair];
    const maker_email = object[m_email];
    const taker_email = object[t_email];
    const side = object[buy];
    const quantity = object[quant];
    const fill_price = object[fillPrice];
    const maker_fee = object[makerFee];
    const taker_fee = object[takerFee];
    const volume = object[Vol]
    const created_at = object[createdOn];

    switch (type) {
        case 'DateCell':
            return DateCell(value, symbol, maker_email, taker_email, side, quantity, fill_price, maker_fee, taker_fee, volume, created_at);
        case 'VolumeCell':
            return VolumeCell(value, symbol, maker_email, taker_email, side, quantity, fill_price, maker_fee, taker_fee, volume, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="tradeTable.title.symbol" />,
        key: 'symbol',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'symbol')
    },
    {
        title: <IntlMessages id="tradeTable.title.maker_email" />,
        key: 'maker_email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'maker_email')
    },
    {
        title: <IntlMessages id="tradeTable.title.taker_email" />,
        key: 'taker_email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'taker_email')
    },
    {
        title: <IntlMessages id="tradeTable.title.side" />,
        key: 'side',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'side')
    },
    {
        title: <IntlMessages id="tradeTable.title.quantity" />,
        key: 'quantity',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'quantity')
    },
    {
        title: <IntlMessages id="tradeTable.title.fill_price" />,
        key: 'fill_price',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'fill_price')
    },
    {
        title: <IntlMessages id="tradeTable.title.maker_fee" />,
        key: 'maker_fee',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'maker_fee')
    },
    {
        title: <IntlMessages id="tradeTable.title.taker_fee" />,
        key: 'taker_fee',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'taker_fee')
    },
    {
        title: <IntlMessages id="tradeTable.title.volume" />,
        key: 'volume',
        width: 100,
        render: object => renderCell(object, 'VolumeCell', 'id', 'symbol', 'maker_email',
            'taker_email', 'side', 'quantity', 'fill_price', 'maker_fee', 'taker_fee'
            , 'volume', 'created_at')
    },
    {
        title: <IntlMessages id="tradeTable.title.created_at" />,
        key: 'created_at',
        width: 100,
        render: object => renderCell(object, 'DateCell', 'created_at')
    },
];

const tradeTableInfos = [
    {
        title: 'Trade History',
        value: 'TradeTable',
        columns: clone(columns)
    }
];

export { columns, tradeTableInfos };
