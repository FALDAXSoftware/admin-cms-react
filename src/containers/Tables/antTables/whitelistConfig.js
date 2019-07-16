import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, WhiteListActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, ip_address = null, selected_time = null) => {
    const value = object[key];
    const ip = object[ip_address];
    const days = object[selected_time];

    switch (type) {
        case 'WhiteListActionCell':
            return WhiteListActionCell(value, ip, days);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="whitelistTable.title.ip" />,
    key: 'ip',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'ip')
}, {
    title: <IntlMessages id="whitelistTable.title.time" />,
    key: 'days',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'days')
}, {
    title: <IntlMessages id="whitelistTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'WhiteListActionCell', 'id', 'ip', 'time')
}];

const whitelistTableInfos = [
    {
        title: 'Employee Whitelist',
        value: 'employeeWhitelistTable',
        columns: clone(columns)
    }
];

export { columns, whitelistTableInfos };
