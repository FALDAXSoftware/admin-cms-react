import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { Users } from '../../containers/Page/Users/users';
import { Coins } from '../../containers/Page/Coins/coins';
import { Countries } from '../../containers/Page/Country/countries';
import { StateList } from '../../containers/Page/Country/StateList';
import { Roles } from '../../containers/Page/Roles/roles';
import { Employees } from '../../containers/Page/Employee/employee';
import { Pairs } from '../../containers/Page/Pairs/pairs';
import { Jobs } from '../../containers/Page/Jobs/jobs';
import { JobApplications } from '../../containers/Page/Jobs/jobApplications';
import { LimitManagement } from '../../containers/Page/LimitManagement/limitManagement';
import { KYC } from '../../containers/Page/KYC/kyc';
import { Fees } from '../../containers/Page/Fees/fees';
import { News } from '../../containers/Page/News/news';
import { Icon, Switch, Button, Tooltip } from 'antd';
import moment from 'moment';

//const S3BucketImageURL = 'https://s3.ap-south-1.amazonaws.com/varshalteamprivatebucket/';
const S3BucketImageURL = 'https://s3.us-east-2.amazonaws.com/production-static-asset/';

const viewUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state) => {
    Users.view(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state);
}

const editUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => {
    Users.editUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc);
}

const showReferrals = (value) => {
    Users.showReferrals(value);
}

const userStatus = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => {
    Users.changeStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc);
}

const viewCoin = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => {
    Coins.view(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon);
}

const editCoin = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => {
    Coins.edit(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon);
}

const coinstatus = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => {
    Coins.changeStatus(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon);
}

const deleteCoin = (value) => {
    Coins.deleteCoin(value);
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

const editRole = (value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active) => {
    Roles.editRole(value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active);
}

const roleStatus = (value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active) => {
    Roles.roleStatus(value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active);
}

const employeeStatus = (value, first_name, last_name, email, phone_number, address, role, is_active) => {
    Employees.employeeStatus(value, first_name, last_name, email, phone_number, address, role, is_active);
}

const editEmployee = (value, first_name, last_name, email, phone_number, address, role, is_active) => {
    Employees.editEmployee(value, first_name, last_name, email, phone_number, address, role, is_active);
}

const deleteEmployee = (value) => {
    Employees.deleteEmployee(value);
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

const viewJobApplication = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url) => {
    JobApplications.viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url);
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

const editFees = (value, trade_volume, maker_fee, taker_fee) => {
    Fees.editFees(value, trade_volume, maker_fee, taker_fee);
}

const newsStatus = (value, cover_image, title, link, posted_at, description, is_active, owner) => {
    News.newsStatus(value, cover_image, title, link, posted_at, description, is_active, owner);
}

const DateCell = data => <p>{data ? (moment.utc(data).local().format("DD MMM YYYY")) ? moment.utc(data).local().format("DD MMM YYYY") : '' : ''}</p>;
const UserDateCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at) => <p>{no_of_referrals && no_of_referrals > 0 ? (moment.utc(created_at).local().format("DD MMM YYYY")) ? moment.utc(created_at).local().format("DD MMM YYYY") : '' : ''}</p>;
const ReferralDateCell = (value, full_name, email, created_at, referral_by_email, referred_id) => <p>{referred_id !== null ? created_at ? (moment.utc(created_at).local().format("DD MMM YYYY")) ? moment.utc(created_at).local().format("DD MMM YYYY") : '' : '' : ''}</p>;
const TransactionTypeCell = data => <p>{data == 'send' ? 'Send' : 'Receive'}</p>
const VolumeCell = (value, currency, settle_currency, reqested_user_email, email, side, quantity, fill_price, maker_fee, taker_fee, volume, created_at) => <p>{quantity * fill_price}</p>;
const DateTimeCell = data => <p>{data ? (moment.utc(data).local().format("DD MMM YYYY HH:mm")) ? moment.utc(data).local().format("DD MMM, YYYY HH:mm") : '' : ''}</p>;
const ImageCell = src => <img style={{ width: '40px', height: '40px' }} src={S3BucketImageURL + src} />;
const StaticImageCell = src => <img style={{ width: '40px', height: '40px' }} src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const NewsLinkCell = (link, href) => <a href={link ? link : '#'} target="_blank">{link.slice(0, 35) + (link.length > 35 ? "..." : "")}</a>;
const ColorCell = (color) => <div style={{ background: color }} >{color}</div >;
const ContentCell = text => <p style={{ display: 'block', width: '290px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></p>;
const TextCell = text => <p dangerouslySetInnerHTML={{ __html: text }}></p>;
const TierCell = text => <p>Tier {text}</p>;
const referralActionCell = value => <div><Tooltip title="View"><Icon type="right-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} /></Tooltip></div>
const FeesCell = text => <p dangerouslySetInnerHTML={{ __html: text.toPrecision(2) + '%' }}></p>;
const ApproveCell = text => <p>{text == true ? 'Approved' : 'Dis-Approved'}</p>;
const IPCell = text => <p>{(text.split(":").length > 1) ? text.split(':')[3] : text}</p>;
const LegalityCell = text => <p >{text == 1 ? 'Legal' : text == 2 ? 'Illegal' : 'Neutral'}</p>;
const ButtonCell = (value) => <Button type="primary" onClick={() => showReferrals(value)} >Referred Users</Button>;
const SwitchCell = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) }} />
const StaticSwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) }} />
const UserSwitchCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) => <Switch checked={is_active} onChange={() => { userStatus(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc) }} />
const CountrySwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { countryStatus(value, name, legality, color, is_active) }} />
const StateSwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { stateStatus(value, name, legality, color, is_active) }} />
const NewsSwitchCell = (value, cover_image, title, link, posted_at, description, is_active, owner) => <Switch checked={is_active} onChange={() => { newsStatus(value, cover_image, title, link, posted_at, description, is_active, owner) }} />
const NewsDescCell = (value) => <Tooltip title={value}><p>{value.slice(0, 35) + (value.length > 35 ? "..." : "")}</p></Tooltip>
//const NewsActionsCell = (value, cover_image, title, link, posted_at, description, is_active, owner) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewNews(value, cover_image, title, link, posted_at, description, is_active, owner)} /></Tooltip></div>;
const ActionCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state)} /></Tooltip></div>;
const CoinActionCell = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteCoin(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCoin(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoin(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon)} /></Tooltip></div>;
const RolesActionCell = (value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteRole(value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active)} /></Tooltip></div>;
const CountryActionCell = (value, name, legality, color, stateCount, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCountry(value, name, legality, color, is_active)} /></Tooltip></div>;
const StateActionCell = (value, name, legality, color, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editState(value, name, legality, color, is_active)} /></Tooltip></div>;
const CountryButtonCell = (value, stateCount) => <Button type="primary" onClick={() => showStates(value)} disabled={stateCount > 0 ? false : true} >Show States</Button>;
const RoleSwitchCell = (value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active) => <Switch checked={is_active} onChange={() => { roleStatus(value, name, users, assets, countries, roles, employee, pairs, limit_management, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, referral, is_active) }} />
const EmployeeSwitchCell = (value, first_name, last_name, email, phone_number, address, role, is_active) => <Switch checked={is_active} onChange={() => { employeeStatus(value, first_name, last_name, email, phone_number, address, role, is_active) }} />
const EmployeeActionCell = (value, first_name, last_name, email, phone_number, address, role, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteEmployee(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editEmployee(value, first_name, last_name, email, phone_number, address, role, is_active)} /></Tooltip></div>;
const FeeSwitchCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <Switch checked={is_active} onChange={() => { pairStatus(value, name, maker_fee, taker_fee, created_at, is_active) }} />
const FeeActionCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editPair(value, name, maker_fee, taker_fee, created_at, is_active)} /></Tooltip></div>;
const LimitActionCell = (value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editLimit(value, user, monthly_deposit_crypto, monthly_deposit_fiat, monthly_withdraw_crypto, monthly_withdraw_fiat, daily_deposit_crypto, daily_deposit_fiat, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat)} /></Tooltip></div>;
const TagsCell = (value) => <Tooltip title={value}><p>{value.slice(0, 10) + (value.length > 10 ? "..." : "")}</p></Tooltip>
const JobActionCell = (value, position, location, short_desc, job_desc, category_id, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteJob(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editJob(value, position, location, short_desc, job_desc, category_id, is_active)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJob(value, position, location, short_desc, job_desc, category_id, is_active)} /></Tooltip></div>;
const JobSwitchCell = (value, position, location, short_desc, job_desc, category_id, is_active) => <Switch checked={is_active} onChange={() => { jobStatus(value, position, location, short_desc, job_desc, category_id, is_active) }} />
const JobButtonCell = (value) => <Button type="primary" onClick={() => showApplicants(value)} >Show Applications</Button>;
const JobAppActionCell = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url)} /></Tooltip></div>;
const KYCStatusCell = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => { direct_response != 'ACCEPT' ? <div><Tooltip title="Approve"><Icon type="check-circle" style={{ "marginLeft": "10px", "cursor": "pointer", "fontSize": "20px" }} onClick={() => approveKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type)} /></Tooltip><Tooltip title="Reject"><Icon type="close-circle" style={{ "marginLeft": "10px", "cursor": "pointer", "fontSize": "20px" }} onClick={() => rejectKYC(value, first_name, last_name, email, direct_response, kycDoc_details)} /></Tooltip></div> : 'b;la' };
const KYCActionCell = (value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewKYC(value, first_name, last_name, email, direct_response, kycDoc_details, front_doc, back_doc, ssn, webhook_response, address, country, city, zip, dob, id_type)} /></Tooltip></div>;
const LogoutDateCell = (value, is_logged_in, created_at, updated_at) => <p> {is_logged_in == false ? updated_at ? moment.utc(updated_at).local().format("DD MMM, YYYY HH:mm") : '' : ''}</p>;
const FeesActionCell = (value, trade_volume, maker_fee, taker_fee) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editFees(value, trade_volume, maker_fee, taker_fee)} /></Tooltip></div>;
const ReferralCell = (value) => <p>{value !== null ? value : 0}</p>
const PipelineCell = (text) => <p>{text == 1 ? 'NEW' : text == 2 ? 'Waiting on Customer Feedback' ? text == 3 ? 'Waiting on FALDAX' : 'AClosed' : 'BClosed' : 'CClosed'}</p>;

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
    ButtonCell,
    UserSwitchCell,
    CountrySwitchCell,
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
    FeeSwitchCell,
    DateTimeCell,
    FeeActionCell,
    LimitActionCell,
    TagsCell,
    JobActionCell,
    JobSwitchCell,
    JobButtonCell,
    JobAppActionCell,
    KYCStatusCell,
    KYCActionCell,
    LogoutDateCell,
    FeesActionCell,
    FeesCell,
    VolumeCell,
    StaticImageCell,
    NewsSwitchCell,
    NewsDescCell,
    NewsLinkCell,
    TierCell,
    referralActionCell,
    TransactionTypeCell,
    ReferralDateCell,
    ReferralCell,
    PipelineCell,
    UserDateCell
};
