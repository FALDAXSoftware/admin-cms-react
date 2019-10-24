import React from 'react';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import { ActiveUsers } from '../../containers/Page/Users/activeUsers';
import { InActiveUsers } from '../../containers/Page/Users/inActiveUsers';
import { Assets } from '../../containers/Page/Assets/assets';
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
import { AccountClass } from '../../containers/Page/AccountClass/accountClass';
import { EmailTemplates } from '../../containers/Page/EmailTemplates/emailTemplates';
import { NewsSources } from '../../containers/Page/NewsSource/newsSources';
import { WithdrawRequest } from '../../containers/Page/WithdrawRequest/withdrawRequest';
import { Icon, Switch, Button, Tooltip } from 'antd';
import moment from 'moment';
import { JobCategory } from '../../containers/Page/Jobs/jobsCategory';
import ProfileWhitelist from '../../containers/Page/profileWhitelist';
import Whitelist from '../../containers/Page/Employee/employeeWhitelist';
import TwoFactorRequests from '../../containers/Page/TwoFactorRequest/TwoFactorRequests';
import Tier from '../../containers/Page/Tiers/tiers';
import PendingRequests from '../../containers/Page/Tiers/pendingTierRequests';
import create from 'antd/lib/icon/IconFont';

//const S3BucketImageURL = 'https://s3.ap-south-1.amazonaws.com/varshalteamprivatebucket/';
const S3BucketImageURL = 'https://s3.us-east-2.amazonaws.com/production-static-asset/';

const viewActiveUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state) => {
    ActiveUsers.view(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state);
}

const editActiveUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at) => {
    ActiveUsers.editUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at);
}

const deleteActiveUser = (value) => {
    ActiveUsers.deleteUser(value);
}

const viewUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state) => {
    InActiveUsers.view(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state);
}

const editUser = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at) => {
    InActiveUsers.editUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at);
}

const deleteUser = (value) => {
    InActiveUsers.deleteUser(value);
}

const viewCoin = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon, warm_wallet_address, hot_send_wallet_address, hot_receive_wallet_address, custody_wallet_address) => {
    Assets.view(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon, warm_wallet_address, hot_send_wallet_address, hot_receive_wallet_address, custody_wallet_address);
}

const editCoin = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => {
    Assets.edit(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon);
}

const coinstatus = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => {
    Assets.changeStatus(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon);
}

const deleteCoin = (value) => {
    Assets.deleteCoin(value);
}

const assetWallet = (value, coin_name, coin_code) => {
    Assets.assetWallet(value, coin_name, coin_code);
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

const editRole = (value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active) => {
    Roles.editRole(value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active);
}

const roleStatus = (value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active) => {
    Roles.roleStatus(value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active);
}

const employeeStatus = (value, first_name, last_name, email, phone_number, address, role, role_id, is_active) => {
    Employees.employeeStatus(value, first_name, last_name, email, phone_number, address, role, role_id, is_active);
}

const editEmployee = (value, first_name, last_name, email, phone_number, address, role, role_id, is_active) => {
    Employees.editEmployee(value, first_name, last_name, email, phone_number, address, role, role_id, is_active);
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

const editLimit = (value, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat) => {
    LimitManagement.editLimit(value, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat);
}

const editJob = (value, position, location, short_desc, job_desc, category_id, is_active, category) => {
    Jobs.editJob(value, position, location, short_desc, job_desc, category_id, is_active, category);
}

const viewJob = (value, position, location, short_desc, job_desc, category_id, is_active, category) => {
    Jobs.viewJob(value, position, location, short_desc, job_desc, category_id, is_active, category);
}

const deleteJob = (value) => {
    Jobs.deleteJob(value);
}

const jobStatus = (value, position, location, short_desc, job_desc, category_id, is_active, category) => {
    Jobs.jobStatus(value, position, location, short_desc, job_desc, category_id, is_active, category);
}

const showApplicants = (value) => {
    Jobs.showApplicants(value);
}

const viewJobApplication = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url) => {
    JobApplications.viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url);
}

const viewKYC = (value, mtid, first_name, last_name, email, direct_response, kycDoc_details, webhook_response, address, country, city, zip, dob, id_type, created_at) => {
    KYC.viewKYC(value, mtid, first_name, last_name, email, direct_response, kycDoc_details, webhook_response, address, country, city, zip, dob, id_type, created_at);
}

const editFees = (value, trade_volume, maker_fee, taker_fee) => {
    Fees.editFees(value, trade_volume, maker_fee, taker_fee);
}

const newsStatus = (value, cover_image, title, link, posted_at, description, is_active, owner) => {
    News.newsStatus(value, cover_image, title, link, posted_at, description, is_active, owner);
}

const editAccountClass = (value, class_name) => {
    AccountClass.editAccountClass(value, class_name);
}

const deleteAccountClass = (value, class_name) => {
    AccountClass.deleteAccountClass(value, class_name);
}

const editTemplate = (value, name, content, note) => {
    EmailTemplates.editTemplate(value, name, content, note);
}

const newsSourceStatus = (value, source_name, slug, is_active) => {
    NewsSources.newsSourceStatus(value, source_name, slug, is_active);
}

const approveWithdrawReq = (value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at) => {
    WithdrawRequest.approveWithdrawReq(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at);
}

const declineWithdrawReq = (value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at) => {
    WithdrawRequest.declineWithdrawReq(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at);
}

const jobCategoryStatus = (value, category, is_active) => {
    JobCategory.jobCategoryStatus(value, category, is_active);
}

const updateCategory = (value, category, is_active) => {
    JobCategory.updateCategory(value, category, is_active);
}

const deleteProfileWhitelistIP = (value) => {
    ProfileWhitelist.deleteProfileWhitelistIP(value);
}

const deleteWhitelistIP = (value) => {
    Whitelist.deleteWhitelistIP(value);
}

const approve2FA = (value, full_name, uploaded_file, status, reason, created_at) => {
    TwoFactorRequests.approve2FA(value, full_name, uploaded_file, status, reason, created_at)
}

const reject2FA = (value, full_name, email, uploaded_file, status, reason, created_at) => {
    TwoFactorRequests.reject2FA(value, full_name, email, uploaded_file, status, reason, created_at)
}

const viewRequest = (value, full_name, email, uploaded_file, status, reason, created_at) => {
    TwoFactorRequests.viewRequest(value, full_name, email, uploaded_file, status, reason, created_at)
}

const editTier = (value) => {
    Tier.editTier(value);
}

const viewPendingReq = (value, first_name, last_name, tier_step, is_approved, user_id) => {
    PendingRequests.viewPendingReq(value, first_name, last_name, tier_step, is_approved, user_id);
}

const approvePendingReq = (value, first_name, last_name, tier_step, is_approved, user_id) => {
    PendingRequests.approvePendingReq(value, first_name, last_name, tier_step, is_approved, user_id);
}

const transactionDetails = (value, email, source_address, destination_address, amount, transaction_type, created_at, transaction_id, coin_id, coin_code) => {
    let url = '';
    switch (coin_id) {
        case 'tbtc':
            url = "https://blockstream.info/testnet/tx/" + created_at;
            break;
        case 'txrp':
            url = "https://test.bithomp.com/explorer/" + created_at;
            break;
        case 'tltc':
            url = "https://blockexplorer.one/litecoin/testnet/tx/" + created_at;
            break;
        case 'tbch':
            url = "https://explorer.bitcoin.com/tbch/tx/" + created_at;
            break;
        default:
            url = '';
    }
    return url !== '' ? <a target="_blank" href={url}>{created_at}</a> : <span>{created_at}</span>;
}

const DateCell = data => <p>{data ? (moment.utc(data).local().format("DD MMM YYYY")) ? moment.utc(data).local().format("DD MMM YYYY") : '' : ''}</p>;
const UserDateCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at) => <p>{no_of_referrals && no_of_referrals > 0 ? (moment.utc(created_at).local().format("DD MMM YYYY")) ? moment.utc(created_at).local().format("DD MMM YYYY") : '' : ''}</p>;
const ReferralDateCell = (value, full_name, email, created_at, referral_by_email, referred_id, refered_by, no_of_referral) => <p>{created_at ? (moment.utc(created_at).local().format("DD MMM YYYY")) ? moment.utc(created_at).local().format("DD MMM YYYY") : '' : ''}</p>;
const TransactionTypeCell = data => <p>{data == 'send' ? 'Send' : 'Receive'}</p>
const VolumeCell = (value, currency, settle_currency, reqested_user_email, email, side, quantity, price, fill_price, maker_fee, taker_fee, volume, created_at) => <p>{quantity * fill_price}</p>;
const ObjectCell = (value,execution_report) => <span>{JSON.stringify(execution_report)}</span>;
const DateTimeCell = data => <p>{data ? (moment.utc(data).local().format("DD MMM YYYY HH:mm")) ? moment.utc(data).local().format("DD MMM, YYYY HH:mm") : '' : ''}</p>;
const DateTimeSecCell = data => <p>{data ? (moment.utc(data).local().format("DD MMM YYYY HH:mm:ss")) ? moment.utc(data).local().format("DD MMM, YYYY HH:mm:ss") : '' : ''}</p>;
const ImageCell = src => <img style={{ width: '40px', height: '40px' }} src={S3BucketImageURL + src} />;
const UserImageCell = src => <img style={{ width: '40px', height: '40px' }} src={(!src || src == null) ? S3BucketImageURL + 'profile/def_profile.jpg' : S3BucketImageURL + src} />;
const StaticImageCell = src => <img style={{ width: '40px', height: '40px' }} src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const NewsLinkCell = (link, href) => <a href={link ? link : '#'} target="_blank">{link.slice(0, 35) + (link.length > 35 ? "..." : "")}</a>;
const ColorCell = (color) => <div style={{ background: color }} >{color}</div >;
const ContentCell = text => <p style={{ display: 'block', width: '290px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></p>;
const TextCell = text => <p dangerouslySetInnerHTML={{ __html: text }}></p>;
const FullNameTextCell = (value, fname, lname) => <p>{fname} {lname}</p>;
const DaysCell = text => <p>{text == 0 ? 'Permanent' : text + ' Days'}</p>;
const TicketSubjectCell = text => <p style={{ cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: text }}></p>;
const LocationCell = text => <Tooltip title={text}><p style={{ display: 'block', width: '100px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></p></Tooltip>;
const TierCell = text => <p>Tier {text}</p>;
const referralActionCell = value => <Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} /></Tooltip>
const FeesCell = text => <p dangerouslySetInnerHTML={{ __html: text.toPrecision(2) + '%' }}></p>;
const ApproveCell = text => <p>{text == true ? 'Approved' : 'Dis-Approved'}</p>;
const IPCell = text => <p>{(text.split(":").length > 1) ? text.split(':')[3] : text}</p>;
const LegalityCell = text => <p >{text == 1 ? 'Legal' : text == 2 ? 'Illegal' : text == 3 ? 'Neutral' : 'Partial Services Available'}</p>;
const SwitchCell = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon) }} />
const StaticSwitchCell = (value, coin_name, coin_code, limit, wallet_address, created_at, is_active) => <Switch checked={is_active} onChange={() => { coinstatus(value, coin_name, coin_code, limit, wallet_address, created_at, is_active) }} />
const CountrySwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { countryStatus(value, name, legality, color, is_active) }} />
const StateSwitchCell = (value, name, legality, color, is_active) => <Switch checked={is_active} onChange={() => { stateStatus(value, name, legality, color, is_active) }} />
const NewsSwitchCell = (value, cover_image, title, link, posted_at, description, is_active, owner) => <Switch checked={is_active} onChange={() => { newsStatus(value, cover_image, title, link, posted_at, description, is_active, owner) }} />
const NewsDescCell = (value) => <Tooltip title={value}><p>{value.slice(0, 35) + (value.length > 35 ? "..." : "")}</p></Tooltip>
//const NewsActionsCell = (value, cover_image, title, link, posted_at, description, is_active, owner) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewNews(value, cover_image, title, link, posted_at, description, is_active, owner)} /></Tooltip></div>;
const ActionCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at)} /></Tooltip>{!deleted_at ? <React.Fragment><Tooltip title="View"><Icon type="delete" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => deleteUser(value)} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at)} /></Tooltip></React.Fragment> : ''}</div>;
const ActiveUserActionCell = (value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewActiveUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at)} /></Tooltip>{!deleted_at ? <React.Fragment><Tooltip title="View"><Icon type="delete" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => deleteActiveUser(value)} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editActiveUser(value, profile_pic, first_name, last_name, email, city_town, street_address, street_address_2, phone_number, country, dob, is_active, kyc, date_format, account_tier, account_class, state, no_of_referrals, created_at, deleted_at)} /></Tooltip></React.Fragment> : ''}</div>;
const CoinActionCell = (value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon, warm_wallet_address, hot_send_wallet_address, hot_receive_wallet_address, custody_wallet_address) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteCoin(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCoin(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon, warm_wallet_address, hot_send_wallet_address, hot_receive_wallet_address, custody_wallet_address)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewCoin(value, coin_name, coin_code, min_limit, max_limit, wallet_address, created_at, is_active, isERC, coin_icon, warm_wallet_address, hot_send_wallet_address, hot_receive_wallet_address, custody_wallet_address)} /></Tooltip><Tooltip><Icon type="wallet" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => assetWallet(value, coin_name, coin_code)} /></Tooltip></div>;
const RolesActionCell = (value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteRole(value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active)} /></Tooltip></div>;
const CountryActionCell = (value, name, legality, color, stateCount, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editCountry(value, name, legality, color, is_active)} /></Tooltip></div>;
const StateActionCell = (value, name, legality, color, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editState(value, name, legality, color, is_active)} /></Tooltip></div>;
const CountryButtonCell = (value, stateCount) => <Button type="primary" onClick={() => showStates(value)} disabled={stateCount > 0 ? false : true} >Show States</Button>;
const RoleSwitchCell = (value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active) => <Switch checked={is_active} onChange={() => { roleStatus(value, name, users, assets, countries, roles, employee, pairs, transaction_history, trade_history, withdraw_requests, jobs, kyc, fees, panic_button, news, is_referral, add_user, is_active) }} />
const EmployeeSwitchCell = (value, first_name, last_name, email, phone_number, address, role, role_id, is_active) => <Switch checked={is_active} onChange={() => { employeeStatus(value, first_name, last_name, email, phone_number, address, role, role_id, is_active) }} />
const EmployeeActionCell = (value, first_name, last_name, email, phone_number, address, role, role_id, is_active) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteEmployee(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editEmployee(value, first_name, last_name, email, phone_number, address, role, role_id, is_active)} /></Tooltip></div>;
const FeeSwitchCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <Switch checked={is_active} onChange={() => { pairStatus(value, name, maker_fee, taker_fee, created_at, is_active) }} />
const FeeActionCell = (value, name, maker_fee, taker_fee, created_at, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editPair(value, name, maker_fee, taker_fee, created_at, is_active)} /></Tooltip></div>;
const LimitActionCell = (value, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editLimit(value, daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat)} /></Tooltip></div>;
const TagsCell = (value) => <Tooltip title={value}><p>{value.slice(0, 10) + (value.length > 10 ? "..." : "")}</p></Tooltip>
const JobActionCell = (value, position, location, short_desc, job_desc, category_id, is_active, category) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteJob(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editJob(value, position, location, short_desc, job_desc, category_id, is_active, category)} /></Tooltip><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJob(value, position, location, short_desc, job_desc, category_id, is_active, category)} /></Tooltip></div>;
const JobSwitchCell = (value, position, location, short_desc, job_desc, category_id, is_active, category) => <Switch checked={is_active} onChange={() => { jobStatus(value, position, location, short_desc, job_desc, category_id, is_active, category) }} />
const JobButtonCell = (value) => <Button type="primary" onClick={() => showApplicants(value)} >Show Applications</Button>;
const JobAppActionCell = (value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewJobApplication(value, first_name, last_name, email, phone_number, created_at, resume, cover_letter, linkedin_profile, website_url)} /></Tooltip></div>;
const KYCActionCell = (value, mtid, first_name, last_name, email, direct_response, kycDoc_details, webhook_response, address, country, city, zip, dob, id_type, created_at) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewKYC(value, mtid, first_name, last_name, email, direct_response, kycDoc_details, webhook_response, address, country, city, zip, dob, id_type, created_at)} /></Tooltip></div>;
const LogoutDateCell = (value, is_logged_in, created_at, updated_at) => <p> {is_logged_in == false ? updated_at ? moment.utc(updated_at).local().format("DD MMM, YYYY HH:mm") : '' : ''}</p>;
const FeesActionCell = (value, trade_volume, maker_fee, taker_fee) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editFees(value, trade_volume, maker_fee, taker_fee)} /></Tooltip></div>;
const ReferralCell = (value) => <p>{value !== null ? value : 0}</p>
const PipelineCell = (text) => <p>{text == 1 ? 'NEW' : text == 2 ? 'Waiting on Customer Feedback' ? text == 3 ? 'Waiting on FALDAX' : 'AClosed' : 'BClosed' : 'CClosed'}</p>;
const AccountClassActionCell = (value, class_name) => <div><Tooltip title="Delete"><Icon type="delete" onClick={() => deleteAccountClass(value)} style={{ "cursor": "pointer" }} /></Tooltip><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editAccountClass(value, class_name)} /></Tooltip></div>;
const TemplateActionCell = (value, name, content, note) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editTemplate(value, name, content, note)} /></Tooltip></div>;
const NewsSourceSwitchCell = (value, source_name, slug, is_active) => <Switch checked={is_active} onChange={() => { newsSourceStatus(value, source_name, slug, is_active) }} />
const WithdrawActionCell = (value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at) => <div>{(is_approve == null) ? <div><Button style={{ marginRight: '15px' }} type="primary" onClick={() => approveWithdrawReq(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at)} >Approve</Button><Button style={{ margingLeft: '15px' }} type="danger" onClick={() => declineWithdrawReq(value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at)} >Decline</Button></div> : ''}</div>;
const WithdrawStatusCell = (value, email, source_address, destination_address, amount, transaction_type, is_approve, user_id, coin_id, is_executed, created_at) => <p>{is_approve == null ? 'Pending' : is_approve == true ? 'Approved' : 'Dis-Approved'}</p>;
const JobCatSwitchCell = (value, category, is_active) => <Switch checked={is_active} onChange={() => { jobCategoryStatus(value, category, is_active) }} />
const JobCatActionCell = (value, category, is_active) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => updateCategory(value, category, is_active)} /></Tooltip></div>;
const WhiteListActionCell = (value, ip, time, is_permanent) => <div>{!is_permanent ? <Tooltip title="Delete"><Icon type="delete" onClick={() => deleteWhitelistIP(value)} style={{ "cursor": "pointer" }} /></Tooltip> : '-'}</div>;
const ProfileWhiteListActionCell = (value, ip, time, is_permanent) => <div>{!is_permanent ? <Tooltip title="Delete"><Icon type="delete" onClick={() => deleteProfileWhitelistIP(value)} style={{ "cursor": "pointer" }} /></Tooltip> : '-'}</div>;
const TwoFAActionCell = (value, full_name, email, uploaded_file, status, reason, created_at) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewRequest(value, full_name, email, uploaded_file, status, reason, created_at)} /></Tooltip>{status.trim() !== 'open' ? '' : <React.Fragment><Tooltip title="Approve"><Icon theme="twoTone" type="check-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => approve2FA(value, full_name, email, uploaded_file, status, created_at)} /></Tooltip><Tooltip title="Reject"><Icon theme="twoTone" twoToneColor="#FF0000" type="close-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => reject2FA(value, full_name, email, uploaded_file, status, created_at)} /></Tooltip></React.Fragment>}</div>;
const TierReqCell = (value, tier_step, daily_withdraw_limit, monthly_withdraw_limit, minimum_activity_thresold, requirements) => <div>{Object.keys(requirements).map((req) => <span>{requirements[req]}<br /></span>)}</div>
const TierThresholdCell = (value, tier_step, daily_withdraw_limit, monthly_withdraw_limit, minimum_activity_thresold, requirements) => <div>{Object.keys(minimum_activity_thresold).map((threshold) => <span>{minimum_activity_thresold[threshold]}<br /></span>)}</div>
const TierActionCell = (value) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editTier(value)} /></Tooltip></div>
const TierReqActionCell = (value) => <div><Tooltip title="Edit"><Icon type="edit" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => editTier(value)} /></Tooltip></div>
const PendingTierReqActionCell = (value, first_name, last_name, tier_step, is_approved, user_id) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewPendingReq(value, first_name, last_name, tier_step, is_approved, user_id)} /></Tooltip><Switch style={{ "marginLeft": "10px" }} checked={is_approved} onChange={() => { approvePendingReq(value, first_name, last_name, tier_step, is_approved, user_id) }} /></div>
const SimplexStatusCell = (value, payment_id, quote_id, currency, settle_currency, email, side, quantity, fill_price, simplex_payment_status, created_at) => <div>{simplex_payment_status == 1 ? 'Under Approval' : simplex_payment_status == 2 ? 'Approved' : 'Cancelled'}</div>
const TransactionHashCell = (value, email, source_address, destination_address, amount, transaction_type, created_at, transaction_id, coin_id, coin_code) => <div>{transactionDetails(value, email, source_address, destination_address, amount, transaction_type, created_at, transaction_id, coin_id, coin_code)}</div>
const ReferralNameCell = (value, full_name, deleted_at) => <div>{deleted_at !== null ? <Tooltip title={`${full_name} has been deleted`}><Icon type="info-circle" style={{ "margin": "0 10px 0 10px", "cursor": "pointer" }} />{full_name}</Tooltip> : full_name}</div>

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
    ActiveUserActionCell,
    SwitchCell,
    CoinActionCell,
    StaticSwitchCell,
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
    DateTimeSecCell,
    FeeActionCell,
    LimitActionCell,
    TagsCell,
    JobActionCell,
    JobSwitchCell,
    JobButtonCell,
    JobAppActionCell,
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
    UserDateCell,
    AccountClassActionCell,
    TemplateActionCell,
    NewsSourceSwitchCell,
    WithdrawActionCell,
    WithdrawStatusCell,
    JobCatSwitchCell,
    JobCatActionCell,
    UserImageCell,
    TicketSubjectCell,
    WhiteListActionCell,
    ProfileWhiteListActionCell,
    DaysCell,
    LocationCell,
    TwoFAActionCell,
    TierReqCell,
    TierThresholdCell,
    TierActionCell,
    FullNameTextCell,
    TierReqActionCell,
    PendingTierReqActionCell,
    SimplexStatusCell,
    TransactionHashCell,
    ReferralNameCell,
    ObjectCell
};
