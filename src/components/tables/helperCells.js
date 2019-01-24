import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { Users } from '../../containers/Page/Users/users';
import { Coins } from '../../containers/Page/Coins/coins';
import { StaticPages } from '../../containers/Page/StaticPages/staticPages';
import { Announce } from '../../containers/Page/Announce/announce';
import { Countries } from '../../containers/Page/Country/countries';
import { StateList } from '../../containers/Page/Country/StateList';
import { Roles } from '../../containers/Page/Roles/roles';
import { Employees } from '../../containers/Page/Employee/employee';
import { Blogs } from '../../containers/Page/Blogs/blogs';
import { Pairs } from '../../containers/Page/Pairs/pairs';
import { Jobs } from '../../containers/Page/Jobs/jobs';
import { JobApplications } from '../../containers/Page/Jobs/jobApplications';
import { Inquiry } from '../../containers/Page/Inquiry/inquiry';
import { CoinRequests } from '../../containers/Page/Coins/coinRequests';
import { LimitManagement } from '../../containers/Page/LimitManagement/limitManagement';
import { KYC } from '../../containers/Page/KYC/kyc';
import { Subscribers } from '../../containers/Page/Subscribe/subscribers';
import { Icon, Switch, Button, Tooltip } from 'antd';
import moment from 'moment';

//const S3BucketImageURL = 'https://s3.ap-south-1.amazonaws.com/varshalteamprivatebucket/';
const S3BucketImageURL = 'https://s3.us-east-2.amazonaws.com/production-static-asset/';

const viewUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => {
    Users.view(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc);
}

const showReferrals = (value) => {
    Users.showReferrals(value);
}

const userStatus = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => {
    Users.changeStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc);
}

const viewCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) => {
    Coins.view(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon);
}

const editCoin = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) => {
    Coins.edit(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon);
}

const coinstatus = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) => {
    Coins.changeStatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon);
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
    Announce.edit(value, name, title, content, is_active);
}

const viewTemplate = (value, name, title, content, is_active) => {
    Announce.view(value, name, title, content, is_active);
}

const deleteTemplate = (value) => {
    Announce.delete(value);
}

const sendAnnouncement = (value) => {
    Announce.announce(value);
}

const countryStatus = (value, name, legality, color, stateCount, is_active) => {
    Countries.countryStatus(value, name, legality, color, stateCount, is_active);
}

const editCountry = (value, name, legality, color, is_active) => {
    Countries.editCountry(value, name, legality, color, is_active);
}

const editState = (value, name, legality, color, is_active) => {
    StateList.editState(value, name, legality, color, is_active);
}

const stateStatus = (value, name, legality, color, is_active) => {
    StateList.stateStatus(value, name, legality, color, is_active);
}

const showStates = (value) => {
    Countries.showStates(value);
}

const deleteRole = (value) => {
    Roles.deleteRole(value);
}

const editRole = (value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active) => {
    Roles.editRole(value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active);
}

const roleStatus = (value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active) => {
    Roles.roleStatus(value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active);
}

const employeeStatus = (value, name, email, role, is_active) => {
    Employees.employeeStatus(value, name, email, role, is_active);
}

const editEmployee = (value, name, email, role, is_active) => {
    Employees.editEmployee(value, name, email, role, is_active);
}

const deleteEmployee = (value) => {
    Employees.deleteEmployee(value);
}

const editBlog = (value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) => {
    Blogs.editBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured);
}

const deleteBlog = (value) => {
    Blogs.deleteBlog(value);
}

const viewBlog = (value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) => {
    Blogs.viewBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured);
}

const blogStatus = (value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) => {
    Blogs.blogStatus(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured);
}

const pairStatus = (value, name, maker_fee, taker_fee, created_at, is_active) => {
    Pairs.pairStatus(value, name, maker_fee, taker_fee, created_at, is_active);
}

const editPair = (value, name, maker_fee, taker_fee, created_at, is_active) => {
    Pairs.editPair(value, name, maker_fee, taker_fee, created_at, is_active);
}

const editLimit = (value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat) => {
    LimitManagement.editLimit(value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat);
}

const editJob = (value, position, location, short_desc, job_desc, category_id, is_active) => {
    Jobs.editJob(value, position, location, short_desc, job_desc, category_id, is_active);
}

const viewJob = (value, position, location, short_desc, job_desc, category_id, is_active) => {
    Jobs.viewJob(value, position, location, short_desc, job_desc, category_id, is_active);
}

const deleteJob = (value) => {
    Jobs.deleteJob(value);
}

const jobStatus = (value, position, location, short_desc, job_desc, category_id, is_active) => {
    Jobs.jobStatus(value, position, location, short_desc, job_desc, category_id, is_active);
}

const showApplicants = (value) => {
    Jobs.showApplicants(value);
}

const viewJobApplication = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter) => {
    JobApplications.viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter);
}

const viewInquiry = (value, first_name, last_name, email, message, created_at) => {
    Inquiry.viewInquiry(value, first_name, last_name, email, message, created_at);
}

const deleteInquiry = (value, first_name, last_name, email, message, created_at) => {
    Inquiry.deleteInquiry(value, first_name, last_name, email, message, created_at);
}

const viewCoinReq = (value, coin_name, email, target_date, message, url, coin_symbol, country, elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site) => {
    CoinRequests.viewCoinReq(value, coin_name, email, target_date, message, url, coin_symbol, country, elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site);
}

const rejectKYC = (value, first_name, last_name, email, direct_response, kycDoc_details) => {
    KYC.rejectKYC(value, first_name, last_name, email, direct_response, kycDoc_details);
}

const approveKYC = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => {
    KYC.approveKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type);
}

const viewKYC = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => {
    KYC.viewKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type);
}

const deleteSubscriber = (value, email, is_news_feed, created_at) => {
    Subscribers.deleteSubscriber(value, email, is_news_feed, created_at);
}

const DateCell = data => <p>{(moment.utc(data).local().format("DD MMM YYYY")) ? moment.utc(data).local().format("DD MMM YYYY") : ''}</p>;
const DateTimeCell = data => <p>{(moment.utc(data).local().format("DD MMM YYYY HH:mm")) ? moment.utc(data).local().format("DD MMM, YYYY HH:mm") : ''}</p>;
const ImageCell = src => <img style={{ width: '40px', height: '40px' }} src={S3BucketImageURL + src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const ColorCell = (color) => <div style={{ background: color }} >{color}</div >;
const ContentCell = text => <p style={{ display: 'block', width: '290px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></p>;
const TextCell = text => <p dangerouslySetInnerHTML={{ __html: text }}></p>;
const ApproveCell = text => <p>{text == true ? 'Approved' : 'Dis-Approved'}</p>;
const IPCell = text => <p>{text.split(':')[3]}</p>;
const LegalityCell = text => <p >{text == 1 ? 'Legal' : text == 2 ? 'Illegal' : 'Neutral'}</p>;
const ButtonCell = (value) => <Button type="primary" onClick={() => showReferrals(value)} >Referred Users</Button>;
const SwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) }} />
const StaticSwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) }} />
const UserSwitchCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => <Switch checked={is_active} onChange={() => { userStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) }} />
const CountrySwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { countryStatus(value, name, legality, color, is_active) }} />
const StateSwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { stateStatus(value, name, legality, color, is_active) }} />
const ActionCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc)} /></Tooltip></div>;
const CoinActionCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteCoin(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoin(value, coin_name, coin_code, limit, wallet_address, created_at, is_active, coin_icon)} /></Tooltip></div>;
const PageActionCell = (value, name, title, content, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deletePage(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editPage(value, name, title, content, is_active)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewPage(value, name, title, content, is_active)} /></Tooltip></div>;
const AnnounceActionCell = (value, name, title, content, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteTemplate(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editTemplate(value, name, title, content, is_active)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewTemplate(value, name, title, content, is_active)} /></Tooltip></div>;
const AnnounceAnnouncementCell = (value) => <Button type="primary" onClick={() => sendAnnouncement(value)} > Announce </Button>;
const RolesActionCell = (value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteRole(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editRole(value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active)} /></Tooltip></div>;
const CountryActionCell = (value, name, legality, color, stateCount, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCountry(value, name, legality, color, is_active)} /></Tooltip></div>;
const StateActionCell = (value, name, legality, color, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editState(value, name, legality, color, is_active)} /></Tooltip></div>;
const CountryButtonCell = (value, stateCount) => <Button type="primary" onClick={() => showStates(value)} disabled={stateCount > 0 ? false : true} >Show States</Button>;
const RoleSwitchCell = (value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active) => <Switch checked={is_active} onChange={() => { roleStatus(value, name, users, coins, announcement, static_page, roles, countries, employee, pairs, blogs, limit_management, transaction_history, trade_history, withdraw_requests, coin_requests, inquiries, jobs, subscribe, contact_setting, kyc, is_active) }} />
const BlogSwitchCell = (value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) => <Switch checked={is_featured} onChange={() => { blogStatus(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) }} />
const EmployeeSwitchCell = (value, name, email, role, is_active) => <Switch checked={is_active} onChange={() => { employeeStatus(value, name, email, role, is_active) }} />
const EmployeeActionCell = (value, name, email, role, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteEmployee(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editEmployee(value, name, email, role, is_active)} /></Tooltip></div>;
const BlogActionCell = (value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteBlog(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image, is_featured)} /></Tooltip></div>;
const FeeSwitchCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <Switch checked={is_active} onChange={() => { pairStatus(value, name, maker_fee, taker_fee, created_at, is_active) }} />
const FeeActionCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editPair(value, name, maker_fee, taker_fee, created_at, is_active)} /></Tooltip></div>;
const LimitActionCell = (value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editLimit(value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat)} /></Tooltip></div>;
const TagsCell = (value) => <Tooltip title={value}><p>{value.slice(0, 10) + (value.length > 10 ? "..." : "")}</p></Tooltip>
const JobActionCell = (value, position, location, short_desc, job_desc, category_id, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteJob(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editJob(value, position, location, short_desc, job_desc, category_id, is_active)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJob(value, position, location, short_desc, job_desc, category_id, is_active)} /></Tooltip></div>;
const JobSwitchCell = (value, position, location, short_desc, job_desc, category_id, is_active) => <Switch checked={is_active} onChange={() => { jobStatus(value, position, location, short_desc, job_desc, category_id, is_active) }} />
const JobButtonCell = (value) => <Button type="primary" onClick={() => showApplicants(value)} >Show Applications</Button>;
const JobAppActionCell = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter)} /></Tooltip></div>;
const InquiryActionCell = (value, first_name, last_name, email, message, created_at) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteInquiry(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewInquiry(value, first_name, last_name, email, message, created_at)} /></Tooltip></div>;
const SubscriberActionCell = (value, first_name, last_name, email, message, created_at) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteSubscriber(value)} style={{ "cursor": "pointer" }} /></Tooltip></div>;
const CoinReqActionCell = (value, coin_name, email, target_date, message, url, coin_symbol, country, elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoinReq(value, coin_name, email, target_date, message, url, coin_symbol, country, elevator_pitch, first_name, last_name, skype, ref_site, phone, other_site)} /></Tooltip></div>;
const KYCStatusCell = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => { direct_response != 'ACCEPT' ? <div><Tooltip title="Approve"><Icon type="check-circle" style={{ "marginLeft": "10px", "cursor": "pointer", "fontSize": "20px" }} onClick={() => approveKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type)} /></Tooltip><Tooltip title="Reject"><Icon type="close-circle" style={{ "marginLeft": "10px", "cursor": "pointer", "fontSize": "20px" }} onClick={() => rejectKYC(value, first_name, last_name, email, direct_response, kycDoc_details)} /></Tooltip></div> : 'b;la' };
const KYCActionCell = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type)} /></Tooltip></div>;

export {
    IPCell,
    DateCell,
    ImageCell,
    LinkCell,
    TextCell,
    ApproveCell,
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
    AnnounceActionCell,
    CountrySwitchCell,
    AnnounceAnnouncementCell,
    ContentCell,
    RolesActionCell,
    CountryActionCell,
    ColorCell,
    CountryButtonCell,
    LegalityCell,
    StateActionCell,
    StateSwitchCell,
    RoleSwitchCell,
    EmployeeSwitchCell,
    EmployeeActionCell,
    BlogActionCell,
    FeeSwitchCell,
    DateTimeCell,
    FeeActionCell,
    LimitActionCell,
    TagsCell,
    JobActionCell,
    JobSwitchCell,
    JobButtonCell,
    JobAppActionCell,
    InquiryActionCell,
    CoinReqActionCell,
    KYCStatusCell,
    KYCActionCell,
    BlogSwitchCell,
    SubscriberActionCell
};
