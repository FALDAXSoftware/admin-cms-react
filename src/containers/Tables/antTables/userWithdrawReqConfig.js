import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, ApproveCell, DateTimeCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, m_email = null, source = null, destination = null,
    coinAmt = null, approve = null, createdOn = null) => {
    const value = object[key];
    const email = object[m_email];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[coinAmt];
    const is_approve = object[approve];
    const created_at = object[createdOn];

    switch (type) {
        case 'DateCell':
            return DateTimeCell(value, email, source_address, destination_address, amount, is_approve, created_at);
        case 'ApproveCell':
            return ApproveCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="withdrawTable.title.created_at" />,
    key: 'created_at',
   align:"left",
    ellipsis:true,
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
}, {
    title: <IntlMessages id="withdrawTable.title.email" />,
    key: 'email',
   align:"left",
    ellipsis:true,
    width: 250,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="withdrawTable.title.source_address" />,
    key: 'source_address',
    key: 'created_at',
   align:"left",
    width: 300,
    render: object => renderCell(object, 'TextCell', 'source_address')
}, {
    title: <IntlMessages id="withdrawTable.title.destination_address" />,
    key: 'destination_address',
    key: 'created_at',
   align:"left",
    width: 300,
    render: object => renderCell(object, 'TextCell', 'destination_address')
}, {
    title: <IntlMessages id="withdrawTable.title.amount" />,
    key: 'amount',
    key: 'created_at',
   align:"left",
    width: 150,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'amount')
}, {
    title: <IntlMessages id="withdrawTable.title.approve"/>,
    key: 'is_approve',
    key: 'created_at',
   align:"left",
    width: 150,
    render: object => renderCell(object, 'ApproveCell', 'is_approve')
}];

const userWithdrawReqTableInfos = [
    {
        title: 'User Withdrawal Request',
        value: 'userWithdrawRequestTable',
        columns: clone(columns)
    }
];

export { columns, userWithdrawReqTableInfos };
