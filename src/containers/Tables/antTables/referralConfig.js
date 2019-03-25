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
    title: <IntlMessages id="antTable.title.country" />,
    key: 'country',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'country')
}];

const referralInfos = [
    {
        title: 'Referred Users',
        value: 'ReferralsTable',
        columns: clone(columns)
    }
];

export { columns, referralInfos };
