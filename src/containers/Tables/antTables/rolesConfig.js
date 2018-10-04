import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, RolesActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, first_name = null, rolesVal = null) => {
    const value = object[key];
    const name = object[first_name];
    const roles = object[rolesVal];

    switch (type) {
        case 'RolesActionCell':
            return RolesActionCell(value, name, roles);
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
    {
        title: <IntlMessages id="roleTable.title.roles" />,
        key: 'roles',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'roles')
    },
    {
        title: <IntlMessages id="roleTable.title.actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'RolesActionCell', 'id', 'name', 'roles')
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
