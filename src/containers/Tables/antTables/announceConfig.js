import React from 'react';
import clone from 'clone';
import IntlMessages from '../../../components/utility/intlMessages';
import {
    TextCell, AnnounceActionCell, StaticSwitchCell, AnnounceAnnouncementCell, ContentCell
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key, page_name = null, page_title = null, desc = null, active = null) => {
    const value = object[key];
    const name = object[page_name];
    const title = object[page_title];
    const content = object[desc];
    const is_active = object[active];

    switch (type) {
        case 'StaticSwitchCell':
            return StaticSwitchCell(value, name, title, content, is_active);
        case 'ContentCell':
            return ContentCell(value, name, title, content, is_active);
        case 'AnnounceActionCell':
            return AnnounceActionCell(value, name, title, content, is_active);
        case 'AnnounceAnnouncementCell':
            return AnnounceAnnouncementCell(value);
        default:
            return TextCell(value);
    }
};

const columns = [{
    title: <IntlMessages id="announce.title.slug" />,
    key: 'name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'name')
}, {
    title: <IntlMessages id="staticPageTable.title.title" />,
    key: 'title',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'title')
}, {
    title: <IntlMessages id="staticPageTable.title.Actions" />,
    key: 'action',
    width: 200,
    render: object => renderCell(object,
        'AnnounceActionCell', 'id', 'name', 'title', 'content', 'is_active')
}, {
    title: <IntlMessages id="staticPageTable.title.Announcements" />,
    key: 'announcement',
    width: 200,
    render: object => renderCell(object,
        'AnnounceAnnouncementCell', 'id')
}];

const AnnounceInfos = [
    {
        title: 'Announcement',
        value: 'AnnouncementTable',
        columns: clone(columns)
    }
];

export { columns, AnnounceInfos };
