import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, DateCell, ApproveCell, WithdrawActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, m_email = null, source = null, destination = null,
    coinAmt = null, approve = null, userId = null, coinId = null, createdOn = null, Status = true) => {
    const value = object[key];
    const email = object[m_email];
    const source_address = object[source];
    const destination_address = object[destination];
    const amount = object[coinAmt];
    const is_approve = object[approve];
    const user_id = object[userId];
    const coin_id = object[coinId];
    const status = object[Status];
    const created_at = object[createdOn];

    switch (type) {
        case 'DateCell':
            return DateCell(value, email, source_address, destination_address, amount, is_approve, user_id, coin_id, status, created_at);
        case 'WithdrawActionCell':
            return WithdrawActionCell(value, email, source_address, destination_address, amount, is_approve, user_id, coin_id, status, created_at);
        case 'ApproveCell':
            return ApproveCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="withdrawTable.title.source_address" />,
        key: 'source_address',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'source_address')
    },
    {
        title: <IntlMessages id="withdrawTable.title.destination_address" />,
        key: 'destination_address',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'destination_address')
    },
    {
        title: <IntlMessages id="withdrawTable.title.amount" />,
        key: 'amount',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'amount')
    },
    {
        title: <IntlMessages id="withdrawTable.title.approve" />,
        key: 'is_approve',
        width: 100,
        render: object => renderCell(object, 'ApproveCell', 'is_approve')
    },
    // {
    //     title: <IntlMessages id="withdrawTable.title.approve" />,
    //     key: 'action',
    //     width: 100,
    //     render: object => renderCell(object, 'WithdrawActionCell', 'id', 'email', 'source_address',
    //         'destination_address', 'amount', 'is_approve', 'user_id', 'coin_id', 'status', 'created_at')
    // },
    {
        title: <IntlMessages id="withdrawTable.title.created_at" />,
        key: 'created_at',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'DateCell', 'created_at')
    },
];

const withdrawReqTableInfos = [
    {
        title: 'Withdraw Requests',
        value: 'withdrawRequestTable',
        columns: clone(columns)
    }
];

export { columns, withdrawReqTableInfos };
