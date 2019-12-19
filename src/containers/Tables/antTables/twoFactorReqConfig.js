import React from 'react';
import clone from 'clone';
import { TextCell, DateCell, TwoFAActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null, Email = null, file = null,
    Status = null, Reason = null, createdAt = null) => {
    const value = object[key];
    const full_name = object[name];
    const email = object[Email];
    const uploaded_file = object[file];
    const status = object[Status];
    const reason = object[Reason];
    const created_at = object[createdAt];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'TwoFAActionCell':
            return TwoFAActionCell(value, full_name, email, uploaded_file, status, reason, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: "Actions",
    key: 'actions',
    width: 200,
    render: object => renderCell(object, 'TwoFAActionCell', 'id', 'full_name', 'email',
        'uploaded_file', 'status', 'reason', 'created_at')
}, {
    title: "Requested On",
    key: 'created_at',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: "Name",
    key: 'full_name',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'full_name')
}, {
    title: "Email",
    key: 'email',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: "Status",
    key: 'status',
    dataIndex:"status",
    width: 200,
    render: object => <span>{object.toUpperCase()}</span>
}];

const twoFactorReqInfos = [
    {
        title: 'Two Factor Requests',
        value: 'twoFactorReqTable',
        columns: clone(columns)
    }
];

export { columns, twoFactorReqInfos };
