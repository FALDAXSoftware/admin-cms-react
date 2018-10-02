import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
    const value = object[key];

    switch (type) {
        case 'TextCell':
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="staticPageTable.title.srNo" />,
    key: 'id',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'id')
}, {
    title: <IntlMessages id="antTable.title.firstName" />,
    key: 'first_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'first_name')
}, {
    title: <IntlMessages id="antTable.title.lastName" />,
    key: 'last_name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'last_name')
}, {
    title: <IntlMessages id="antTable.title.email" />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="antTable.title.country" />,
    key: 'country',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'country')
}];

const referralInfos = [
    {
        title: 'Referral Users',
        value: 'ReferralsTable',
        columns: clone(columns)
    }
];

export { columns, referralInfos };
