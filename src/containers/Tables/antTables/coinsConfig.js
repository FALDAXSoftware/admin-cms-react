import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];
    switch (type) {
        case 'DateCell':
            return DateCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.srNo" />,
        key: 'srNo',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'srNo')
    },
    {
        title: <IntlMessages id="coinTable.title.coin" />,
        key: 'name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    {
        title: <IntlMessages id="coinTable.title.code" />,
        key: 'code',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'code')
    },
    {
        title: <IntlMessages id="coinTable.title.createdOn" />,
        key: 'createdOn',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'createdOn')
    },
    {
        title: <IntlMessages id="coinTable.title.status" />,
        key: 'status',
        width: 200,
        render: object => renderCell(object, 'LinkCell', 'status')
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
