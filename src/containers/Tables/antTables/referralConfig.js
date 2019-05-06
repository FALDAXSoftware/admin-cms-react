import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, referralActionCell, ReferralDateCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fullName, emailID, createdAt, referralEmail) => {
    const value = object[key];
    const full_name = object[fullName];
    const email = object[emailID];
    const created_at = object[createdAt];
    const referral_by_email = object[referralEmail];

    switch (type) {
        case 'TextCell':
            return TextCell(value);
        case 'ReferralDateCell':
            return ReferralDateCell(value, full_name, email, created_at, referral_by_email);
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
    title: <IntlMessages id="antTable.title.created_at" />,
    key: 'created_at',
    width: 200,
    render: object => renderCell(object, 'ReferralDateCell', 'id', 'full_name', 'email', 'created_at', 'referral_by_email')
}, {
    title: <IntlMessages id="antTable.title.referral_by_email" />,
    key: 'referral_by_email',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'referral_by_email')
}, {
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'referralActionCell', 'id')
}];

const referralInfos = [
    {
        title: 'Referral',
        value: 'ReferralTable',
        columns: clone(columns)
    }
];

export { columns, referralInfos };
