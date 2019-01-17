import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell,
    EmployeeActionCell,
    EmployeeSwitchCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, emailID = null, roles = null, status = null) => {
    const value = object[key];
    const name = object[fname];
    const email = object[emailID];
    const role = object[roles];
    const is_active = object[status];

    switch (type) {
        case 'EmployeeSwitchCell':
            return EmployeeSwitchCell(value, name, email, role, is_active);
        case 'EmployeeActionCell':
            return EmployeeActionCell(value, name, email, role, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="antTable.title.name" />,
        key: 'name',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    {
        title: <IntlMessages id="antTable.title.email" />,
        key: 'email',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="antTable.title.role" />,
        key: 'role',
        width: 200,
        render: object => renderCell(object, 'TextCell', 'role')
    },
    {
        title: <IntlMessages id="antTable.title.Active" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'EmployeeSwitchCell', 'id', 'name', 'email', 'role', 'is_active')
    },
    {
        title: <IntlMessages id="antTable.title.details" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'EmployeeActionCell', 'id', 'name', 'email', 'role', 'is_active')
    }
];

const employeeTableinfos = [
    {
        title: 'Employee',
        value: 'EmployeeTable',
        columns: clone(columns)
    }
];

export { columns, employeeTableinfos };
