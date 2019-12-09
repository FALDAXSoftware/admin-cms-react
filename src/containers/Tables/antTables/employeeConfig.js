import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell,
    EmployeeActionCell,
    EmployeeSwitchCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, lname = null, emailID = null,
    phone = null, s_address = null, roles = null, roleID = null, status = null,

) => {
    const value = object[key];
    const first_name = object[fname];
    const last_name = object[lname];
    const email = object[emailID];
    const phone_number = object[phone];
    const address = object[s_address];
    const role = object[roles];
    const role_id = object[roleID];
    const is_active = object[status];

    switch (type) {
        case 'EmployeeSwitchCell':
            return EmployeeSwitchCell(value, first_name, last_name, email, phone_number, address,
                role, role_id, is_active);
        case 'EmployeeActionCell':
            return EmployeeActionCell(value, first_name, last_name, email, phone_number, address,
                role, role_id, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="antTable.title.details" />,
        key: 'action',
        width: 150,
        render: object => renderCell(object, 'EmployeeActionCell', 'id', 'first_name', 'last_name',
            'email', 'phone_number', 'address', 'role', 'role_id', 'is_active')
    },
    {
        title: <IntlMessages id="antTable.title.name" />,
        key: 'first_name',
        width: 150,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'first_name')
    },
    {
        title: <IntlMessages id="antTable.title.email" />,
        key: 'email',
        width: 150,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="antTable.title.role" />,
        key: 'role',
        width: 150,
        render: (object)=>(<a href={"access-grant/"+object.role_id}>{object['role']}</a>)
    },
    {
        title: <IntlMessages id="antTable.title.Active" />,
        key: 'is_active',
        width: 150,
        render: object => renderCell(object, 'EmployeeSwitchCell', 'id', 'first_name', 'last_name',
            'email', 'phone_number', 'address', 'role', 'role_id', 'is_active')
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
