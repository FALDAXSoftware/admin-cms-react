import React from 'react';
import clone from 'clone';
import { TextCell, DateCell, TwoFAActionCell, DateTimeCell, ToolTipsCell } from '../../../components/tables/helperCells';

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
            return DateTimeCell(value);
        case 'TwoFAActionCell':
            return TwoFAActionCell(value, full_name, email, uploaded_file, status, reason, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: "Actions",
    key: 'actions',
    width: 100,
    render: object => renderCell(object, 'TwoFAActionCell', 'id', 'full_name', 'email',
        'uploaded_file', 'status', 'reason', 'created_at')
}, {
    title: "Requested On",
   align:"left",
    key: 'created_at',
    width: 200,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: "Name",
   align:"left",
    key: 'full_name',
    width: 150,
    sorter: true,
    dataIndex:"full_name",
    render: object => ToolTipsCell(object)
}, {
    title: "Email",
   align:"left",
    key: 'email',
    width: 250,
    sorter: true,
    dataIndex:"email",
    render: object => ToolTipsCell(object)
}, {
    title: "Status",
   align:"left",
    key: 'status',
    dataIndex:"status",
    width: 200,
    render: object => <span className={"kyc-status-"+object}>{object.toLowerCase()=="closed"?"APPROVED":object.toUpperCase()}</span>
}];

const twoFactorReqInfos = [
    {
        title: '2FA Requests',
       align:"left",
        value: 'twoFactorReqTable',
        columns: clone(columns)
    }
];

export { columns, twoFactorReqInfos };
