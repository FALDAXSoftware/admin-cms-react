import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, CountrySwitchCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, c_name = null, code = null, status = null) => {
    const value = object[key];
    const name = object[c_name];
    const country_code = object[code];
    const is_active = object[status];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'CountrySwitchCell':
            return CountrySwitchCell(value, name, country_code, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="countryTable.title.name" />,
        key: 'name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    {
        title: <IntlMessages id="countryTable.title.code" />,
        key: 'country_code',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'country_code')
    },
    {
        title: <IntlMessages id="countryTable.title.status" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'CountrySwitchCell', 'id', 'name', 'country_code', 'is_active')
    }
];

const countryTableInfos = [
    {
        title: 'Countries',
        value: 'CountryTable',
        columns: clone(columns)
    }
];

export { columns, countryTableInfos };
