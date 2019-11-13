import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, CoinFeesActionCell } from '../../../components/tables/helperCells';

const renderCell = (object, type,key,name,slug,f_type,updated_at,f_value) => {
    const value = object[key];
    const fees_name = object[name];
    const fees_slug=object[slug];
    const fees_type=object[f_type]
    const fees_updated_at=object[updated_at];
    const fees_value=object[f_value];
    switch (type) {
        case "CoinFeesActionCell":
            return CoinFeesActionCell(value,fees_name,fees_slug,fees_type,fees_updated_at,fees_value);
        default:
            return TextCell(value,fees_name,fees_slug,fees_type,fees_updated_at,fees_value);
    }
};

const columns = [
    {
        title: <IntlMessages id="roleTable.title.actions" />,
        key: 'action',
        width: 100,
        render: object => renderCell(object,
            'CoinFeesActionCell','id','name','slug','type','updated_at','value')
    },
    {
        title: <IntlMessages id="networkFeeTable.title.name" />,
        key: 'name',
        sorter:true,
        width: 100,
        render: object => renderCell(object, 'TextCell','name','id','name','slug','type','updated_at','value')
    },
    {
        title: <IntlMessages id="networkFeeTable.title.type" />,
        key: 'type',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'type','id','name','slug','type','updated_at','value')
    },
    {
        title: <IntlMessages id="networkFeeTable.title.value" />,
        key: 'value',
        width: 100,
        render: object => renderCell(object, 'TextCell', 'value','id','name','slug','type','updated_at','value')
    }
];

const networkFeeTableInfos = [
    {
        title: 'Network Fee',
        value: 'NetworkFeeTable',
        columns: clone(columns)
    }
];

export { columns, networkFeeTableInfos };
