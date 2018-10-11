import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, RolesActionCell, RoleSwitchCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, first_name = null, isCoin = null, isUser = null, isCountry = null, isAnnounce = null, isStatic = null, isEmp = null, isRole = null, active = false) => {
    const value = object[key];
    const name = object[first_name];
    const coin = object[isCoin];
    const user = object[isUser];
    const country = object[isCountry];
    const announcement = object[isAnnounce];
    const employee = object[isEmp];
    const role = object[isRole];
    const staticPage = object[isStatic];
    const is_active = object[active];

    switch (type) {
        case 'RoleSwitchCell':
            return RoleSwitchCell(value, name, coin, user, country, announcement, employee, role, staticPage, is_active);
        case 'RolesActionCell':
            return RolesActionCell(value, name, coin, user, country, announcement, employee, role, staticPage, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="roleTable.title.name" />,
        key: 'name',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    // {
    //     title: <IntlMessages id="roleTable.title.role" />,
    //     key: 'role',
    //     width: 200,
    //     render: object => renderCell(object, 'TextCell', 'role')
    // },
    {
        title: <IntlMessages id="roleTable.title.status" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'RoleSwitchCell', 'id', 'name', 'coin', 'user', 'country', 'announcement', 'employee', 'role', 'staticPage', 'is_active')
    },
    {
        title: <IntlMessages id="roleTable.title.actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'RolesActionCell', 'id', 'name', 'coin', 'user', 'country', 'announcement', 'employee', 'role', 'staticPage', 'is_active')
    }
];

const rolesTableInfos = [
    {
        title: 'Roles',
        value: 'RolesTable',
        columns: clone(columns)
    }
];

export { columns, rolesTableInfos };
