import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ProfileWhiteListActionCell, DaysCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, ip_address = null, selected_time = null, permanent = null) => {
    const value = object[key];
    const ip = object[ip_address];
    const days = object[selected_time];
    const is_permanent = object[permanent];

    switch (type) {
        case 'ProfileWhiteListActionCell':
            return ProfileWhiteListActionCell(value, ip, days, is_permanent);
        case 'DaysCell':
            return DaysCell(value, ip, days, is_permanent);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="whitelistTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'ProfileWhiteListActionCell', 'id', 'ip', 'time', 'is_permanent')
}, {
    title: <IntlMessages id="whitelistTable.title.ip" />,
    key: 'ip',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'ip')
}, {
    title: <IntlMessages id="whitelistTable.title.time" />,
    key: 'days',
    width: 100,
    render: object => renderCell(object, 'DaysCell', 'days')
}];

const profileWhitelistTableInfos = [
    {
        title: 'Profile Whitelist',
        value: 'profileWhitelistTable',
        columns: clone(columns)
    }
];

export { columns, profileWhitelistTableInfos };
