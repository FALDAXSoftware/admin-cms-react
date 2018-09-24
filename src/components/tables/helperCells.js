import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { Users } from '../../containers/Page/Users/users';
import { Icon } from 'antd';
import moment from 'moment';

const deleteUser = (val) => {
  Users.delete(val);
}

const editUser = (val, email, first_name, last_name, bdate, gender, img) => {
  Users.edit(val, email, first_name, last_name, bdate, gender, img);
}

const viewUser = (val, email, first_name, last_name, bdate, gender, img, location) => {
  Users.view(val, email, first_name, last_name, bdate, gender, img, location);
}

const DateCell = data => <p>{(moment(data).format("DD MMM YYYY")) ? moment(data).format("DD MMM, YYYY") : ''}</p>;
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const TextCell = text => <p>{text}</p>;
const ActionCell = (val, email, first_name, last_name, bdate, img, location) => <div><Icon type="delete" onClick={() => deleteUser(val)} style={{ "cursor": "pointer" }} /><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editUser(val, email, first_name, last_name, bdate, img, location)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(val, email, first_name, last_name, bdate, img, location)} /></div>;
//const EditCell = (val, viewname, viewemail, msg, sub) => <div><Icon type="delete" onClick={() => enquirydata(val)} style={{ "cursor": "pointer" }} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewenquiry(viewname, viewemail, msg, sub)} /></div>;

export {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  EditableCell,
  DeleteCell,
  FilterDropdown,
  ActionCell,
  //EditCell
};
