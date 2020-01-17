import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell,
    TemplateActionCell,
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, fname = null, emailContent = null, emailNote = null) => {
    const value = object[key];
    const name = object[fname];
    const content = object[emailContent];
    const note = object[emailNote];

    switch (type) {
        case 'TemplateActionCell':
            return TemplateActionCell(value, name, content, note);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="emailTable.title.actions" />,
    key: 'action',
    width: 75,
    align:"left",
    render: object => renderCell(object, 'TemplateActionCell', 'id', 'name', 'content',
        'note')
}, {
    title: <IntlMessages id="antTable.title.name" />,
    key: 'name',
    align:"left",
    render: object => renderCell(object, 'TextCell', 'name')
}];

const templateTableinfos = [
    {
        title: 'Email Templates',
        value: 'templateTable',
        columns: clone(columns)
    }
];

export { columns, templateTableinfos };
