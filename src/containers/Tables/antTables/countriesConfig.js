import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, CountrySwitchCell, CountryActionCell, ColorCell, CountryButtonCell, LegalityCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, c_name = null, legal = null, colorCode = null,
    status = null, states = null) => {
    const value = object[key];
    const name = object[c_name];
    const legality = object[legal];
    const color = object[colorCode];
    const is_active = object[status];
    const stateCount = object[states]

    switch (type) {
        case 'CountryButtonCell':
            return CountryButtonCell(value, name, legality, color, stateCount, is_active);
        case 'ColorCell':
            return ColorCell(value, name, legality, color, stateCount, is_active);
        case 'LegalityCell':
            return LegalityCell(value, name, legality, color, stateCount, is_active);
        case 'CountrySwitchCell':
            return CountrySwitchCell(value, name, legality, color, stateCount, is_active);
        case 'CountryActionCell':
            return CountryActionCell(value, name, legality, color, stateCount, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="countryTable.title.actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object, 'CountryActionCell', 'id', 'name', 'legality',
            'color', 'stateCount', 'is_active')
    },
    {
        title: <IntlMessages id="countryTable.title.name" />,
        key: 'name',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    {
        title: <IntlMessages id="countryTable.title.legality" />,
        key: 'legality',
        width: 100,
        render: object => renderCell(object, 'LegalityCell', 'legality')
    },
    {
        title: <IntlMessages id="countryTable.title.color" />,
        key: 'color',
        width: 100,
        render: object => renderCell(object, 'ColorCell', 'color')
    },
    {
        title: <IntlMessages id="countryTable.title.status" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'CountrySwitchCell', 'id', 'name', 'legality',
            'color', 'stateCount', 'is_active')
    },
    {
        title: <IntlMessages id="countryTable.title.State" />,
        key: 'button',
        width: 200,
        render: object => renderCell(object, 'CountryButtonCell', 'id', 'stateCount')
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
