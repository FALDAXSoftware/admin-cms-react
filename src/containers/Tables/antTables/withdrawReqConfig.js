import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, WithdrawStatusCell, WithdrawActionCell, DateTimeCell, ToolTipsCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, m_email = null, source = null, destination = null,
    coinAmt = null, t_type = null, approve = null, userId = null, coinId = null, execute = null,
    createdOn = null) => {
    const value = object[key];
    const email = object[m_email];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[coinAmt];
    const transaction_type = object[t_type];
    const is_approve = object[approve];
    const user_id = object[userId];
    const coin_id = object[coinId];
    const is_executed = object[execute];
    const created_at = object[createdOn];

    switch (type) {
        case 'DateCell':
            return DateTimeCell(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at);
        case 'WithdrawActionCell':
            return WithdrawActionCell(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at);
        case 'WithdrawStatusCell':
            return WithdrawStatusCell(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="withdrawTable.title.action" />,
    key: 'action',
    width: 100,
   align:"left",
    render: object => renderCell(object, 'WithdrawActionCell', 'id', 'email', 'source_address',
        'destination_address', 'amount', 'transaction_type', 'is_approve', 'user_id', 'coin_id',
        'is_executed', 'created_at')
}, {
    title: <IntlMessages id="withdrawTable.title.created_at" />,
    key: 'created_at',
    width: 150,
   align:"left",
    sorter: true,
    render: object => renderCell(object, 'DateCell', 'created_at')
},
 {
    title: <IntlMessages id="withdrawTable.title.email" />,
    key: 'Email',
    width: 200,
    align:"left",
    dataIndex:"email",
    render: (data)=>ToolTipsCell(data)
},
{
    title: <IntlMessages id="withdrawTable.title.source_address" />,
    key: 'source_address',
    width: 300,
    align:"left",
    render: object => renderCell(object, 'TextCell', 'source_address')
},
 {
    title: <IntlMessages id="withdrawTable.title.destination_address" />,
    key: 'destination_address',
    width: 300,
    align:"left",
    render: object => renderCell(object, 'TextCell', 'destination_address')
}, {
    title: <IntlMessages id="withdrawTable.title.amount" />,
    key: 'amount',
    width: 150,
   align:"left",
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'amount')
},
//  {
//     title: <IntlMessages id="withdrawTable.title.transaction_type" />,
//     key: 'transaction_type',
//     width: 100,
//     render: object => renderCell(object, 'TextCell', 'transaction_type')
// }, 
{
    title: <IntlMessages id="withdrawTable.title.status" />,
    key: 'status',
    width: 100,
    render: object => renderCell(object, 'WithdrawStatusCell', 'id', 'email', 'source_address',
        'destination_address', 'amount', 'transaction_type', 'is_approve', 'user_id', 'coin_id',
        'is_executed', 'created_at')
}];

const withdrawReqTableInfos = [
    {
        title: 'Withdrawal Request',
        value: 'withdrawRequestTable',
        columns: clone(columns)
    }
];

export { columns, withdrawReqTableInfos };
