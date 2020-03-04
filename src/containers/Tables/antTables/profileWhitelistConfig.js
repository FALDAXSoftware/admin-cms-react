import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, ProfileWhiteListActionCell,ExpireIpDateCell, DaysCell ,DateTimeCell} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, ip_address = null, selected_time = null, permanent = null) => {
    const value = object[key];
    const ip = object[ip_address];
    const days = object[selected_time];
    const is_permanent = object[permanent];

    switch (type) {
      case "ProfileWhiteListActionCell":
        return ProfileWhiteListActionCell(value, ip, days, is_permanent);
      case "DaysCell":
        return DaysCell(value, ip, days, is_permanent);
      case "ExpireIpDateCell":
        return ExpireIpDateCell(value, ip, days, is_permanent);
      case "DateTimeCell":
        return DateTimeCell(value, ip, days, is_permanent);
      default:
        return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="whitelistTable.title.Actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object, 'ProfileWhiteListActionCell', 'id', 'ip', 'time', 'is_permanent')
},{
    title: <IntlMessages id="whitelistTable.title.created_at" />,
    key: 'created_at',
    width: 100,
    render: object => renderCell(object, 'DateTimeCell', 'created_at')
},
 {
    title: <IntlMessages id="whitelistTable.title.ip" />,
    key: 'ip',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'ip')
}, {
    title: <IntlMessages id="whitelistTable.title.expire_date" />,
    key: 'expire_time',
    width: 100,
    render: object => renderCell(object, 'ExpireIpDateCell', 'expire_time')
}];

const profileWhitelistTableInfos = [
    {
        title: 'Profile Whitelist',
        value: 'profileWhitelistTable',
        columns: clone(columns)
    }
];

export { columns, profileWhitelistTableInfos };
