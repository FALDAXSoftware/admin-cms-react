import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, RolesActionCell, RoleSwitchCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, first_name = null, isCoin = null, isUser = null,
    isCountry = null, isAnnounce = null, isStatic = null, isEmp = null, isRole = null,
    isPair = null, isBlog = null, isLimit = null, isTransaction = null, isTrade = null,
    isWithdraw = null, isCoinReq = null, isInquiry = null, isJobs = null,
    isSubscribe = null, contact = null, active = false) => {
    const value = object[key];
    const name = object[first_name];
    const users = object[isUser];
    const coins = object[isCoin];
    const announcement = object[isAnnounce];
    const static_page = object[isStatic];
    const roles = object[isRole];
    const countries = object[isCountry];
    const employee = object[isEmp];
    const pairs = object[isPair];
    const blogs = object[isBlog];
    const limit_management = object[isLimit];
    const transaction_history = object[isTransaction];
    const trade_history = object[isTrade];
    const withdraw_requests = object[isWithdraw];
    const coin_requests = object[isCoinReq];
    const inquiries = object[isInquiry];
    const jobs = object[isJobs];
    const subscribe = object[isSubscribe];
    const contact_setting = object[contact];
    const is_active = object[active];

    switch (type) {
        case 'RoleSwitchCell':
            return RoleSwitchCell(value, name, users, coins, announcement, static_page,
                roles, countries, employee, pairs, blogs, limit_management,
                transaction_history, trade_history, withdraw_requests, coin_requests,
                inquiries, jobs, subscribe, contact_setting, is_active);
        case 'RolesActionCell':
            return RolesActionCell(value, name, users, coins, announcement, static_page,
                roles, countries, employee, pairs, blogs, limit_management,
                transaction_history, trade_history, withdraw_requests, coin_requests,
                inquiries, jobs, subscribe, contact_setting, is_active);
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
    }, {
        title: <IntlMessages id="roleTable.title.status" />,
        key: 'is_active',
        width: 200,
        render: object => renderCell(object, 'RoleSwitchCell', 'id', 'name', 'users', 'coins',
            'announcement', 'static_page', 'roles', 'countries', 'employee', 'pairs',
            'blogs', 'limit_management', 'transaction_history', 'trade_history',
            'withdraw_requests', 'coin_requests', 'inquiries', 'jobs', 'subscribe',
            'contact_setting', 'is_active')
    }, {
        title: <IntlMessages id="roleTable.title.actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'RolesActionCell', 'id', 'name', 'users', 'coins', 'announcement', 'static_page',
            'roles', 'countries', 'employee', 'pairs', 'blogs', 'limit_management',
            'transaction_history', 'trade_history', 'withdraw_requests', 'coin_requests',
            'inquiries', 'jobs', 'subscribe', 'contact_setting', 'is_active')
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
