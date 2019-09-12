import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, referralActionCell, ReferralDateCell, ReferralCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fullName, emailID, createdAt, referralEmail, referredId, referredBy, totalReferral) => {
    const value = object[key];
    const full_name = object[fullName];
    const email = object[emailID];
    const created_at = object[createdAt];
    const referral_by_email = object[referralEmail];
    const referred_id = object[referredId]
    const refered_by = object[referredBy];
    const no_of_referral = object[totalReferral]

    switch (type) {
        case 'TextCell':
            return TextCell(value);
        case 'ReferralCell':
            return ReferralCell(value);
        case 'ReferralDateCell':
            return ReferralDateCell(value, full_name, email, created_at, referral_by_email, referred_id, refered_by, no_of_referral);
        case 'referralActionCell':
            return referralActionCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object, 'referralActionCell', 'id')
}, {
    title: <IntlMessages id="antTable.title.Name" />,
    key: 'full_name',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'full_name')
}, {
    title: <IntlMessages id="antTable.title.email" />,
    key: 'email',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'TextCell', 'email')
}, {
    title: <IntlMessages id="antTable.title.numReferral" />,
    key: 'no_of_referral',
    width: 100,
    sorter: true,
    render: object => renderCell(object, 'ReferralCell', 'no_of_referral')
}];

const referralInfos = [
    {
        title: 'Referral',
        value: 'ReferralTable',
        columns: clone(columns)
    }
];

export { columns, referralInfos };
