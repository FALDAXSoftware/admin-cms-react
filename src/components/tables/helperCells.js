import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { Users } from '../../containers/Page/Users/users';
import { Coins } from '../../containers/Page/Coins/coins';
import { StaticPages } from '../../containers/Page/StaticPages/staticPages';
import { EmailTemplates } from '../../containers/Page/EmailTemplates/emailTemplates';
import { Countries } from '../../containers/Page/Country/countries';
import { Icon, Switch, Button } from 'antd';
import moment from 'moment';

const viewUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) => {
  Users.view(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active);
}

const showReferrals = (value) => {
  Users.showReferrals(value);
}

const userStatus = (value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) => {
  Users.changeStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active);
}

const viewCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => {
  Coins.view(value, coin_name, coin_code, limit, wallet_address, created_at, is_active);
}

const editCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => {
  Coins.edit(value, coin_name, coin_code, limit, wallet_address, created_at, is_active);
}

const coinstatus = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => {
  Coins.changeStatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active);
}

const deleteCoin = (value) => {
  Coins.deleteCoin(value);
}

const editPage = (value, name, title, content, is_active) => {
  StaticPages.edit(value, name, title, content, is_active);
}

const viewPage = (value, name, title, content, is_active) => {
  StaticPages.view(value, name, title, content, is_active);
}

const deletePage = (value) => {
  StaticPages.delete(value);
}

const editTemplate = (value, name, title, content, is_active) => {
  EmailTemplates.edit(value, name, title, content, is_active);
}

const viewTemplate = (value, name, title, content, is_active) => {
  EmailTemplates.view(value, name, title, content, is_active);
}

const deleteTemplate = (value) => {
  EmailTemplates.delete(value);
}

const sendAnnouncement = (value) => {
  EmailTemplates.announce(value);
}

const countryStatus = (value, name, country_code, is_active) => {
  Countries.countryStatus(value, name, country_code, is_active);
}

const DateCell = data => <p>{(moment(data).format("DD MMM YYYY")) ? moment(data).format("DD MMM, YYYY") : ''}</p>;
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const ContentCell = text => <p style={{ display: 'block', width: '290px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></p>;
const TextCell = text => <p dangerouslySetInnerHTML={{ __html: text }}></p>;
const ButtonCell = (value) => <Button type="primary" onClick={() => showReferrals(value)} >Show Referrals </Button>;
const SwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) }} />
const StaticSwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) }} />
const UserSwitchCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) => <Switch checked={is_active} onChange={() => { userStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) }} />
const CountrySwitchCell = (value, name, country_code, is_active) => <Switch checked={is_active} onChange={() => { countryStatus(value, name, country_code, is_active) }} />
const ActionCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active) => <div><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(value, profile_pic, first_name, last_name, email, city_town, street_address, phone_number, country, dob, is_active)} /></div>;
const CoinActionCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <div><Icon type="delete" onClick={() => deleteCoin(value)} style={{ "cursor": "pointer" }} /><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active)} /></div>;
const PageActionCell = (value, name, title, content, is_active) => <div><Icon type="delete" onClick={() => deletePage(value)} style={{ "cursor": "pointer" }} /><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editPage(value, name, title, content, is_active)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewPage(value, name, title, content, is_active)} /></div>;
const TemplateActionCell = (value, name, title, content, is_active) => <div><Icon type="delete" onClick={() => deleteTemplate(value)} style={{ "cursor": "pointer" }} /><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editTemplate(value, name, title, content, is_active)} /><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewTemplate(value, name, title, content, is_active)} /></div>;
const TemplateAnnouncementCell = (value) => <Button type="primary" onClick={() => sendAnnouncement(value)} > Announce </Button>;

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
  StaticSwitchCell,
  PageActionCell,
  ButtonCell,
  UserSwitchCell,
  TemplateActionCell,
  CountrySwitchCell,
  TemplateAnnouncementCell,
  ContentCell,
};
