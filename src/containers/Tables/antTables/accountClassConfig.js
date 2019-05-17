import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, AccountClassActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null) => {
    const value = object[key];
    const class_name = object[name];

    switch (type) {
        case 'AccountClassActionCell':
            return AccountClassActionCell(value, class_name);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="accountTable.title.id" />,
    key: 'id',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'id')
},
{
    title: <IntlMessages id="accountTable.title.name" />,
    key: 'class_name',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'class_name')
},
{
    title: <IntlMessages id="accountTable.title.actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'AccountClassActionCell', 'id', 'class_name')
}
];

const accountClassTableinfos = [
    {
        title: 'Account Class Management',
        value: 'accountClassTable',
        columns: clone(columns)
    }
];

export { columns, accountClassTableinfos };
