import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, RolesActionCell, RoleSwitchCell, DateTimeCell } from '../../../components/tables/helperCells';
import { isAllowed } from '../../../helpers/accessControl';

const renderCell = (object, type, key, first_name = null, isCoin = null, isUser = null,
    isCountry = null, isEmp = null, isRole = null,
    isPair = null, isTransaction = null, isTrade = null,
    isWithdraw = null, isJobs = null, isKyc = null, fee = null, panic = null,
    isNews = null, isReferral = null, addUser = null, active = false) => {
    const value = object[key];
    const name = object[first_name];
    const users = object[isUser];
    const assets = object[isCoin];
    const roles = object[isRole];
    const countries = object[isCountry];
    const employee = object[isEmp];
    const pairs = object[isPair];
    const transaction_history = object[isTransaction];
    const trade_history = object[isTrade];
    const withdraw_requests = object[isWithdraw];
    const jobs = object[isJobs];
    const kyc = object[isKyc];
    const fees = object[fee];
    const panic_button = object[panic];
    const news = object[isNews];
    const is_referral = object[isReferral];
    const add_user = object[addUser]
    const is_active = object[active];

    switch (type) {
        case 'RoleSwitchCell':
            return RoleSwitchCell(value, name, users, assets, countries,
                roles, employee, pairs, transaction_history, trade_history,
                withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active,!isAllowed("update_role"));
        case 'RolesActionCell':
            return RolesActionCell(value, name, users, assets, countries,
                roles, employee, pairs, transaction_history, trade_history,
                withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="roleTable.title.actions" />,
        key: 'roleTable.title.actions',
        width: 100,
        align:"left",
        render: object => renderCell(object,
            'RolesActionCell', 'id', 'name', 'users', 'assets',
            'countries', 'roles', 'employee', 'pairs', 'transaction_history',
            'trade_history', 'withdraw_requests', 'jobs', 'kyc', 'fees', 'panic_button', 'news',
            'is_referral', 'add_user', 'is_active')
    },
    {
        title: <IntlMessages id="antTable.title.created_on" />,
        key: 'created_at',
        width: 150,
        align:"left",
        sorter: true,
        render: object => DateTimeCell(object['created_at'])
    },{
        title: <IntlMessages id="roleTable.title.name" />,
        key: 'name',
        width: 200,
        align:"left",
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'name')
    }
    , {
        title: <IntlMessages id="roleTable.title.status" />,
        key: 'roleTable.title.status',
       align:"left",
        width: 200,
        render: object => {
            return renderCell(object, 'RoleSwitchCell', 'id', 'name', 'users', 'assets',
                'countries', 'roles', 'employee', 'pairs', 'transaction_history',
                'trade_history', 'withdraw_requests', 'jobs', 'kyc', 'fees', 'panic_button', 'news',
                'is_referral', 'add_user', 'is_active')
        }
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
