import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, FeesActionCell, FeesCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, volume = null, maker = null, taker = null) => {
    const value = object[key];
    const trade_volume = object[volume];
    const maker_fee = object[maker];
    const taker_fee = object[taker];

    switch (type) {
        case 'FeesActionCell':
            return FeesActionCell(value, trade_volume, maker_fee, taker_fee);
        case 'FeesCell':
            return FeesCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="feeTable.title.trade" />,
    key: 'trade_volume',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'trade_volume')
}, {
    title: <IntlMessages id="feeTable.title.maker_fee" />,
    key: 'maker_fee',
    width: 100,
    render: object => renderCell(object, 'FeesCell', 'maker_fee')
}, {
    title: <IntlMessages id="feeTable.title.taker_fee" />,
    key: 'taker_fee',
    width: 100,
    render: object => renderCell(object, 'FeesCell', 'taker_fee')
}, {
    title: <IntlMessages id="feeTable.title.actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'FeesActionCell', 'id', 'trade_volume', 'maker_fee'
        , 'taker_fee')
}];

const FeesInfos = [
    {
        title: 'Fees',
        value: 'FeesTable',
        columns: clone(columns)
    }
];

export { columns, FeesInfos };
