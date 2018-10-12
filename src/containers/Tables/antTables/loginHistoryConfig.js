import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, created_date = null) => {
    const value = object[key];
    const created_at = object[created_date];

    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(created_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="historyTable.title.ip" />,
    key: 'ip',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'ip')
}, {
    title: <IntlMessages id="historyTable.title.created_at" />,
    key: 'created_at',
    width: 100,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
}];

const historyTableInfos = [
    {
        title: 'Login History',
        value: 'historyTable',
        columns: clone(columns)
    }
];

export { columns, historyTableInfos };
