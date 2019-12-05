import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell,
    DateCell,
    OfferDateCell,
    CampaignSwitchCell,
    CampaignActionCell,
    CampaignTypeCell
} from '../../../components/tables/helperCells';

const renderCell = (
  object,
  type,
  key,
  id = null,
  label = null,
  start_date = null,
  end_date = null,
  is_active = null,
  created_at = null,
  updated_at = null,
  deleted_at = null
) => {
  const value = object[key];
  const campaign_id = object[id];
  const campaign_label = object[label];
  const campaign_start_date = object[start_date];
  const campaign_end_date = object[end_date];
  const campaign_is_active = object[is_active];
  const campaign_created_at = object[created_at];
  const campaign_updated_at = object[updated_at];
  const campaign_deleted_at = object[deleted_at];
  switch (type) {
    case "DateCell":
      return OfferDateCell(value);
    case "CampaignSwitchCell":
      return CampaignSwitchCell(campaign_id,
        campaign_is_active,campaign_label);
    case "ActiveUserActionCell":
      return CampaignActionCell(
        value,
        campaign_id,
        campaign_label,
        campaign_start_date,
        campaign_end_date,
        campaign_is_active,
        campaign_created_at,
        campaign_updated_at,
        campaign_deleted_at,
      );
    case "CampaignTypeCell":
      return CampaignTypeCell(value)
    default:
      return TextCell(value);
  }
};

const columns = [{
    title: <IntlMessages id="antTable.title.Actions" />,
    key: 'action',
    width: 100,
    render: object => renderCell(object,
        'ActiveUserActionCell',"id","id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at")
},
{
    title: <IntlMessages id="CampaignTable.title.label" />,
    key: 'label',
    width: 100,
    sorter: false,
    render: object => renderCell(object, 'TextCell', 'label',"id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at",)
}, 
{
    title: <IntlMessages id="CampaignTable.title.start_date" />,
    key: 'start_date',
    width: 100,
    sorter: false,
    render: object => renderCell(object, 'DateCell', 'start_date',"id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at",)
},
{
    title: <IntlMessages id="CampaignTable.title.e_date" />,
    key: 'end_date',
    width: 100,
    sorter: false,
    render: object => renderCell(object, 'DateCell', 'end_date',"id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at",)
},
{
  title: <IntlMessages id="CampaignTable.title.type" />,
  key: 'usage',
  width: 100,
  sorter: false,
  render: object => renderCell(object, 'CampaignTypeCell', 'usage',"id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at",)
},
{
    title: <IntlMessages id="CampaignTable.title.is_active" />,
    key: 'is_active',
    width: 100,
    sorter: false,
    render: object => renderCell(object, 'CampaignSwitchCell', 'is_active',"id","label","start_date","end_date","is_active","created_at","updated_at","deleted_at",)
},
]


const tblOffers= [
    {
        title: 'Campaigns',
        value: 'Campaigns',
        columns: clone(columns)
    }
];

export { columns, tblOffers };
