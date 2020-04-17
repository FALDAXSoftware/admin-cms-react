import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import { TextCell, TierActionCell, ToolTipsCell } from '../../../components/tables/helperCells';

const renderCell = (object, type, key, tier = null) => {
    const value = object[key];

    switch (type) {
        case 'TierActionCell':
            return TierActionCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [
//     {
//     title:"Unique Key",
//     key :"unique_key",
//     align:"left",
//     ellipsis:true,
//     dataIndex:"unique_key",
//     width:100
// },
{
    title:"Name",
    key :"name",
    align:"left",
    ellipsis:true,
    // dataIndex:"name",
    width:100,
    render:data=><span>{data['first_name']+" "+data["last_name"]}</span>
},
//  {
//     title: <IntlMessages id="tierTable.title.first_name" />,
//     key: 'first_name',
//     width: 100,
//     align:"left",
//     ellipsis:true,
//     render: object => renderCell(object, 'TextCell', 'first_name')
// },
 {
    title: <IntlMessages id="tierTable.title.email" />,
    key: 'email',
    width: 200,
    align:"left",
    ellipsis:true,
    dataIndex:"email",
    render:(value)=><span className="lowercase">{ToolTipsCell(value)}</span>
},
// {
//     title:"No of Request",
//     key: 'no_request',
//     width: 200,
//     align:"left",
//     ellipsis:true,
//     render:(value)=><span>{value["data"].length}</span>
// },
// {
//     title:"Type",
//     key: 'type',
//     dataIndex:"type",
//     width:250,
//     align:"left",
//     ellipsis:true,
//     render: object => <span>{object=="1"?"Valid ID":object=="2"?"Proof of Residence":"Social Security Number or Equivalent Govt"}</span>
// }
];

const tierReqTableInfos = [
    {
        title: 'Account Tier Request',
        value: 'tiersTable',
        columns: clone(columns)
    }
];

export { columns, tierReqTableInfos };
