import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, StateSwitchCell, StateActionCell, ColorCell, LegalityCell
} from '../../../components/tables/helperCells';
import { isAllowed } from '../../../helpers/accessControl';

const renderCell = (object, type, key, s_name = null, legal = null, colorCode = null, status = null) => {
    const value = object[key];
    const name = object[s_name];
    const legality = object[legal];
    const color = object[colorCode];
    const is_active = object[status];

    switch (type) {
        case 'ColorCell':
            return ColorCell(value, name, legality, color, is_active);
        case 'LegalityCell':
            return LegalityCell(value, name, legality, color, is_active);
        case 'StateSwitchCell':
            return StateSwitchCell(value, name, legality, color, is_active,!isAllowed("activate_state"));
        case 'StateActionCell':
            return StateActionCell(value, name, legality, color, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="countryTable.title.actions" />,
    key: 'action',
   align:"left",
    width: 50,
    render: object => renderCell(object, 'StateActionCell', 'id', 'name', 'legality', 'color', 'is_active')
}, {
    title: <IntlMessages id="stateTable.title.name" />,
    key: 'name',
   align:"left",
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'name')
}, {
    title: <IntlMessages id="countryTable.title.legality" />,
    key: 'legality',
    width: 100,
   align:"left",
    sorter: true,
    render: object => renderCell(object, 'LegalityCell', 'legality')
}, {
    title: <IntlMessages id="countryTable.title.color" />,
    key: 'color',
   align:"left",
    width: 100,
    render: object => renderCell(object, 'ColorCell', 'color')
}, {
    title: <IntlMessages id="countryTable.title.status" />,
    key: 'is_active',
   align:"left",
    width: 100,
    render: object => {
        return renderCell(object, 'StateSwitchCell', 'id', 'name', 'legality', 'color', 'is_active')
    }
}];

const stateTableInfos = [
    {
        title: 'States',
        value: 'StatesTable',
        columns: clone(columns)
    }
];

export { columns, stateTableInfos };
