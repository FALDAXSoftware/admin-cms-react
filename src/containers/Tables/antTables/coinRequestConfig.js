import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateCell, ContentCell, CoinReqActionCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, name = null, emailId = null, date = null, msg = null,
    reqUrl = null, symbol = null, countyName = null, pitch = null, fname = null, lname = null,
    skypeId = null, refSite = null, phoneNum = null, otherSite = null
) => {
    const value = object[key];
    const coin_name = object[name];
    const email = object[emailId];
    const target_date = object[date];
    const message = object[msg];
    const url = object[reqUrl];
    const coin_symbol = object[symbol];
    const country = object[countyName];
    const elevator_pitch = object[pitch];
    const first_name = object[fname];
    const last_name = object[lname];
    const skype = object[skypeId];
    const ref_site = object[refSite];
    const phone = object[phoneNum];
    const other_site = object[otherSite];

    switch (type) {
        case 'DateCell':
            return DateCell(value);
        case 'ContentCell':
            return ContentCell(value);
        case 'CoinReqActionCell':
            return CoinReqActionCell(value, coin_name, email, target_date, message, url,
                coin_symbol, country, elevator_pitch, first_name, last_name, skype, ref_site,
                phone, other_site);
        default:
            return TextCell(value);
    }
};

const columns = [
    {
        title: <IntlMessages id="coinTable.title.coin" />,
        key: 'coin_name',
        width: 100,
        render: object => renderCell(object, 'ContentCell', 'coin_name')
    },
    {
        title: <IntlMessages id="coinTable.title.email" />,
        key: 'email',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'email')
    },
    {
        title: <IntlMessages id="coinTable.title.target_date" />,
        key: 'target_date',
        width: 200,
        render: object => renderCell(object, 'DateCell', 'target_date')
    },
    {
        title: <IntlMessages id="coinTable.title.Actions" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object,
            'CoinReqActionCell', 'id', 'coin_name', 'email', 'target_date', 'message', 'url',
            'coin_symbol', 'country', 'elevator_pitch', 'first_name', 'last_name', 'skype', 'ref_site',
            'phone', 'other_site'
        )
    }
];

const coinReqTableInfos = [
    {
        title: 'Coin Requests',
        value: 'CoinsTable',
        columns: clone(columns)
    }
];

export { columns, coinReqTableInfos };
