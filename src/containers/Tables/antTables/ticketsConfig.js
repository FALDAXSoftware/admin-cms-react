import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, DateTimeCell, LogoutDateCell, PipelineCell, TagsCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, title = null, created_date = null,
    pipeline = null, Subject = null) => {
    const value = object[key];
    const content = object[title];
    const created_by = object[created_date];
    const pipeline_stage = object[pipeline];
    const subject = object[Subject];

    switch (type) {
        case 'DateTimeCell':
            return DateTimeCell(value, content, created_by, pipeline_stage, subject);
        case 'LogoutDateCell':
            return LogoutDateCell(value, content, created_by, pipeline_stage, subject);
        case 'PipelineCell':
            return PipelineCell(value, content, created_by, pipeline_stage, subject);
        case 'TagsCell':
            return TagsCell(value, content, created_by, pipeline_stage, subject);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="ticketTable.title.subject" />,
    key: 'subject',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'subject')
}, {
    title: <IntlMessages id="ticketTable.title.content" />,
    key: 'content',
    width: 100,
    render: object => renderCell(object, 'TagsCell', 'content')
}, {
    title: <IntlMessages id="ticketTable.title.created_at" />,
    key: 'created_by',
    width: 100,
    render: object => renderCell(object, 'DateTimeCell', 'created_by')
}, {
    title: <IntlMessages id="ticketTable.title.pipeline_stage" />,
    key: 'pipeline_stage',
    width: 100,
    render: object => renderCell(object, 'PipelineCell', 'pipeline_stage')
}];

const ticketsTableInfos = [
    {
        title: 'Tickets',
        value: 'ticketsTable',
        columns: clone(columns)
    }
];

export { columns, ticketsTableInfos };
