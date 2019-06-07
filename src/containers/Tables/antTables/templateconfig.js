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

const columns = [
    {
        title: <IntlMessages id="antTable.title.name" />,
        key: 'name',
        width: 100,
        sorter: true,
        render: object => renderCell(object, 'TextCell', 'name')
    },
    {
        title: <IntlMessages id="antTable.title.details" />,
        key: 'action',
        width: 200,
        render: object => renderCell(object, 'TemplateActionCell', 'id', 'name', 'content',
            'note')
    }
];

const templateTableinfos = [
    {
        title: 'Email Templates',
        value: 'templateTable',
        columns: clone(columns)
    }
];

export { columns, templateTableinfos };
