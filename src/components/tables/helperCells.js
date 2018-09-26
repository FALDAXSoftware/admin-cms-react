import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { Users } from '../../containers/Page/Users/users';
import { Coins } from '../../containers/Page/Coins/coins';
import { Icon, Switch } from 'antd';
import moment from 'moment';

const editUser = (value, first_name, last_name, email, city_town, street_address, phone_number, country, dob) => {
  Users.edit(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob);
}

const viewUser = (value, first_name, last_name, email, city_town, street_address, phone_number, country, dob) => {
  Users.view(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob);
}

const viewCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => {
  Coins.view(value, coin_name, coin_code, limit, wallet_address, created_at, is_active);
}

const editCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => {
  Coins.edit(value, coin_name, coin_code, limit, wallet_address, created_at, is_active);
}

const coinstatus = (is_active) => {
  Coins.changeStatus(is_active);
}

const deleteCoin = (value) => {
  Coins.deleteCoin(value);
}

const DateCell = data => <p>{(moment(data).format("DD MMM YYYY")) ? moment(data).format("DD MMM, YYYY") : ''}</p>;
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const TextCell = text => <p>{text}</p>;
const SwitchCell = (is_active) => <Switch defaultChecked={is_active} onChange={(is_active) => { coinstatus(is_active) }} />
const ActionCell = (value, first_name, last_name, email, city_town, street_address, phone_number, country, dob) => <div><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editUser(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(value, first_name, last_name, email, city_town, street_address, phone_number, country, dob)} /></div>;
const CoinActionCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <div><Icon type="delete" onClick={() => deleteCoin(value)} style={{ "cursor": "pointer" }} /><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active)} /></div>;
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
  SwitchCell,
  CoinActionCell,
  //EditCell
};
