import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateTimeCell, IPCell, LogoutDateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, is_login = null, created_date = null,
    updated_date = null) => {
    const value = object[key];
    const is_logged_in = object[is_login];
    const created_at = object[created_date];
    const updated_at = object[updated_date];

    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(value, is_logged_in, created_at, updated_at);
        case 'LogoutDateCell':
            return LogoutDateCell(value, is_logged_in, created_at, updated_at);
        case 'IPCell':
            return IPCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="historyTable.title.logout_at" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'LogoutDateCell', 'ip', 'is_logged_in', 'created_at', 'updated_at')
}, {
    title: <IntlMessages id="historyTable.title.created_at" />,
    key: 'created_at',
    width: 100,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
}, {
    title: <IntlMessages id="historyTable.title.ip" />,
    key: 'ip',
    width: 100,
    render: object => renderCell(object, 'IPCell', 'ip')
}];

const historyTableInfos = [
    {
        title: 'Login History',
        value: 'historyTable',
        columns: clone(columns)
    }
];

export { columns, historyTableInfos };
