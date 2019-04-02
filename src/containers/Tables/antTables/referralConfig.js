import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, referralActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'TextCell':
            return TextCell(value);
        case 'referralActionCell':
            return referralActionCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Name" />,
    key: 'full_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'full_name')
}, {
    title: <IntlMessages id="antTable.title.email" />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'referralActionCell', 'id')
}
    // {
    //     title: <IntlMessages id="antTable.title.amount" />,
    //     key: 'amount',
    //     width: 200,
    //     render: object => renderCell(object, 'TextCell', 'amount')
    // }, {
    //     title: <IntlMessages id="antTable.title.coin" />,
    //     key: 'coin_name',
    //     width: 200,
    //     render: object => renderCell(object, 'TextCell', 'coin_name')
    // }
];

const referralInfos = [
    {
        title: 'Referral',
        value: 'ReferralTable',
        columns: clone(columns)
    }
];

export { columns, referralInfos };
