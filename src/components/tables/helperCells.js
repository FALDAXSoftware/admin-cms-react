import React from "react";
import DeleteCell from "./deleteCell";
import EditableCell from "./editableCell";
import FilterDropdown from "./filterDropdown";
import { ActiveUsers } from "../../containers/Page/Users/activeUsers";
import { InActiveUsers } from "../../containers/Page/Users/inActiveUsers";
import { Assets } from "../../containers/Page/Assets/assets";
import { Countries } from "../../containers/Page/Country/countries";
import { StateList } from "../../containers/Page/Country/StateList";
import Roles from "../../containers/Page/Roles/viewRoles";
import { Employees } from "../../containers/Page/Employee/employee";
import { Pairs } from "../../containers/Page/Pairs/pairs";
import { Jobs } from "../../containers/Page/Jobs/jobs";
import { JobApplications } from "../../containers/Page/Jobs/jobApplications";
import { LimitManagement } from "../../containers/Page/LimitManagement/limitManagement";
import KYC from "../../containers/Page/KYC/kyc";
// import Fees from "../../containers/Page/Fees/feesWithdrawal";
import News from "../../containers/Page/News/news";
import AccountClass from "../../containers/Page/AccountClass/accountClass";
import { EmailTemplates } from "../../containers/Page/EmailTemplates/emailTemplates";
import { NewsSources } from "../../containers/Page/NewsSource/newsSources";
import WithdrawRequest from "../../containers/Page/WithdrawRequest/withdrawRequest";
import { Icon, Switch, Button, Tooltip, Divider } from "antd";
import moment from "moment";
import { JobCategory } from "../../containers/Page/Jobs/jobsCategory";
import ProfileWhitelist from "../../containers/Page/profileWhitelist";
import Whitelist from "../../containers/Page/Employee/employeeWhitelist";
import TwoFactorRequests from "../../containers/Page/TwoFactorRequest/TwoFactorRequests";
import Tier from "../../containers/Page/Tiers/tiers";
import PendingRequests from "../../containers/Page/Tiers/pendingTierRequests";
import NetworkFee from "../../containers/Page/NetworkFee/networkFee";
import { networkFeesFormula } from "../../containers/Page/NetworkFee/networkFeesFormula";
import offers from "../../containers/Page/Offers/offers";
import { DeletedUsers } from "../../containers/Page/Users/deletedUsers";
import { isAllowed } from "../../helpers/accessControl";
import referrals from "../../containers/Page/Referral/referrals";
import { S3BucketImageURL } from "../../helpers/globals";
import { SmsTemplates } from "../../containers/Page/SmsTemplates/smsTemplates";

const viewActiveUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state
) => {
  ActiveUsers.view(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state
  );
};

const viewInActiveUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state
) => {
  InActiveUsers.view(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state
  );
};

const editActiveUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => {
  ActiveUsers.editUser(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state,
    no_of_referrals,
    created_at,
    deleted_at
  );
};

const editInactiveUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => {
  InActiveUsers.editUser(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state,
    no_of_referrals,
    created_at,
    deleted_at
  );
};

const deleteActiveUser = (value) => {
  ActiveUsers.deleteUser(value);
};

const viewUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state
) => {
  InActiveUsers.view(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state
  );
};

const editUser = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => {
  InActiveUsers.editUser(
    value,
    profile_pic,
    first_name,
    last_name,
    email,
    city_town,
    street_address,
    street_address_2,
    phone_number,
    country,
    dob,
    is_active,
    kyc,
    date_format,
    account_tier,
    account_class,
    state,
    no_of_referrals,
    created_at,
    deleted_at
  );
};

const deleteUser = (value) => {
  InActiveUsers.deleteUser(value);
};

const viewCoin = (
  value,
  coin_name,
  coin_code,
  min_limit,
  max_limit,
  wallet_address,
  created_at,
  is_active,
  isERC,
  coin_icon,
  warm_wallet_address,
  hot_send_wallet_address,
  hot_receive_wallet_address,
  custody_wallet_address
) => {
  Assets.view(
    value,
    coin_name,
    coin_code,
    min_limit,
    max_limit,
    wallet_address,
    created_at,
    is_active,
    isERC,
    coin_icon,
    warm_wallet_address,
    hot_send_wallet_address,
    hot_receive_wallet_address,
    custody_wallet_address
  );
};

const editCoin = (
  value,
  coin_name,
  coin_code,
  min_limit,
  max_limit,
  wallet_address,
  created_at,
  is_active,
  isERC,
  coin_icon
) => {
  Assets.edit(
    value,
    coin_name,
    coin_code,
    min_limit,
    max_limit,
    wallet_address,
    created_at,
    is_active,
    isERC,
    coin_icon
  );
};

const coinstatus = (
  value,
  coin_name,
  coin_code,
  min_limit,
  max_limit,
  wallet_address,
  created_at,
  is_active,
  isERC,
  coin_icon
) => {
  Assets.changeStatus(
    value,
    coin_name,
    coin_code,
    min_limit,
    max_limit,
    wallet_address,
    created_at,
    is_active,
    isERC,
    coin_icon
  );
};

const deleteCoin = (value) => {
  Assets.deleteCoin(value);
};

const assetWallet = (value, coin_name, coin_code) => {
  Assets.assetWallet(value, coin_name, coin_code);
};

const countryStatus = (value, name, legality, color, stateCount, is_active) => {
  Countries.countryStatus(value, name, legality, color, stateCount, is_active);
};

const editCountry = (value, name, legality, color, is_active) => {
  Countries.editCountry(value, name, legality, color, is_active);
};

const editState = (value, name, legality, color, is_active) => {
  StateList.editState(value, name, legality, color, is_active);
};

const stateStatus = (value, name, legality, color, is_active) => {
  StateList.stateStatus(value, name, legality, color, is_active);
};

const showStates = (value) => {
  Countries.showStates(value);
};

const deleteRole = (value) => {
  Roles.deleteRole(value);
};
const openAccessGrant = (value) => {
  Roles.openAccessGrant(value);
};

const editRole = (
  value,
  name,
  users,
  assets,
  countries,
  roles,
  employee,
  pairs,
  transaction_history,
  trade_history,
  withdraw_requests,
  jobs,
  kyc,
  fees,
  panic_button,
  news,
  is_referral,
  add_user,
  is_active
) => {
  Roles.editRole(
    value,
    name,
    users,
    assets,
    countries,
    roles,
    employee,
    pairs,
    transaction_history,
    trade_history,
    withdraw_requests,
    jobs,
    kyc,
    fees,
    panic_button,
    news,
    is_referral,
    add_user,
    is_active
  );
};

const roleStatus = (
  value,
  name,
  users,
  assets,
  countries,
  roles,
  employee,
  pairs,
  transaction_history,
  trade_history,
  withdraw_requests,
  jobs,
  kyc,
  fees,
  panic_button,
  news,
  is_referral,
  add_user,
  is_active
) => {
  Roles.roleStatus(
    value,
    name,
    users,
    assets,
    countries,
    roles,
    employee,
    pairs,
    transaction_history,
    trade_history,
    withdraw_requests,
    jobs,
    kyc,
    fees,
    panic_button,
    news,
    is_referral,
    add_user,
    is_active
  );
};

const employeeStatus = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  address,
  role,
  role_id,
  is_active
) => {
  Employees.employeeStatus(
    value,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    role_id,
    is_active
  );
};

const editEmployee = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  address,
  role,
  role_id,
  is_active
) => {
  Employees.editEmployee(
    value,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    role_id,
    is_active
  );
};

const deleteEmployee = (value) => {
  Employees.deleteEmployee(value);
};

const pairStatus = (
  value,
  name,
  price_precision,
  quantity_precision,
  order_maximum,
  created_at,
  is_active
) => {
  Pairs.pairStatus(
    value,
    name,
    price_precision,
    quantity_precision,
    order_maximum,
    created_at,
    is_active
  );
};

const editPair = (value, name, maker_fee, taker_fee, created_at, is_active) => {
  Pairs.editPair(value, name, maker_fee, taker_fee, created_at, is_active);
};

const editLimit = (
  value,
  daily_withdraw_crypto,
  daily_withdraw_fiat,
  min_withdrawl_crypto,
  min_withdrawl_fiat
) => {
  LimitManagement.editLimit(
    value,
    daily_withdraw_crypto,
    daily_withdraw_fiat,
    min_withdrawl_crypto,
    min_withdrawl_fiat
  );
};

const editJob = (
  value,
  position,
  location,
  short_desc,
  job_desc,
  category_id,
  is_active,
  category
) => {
  Jobs.editJob(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  );
};

const viewJob = (
  value,
  position,
  location,
  short_desc,
  job_desc,
  category_id,
  is_active,
  category
) => {
  Jobs.viewJob(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  );
};

const deleteJob = (value) => {
  Jobs.deleteJob(value);
};

const jobStatus = (
  value,
  position,
  location,
  short_desc,
  job_desc,
  category_id,
  is_active,
  category
) => {
  Jobs.jobStatus(
    value,
    position,
    location,
    short_desc,
    job_desc,
    category_id,
    is_active,
    category
  );
};

const showApplicants = (value) => {
  Jobs.showApplicants(value);
};

const viewJobApplication = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  created_at,
  resume,
  cover_letter,
  linkedin_profile,
  website_url
) => {
  JobApplications.viewJobApplication(
    value,
    first_name,
    last_name,
    email,
    phone_number,
    created_at,
    resume,
    cover_letter,
    linkedin_profile,
    website_url
  );
};

const viewKYC = (
  value,
  mtid,
  first_name,
  last_name,
  email,
  direct_response,
  kycDoc_details,
  webhook_response,
  address,
  country,
  city,
  zip,
  dob,
  id_type,
  created_at
) => {
  KYC.viewKYC(
    value,
    mtid,
    first_name,
    last_name,
    email,
    direct_response,
    kycDoc_details,
    webhook_response,
    address,
    country,
    city,
    zip,
    dob,
    id_type,
    created_at
  );
};

const newsStatus = (
  value,
  cover_image,
  title,
  link,
  posted_at,
  description,
  is_active,
  owner
) => {
  News.newsStatus(
    value,
    cover_image,
    title,
    link,
    posted_at,
    description,
    is_active,
    owner
  );
};

const editAccountClass = (value, class_name) => {
  AccountClass.editAccountClass(value, class_name);
};

const deleteAccountClass = (value, class_name) => {
  AccountClass.deleteAccountClass(value, class_name);
};

const editTemplate = (value, name, content, note) => {
  EmailTemplates.editTemplate(value, name, content, note);
};
const editSmsTemplate = (value, name, content, note) => {
  SmsTemplates.editSmsTemplate(value, name, content, note);
};
const viewTemplate = (value, name, content, note) => {
  EmailTemplates.viewTemplate(value, name, content, note);
};
const viewSmsTemplate = (value, name, content, note) => {
  SmsTemplates.viewSmsTemplate(value, name, content, note);
};

const newsSourceStatus = (value, source_name, slug, is_active) => {
  NewsSources.newsSourceStatus(value, source_name, slug, is_active);
};

const approveWithdrawReq = (
  value,
  email,
  source_address,
  destination_address,
  amount,
  transaction_type,
  is_approve,
  user_id,
  coin_id,
  is_executed,
  created_at,
  network_fee,
  faldax_fee,
  reason,
  actual_amount
) => {
  WithdrawRequest.approveWithdrawReq(
    value,
    email,
    source_address,
    destination_address,
    amount,
    transaction_type,
    is_approve,
    user_id,
    coin_id,
    is_executed,
    created_at,
    network_fee,
    faldax_fee,
    reason,
    actual_amount
  );
};

const declineWithdrawReq = (
  value,
  email,
  source_address,
  destination_address,
  amount,
  transaction_type,
  is_approve,
  user_id,
  coin_id,
  is_executed,
  created_at
) => {
  WithdrawRequest.declineWithdrawReq(
    value,
    email,
    source_address,
    destination_address,
    amount,
    transaction_type,
    is_approve,
    user_id,
    coin_id,
    is_executed,
    created_at
  );
};

const jobCategoryStatus = (value, category, is_active) => {
  JobCategory.jobCategoryStatus(value, category, is_active);
};

const updateCategory = (value, category, is_active) => {
  JobCategory.updateCategory(value, category, is_active);
};

const deleteProfileWhitelistIP = (value) => {
  ProfileWhitelist.deleteProfileWhitelistIP(value);
};

const deleteWhitelistIP = (value) => {
  Whitelist.deleteWhitelistIP(value);
};

const approve2FA = (
  value,
  full_name,
  uploaded_file,
  status,
  reason,
  created_at
) => {
  TwoFactorRequests.approve2FA(
    value,
    full_name,
    uploaded_file,
    status,
    reason,
    created_at
  );
};

const reject2FA = (
  value,
  full_name,
  email,
  uploaded_file,
  status,
  reason,
  created_at
) => {
  TwoFactorRequests.reject2FA(
    value,
    full_name,
    email,
    uploaded_file,
    status,
    reason,
    created_at
  );
};

const viewRequest = (
  value,
  full_name,
  email,
  uploaded_file,
  status,
  reason,
  created_at
) => {
  TwoFactorRequests.viewRequest(
    value,
    full_name,
    email,
    uploaded_file,
    status,
    reason,
    created_at
  );
};

const editTier = (value) => {
  Tier.editTier(value);
};

const viewPendingReq = (
  value,
  first_name,
  last_name,
  tier_step,
  is_approved,
  user_id
) => {
  PendingRequests.viewPendingReq(
    value,
    first_name,
    last_name,
    tier_step,
    is_approved,
    user_id
  );
};

const approvePendingReq = (
  value,
  first_name,
  last_name,
  tier_step,
  is_approved,
  request_id
) => {
  PendingRequests.approvePendingReq(
    value,
    first_name,
    last_name,
    tier_step,
    is_approved,
    request_id
  );
};

const getTierDoc = (tier, type) => {
  if (tier == 2 || tier == "2") {
    if (type == "1") {
      return <span>Valid ID</span>;
    } else if (type == "2") {
      return <span>Proof of Residence</span>;
    } else if (type == "3") {
      return <span>Equivalent Govt. Issued ID Number</span>;
    } else if (type == "4") {
      return <span>Two Factor Authentication</span>;
    }
  } else if (tier == 3 || tier == "3") {
    if (type == "1") {
      return <span>IDCP</span>;
    } else if (type == "2") {
      return <span>Proof of Assets Form</span>;
    }
  } else {
    if (type == "1") {
      return <span>AML Questionnaire</span>;
    } else if (type == "2") {
      return <span>Comfort Letter</span>;
    } else if (type == "3") return <span>Board Resolution</span>;
    else if (type == "4") return <span>2 Months Bank Satements</span>;
    else if (type == "5") return <span>Corporate Filing Information</span>;
    else if (type == "6") return <span>Beneficial Ownership Form</span>;
    else if (type == "7") return <span>Articles of Incorporation</span>;
    else if (type == "8") return <span>bylaws</span>;
    else if (type == "9") return <span>Ownership and Control Structure</span>;
    else if (type == "10")
      return (
        <span>
          Directors and Officers List & Personal Info Equivalent to Tier 3
          Requirements
        </span>
      );
    else if (type == "11") return <span>Proof of Active Business Address</span>;
    else if (type == "12") return <span>Document Availability Policy</span>;
    else if (type == "13") return <span>Cookies Policy</span>;
    else if (type == "14") return <span>Privacy Policy</span>;
    else if (type == "15") return <span>AML Policy</span>;
    else if (type == "16") return <span>Terms of Service</span>;
  }
};

const ConvertSatoshiToAssetCell = (coin, balance, precision = false) => {
  coin = coin.toLowerCase();
  let amount = 0;
  balance = parseFloat(balance);
  if (!parseFloat(balance)) {
    return <span>0</span>;
  }
  if (precision) {
    return <span>{parseFloat(balance / precision).toFixed(8)}</span>;
  }
  switch (coin) {
    case "btc":
      amount = balance / 1e8;
      break;
    case "tbtc":
      amount = balance / 1e8;
      break;
    case "eth":
      amount = balance / 1e18;
      break;
    case "teth":
      amount = balance / 1e18;
      break;
    case "ltc":
      amount = balance / 1e8;
      break;
    case "tltc":
      amount = balance / 1e8;
      break;
    case "xrp":
      amount = balance / 1e6;
      break;
    case "txrp":
      amount = balance / 1e6;
      break;
    case "susu":
      amount = balance;
      break;
    case "usdt":
      amount = balance / 1e18;
      break;
    default:
      amount = balance;
  }
  return (
    <span>
      {coin == "eth" || coin == "teth"
        ? parseFloat(amount).toFixed(8)
        : parseFloat(amount).toFixed(8)}
    </span>
  );
};

const TransactionIdHashCell = (coin_id, transaction_id, isERC20 = false) => {
  let url = "";
  if (!transaction_id) {
    return <span>-</span>;
  }
  if (isERC20) {
    return transaction_id ? (
      <a target="_blank" href={"https://etherscan.io/tx/" + transaction_id}>
        {transaction_id}
      </a>
    ) : (
        <span></span>
      );
  }
  switch (coin_id.toLowerCase()) {
    // Fot Test Net
    case "tbtc":
      url = "https://blockstream.info/testnet/tx/" + transaction_id;
      break;
    case "txrp":
      url = "https://test.bithomp.com/explorer/" + transaction_id;
      break;
    case "tltc":
      url = "https://blockexplorer.one/litecoin/testnet/tx/" + transaction_id;
      break;
    case "tbch":
      url = "https://explorer.bitcoin.com/tbch/tx/" + transaction_id;
      break;
    case "teth":
      url = "https://kovan.etherscan.io/tx/" + transaction_id;
      break;

    // For Main Net
    case "btc":
      url = "https://blockchair.com/bitcoin/transaction/" + transaction_id;
      break;
    case "xrp":
      url = "https://blockchair.com/ripple/transaction/" + transaction_id;
      break;
    case "ltc":
      url = "https://blockchair.com/litecoin/transaction/" + transaction_id;
      break;
    case "eth":
      url = "https://blockchair.com/ethereum/transaction/" + transaction_id;
      break;
    case "bch":
      url = "https://blockchair.com/bitcoin-cash/transaction/" + transaction_id;
      break;
    case "susu":
      url = "https://explore.susukino.com/tx/" + transaction_id;
      break;
    default:
      url = "";
  }
  return url ? (
    <a target="_blank" href={url}>
      {transaction_id}
    </a>
  ) : (
      <span></span>
    );
};
const DateCell = (data) => (
  <p>
    {data
      ? moment.utc(data).local().format("DD MMM, YYYY HH:mm")
        ? moment.utc(data).local().format("DD MMM, YYYY HH:mm")
        : ""
      : ""}
  </p>
);
const HistoryDateCell = (data) => (
  <p>
    {data
      ? moment.utc(data).local().format("DD MMM YYYY LTS")
        ? moment.utc(data).local().format("DD MMM YYYY LTS")
        : ""
      : ""}
  </p>
);

const OfferDateCell = (data) => (
  <p>
    {data ? (
      moment.utc(data).local().format("DD MMM YYYY") ? (
        <span>
          {" "}
          <Icon type="calendar" />{" "}
          {moment.utc(data).local().format("DD MMM YYYY")}
        </span>
      ) : (
          "-"
        )
    ) : (
        "--"
      )}
  </p>
);

const UserDateCell = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at
) => (
    <p>
      {no_of_referrals && no_of_referrals > 0
        ? moment.utc(created_at).local().format("DD MMM, YYYY HH:mm")
          ? moment.utc(created_at).local().format("DD MMM, YYYY HH:mm")
          : ""
        : ""}
    </p>
  );
const ReferralDateCell = (
  value,
  full_name,
  email,
  created_at,
  referral_by_email,
  referred_id,
  refered_by,
  no_of_referral
) => (
    <p>
      {created_at
        ? moment.utc(created_at).local().format("DD MMM, YYYY HH:mm")
          ? moment.utc(created_at).local().format("DD MMM, YYYY HH:mm")
          : ""
        : ""}
    </p>
  );
const TransactionTypeCell = (data) => (
  <p style={{ color: data == "send" ? "red" : "green" }}>
    {data == "send" ? "Send" : "Receive"}
  </p>
);
const VolumeCell = (
  value,
  currency,
  settle_currency,
  reqested_user_email,
  email,
  side,
  quantity,
  price,
  fill_price,
  maker_fee,
  taker_fee,
  volume,
  created_at
) => <p>{quantity * fill_price}</p>;
const ObjectCell = (value, execution_report) => (
  <span style={{ display: "flex", minWidth: "250px", flexWrap: "wrap" }}>
    {/* {Object.keys(execution_report).length && (
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "350px",
          overflowY: "auto"
        }}
      >
        <li>{execution_report}</li>
        {Object.keys(execution_report).map((element, index) => {
          return (
            <li style={{ display: "flex", width: "100%" }}>
              <span>{element} :</span>
              <span style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                {execution_report[element]}
              </span>
            </li>
          );
        })}
      </ul>
    )} */}
    {/* {JSON.stringify(execution_report)} */}
    {Object.keys(execution_report[0]).length > 0 ? (
      <ul style={{ height: "350px", overflow: "auto" }}>
        {Object.keys(execution_report[0]).map((element, index) => {
          return (
            <li style={{ display: "flex", width: "100%" }}>
              <span>
                <b>{element} : </b>
              </span>{" "}
              <span style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}>
                {execution_report[0][element]}
              </span>
            </li>
          );
        })}
      </ul>
    ) : (
        <ul>
          <li style={{ display: "flex", width: "100%" }}>-</li>
        </ul>
      )}
  </span>
);
const DateTimeCell = (data, type) => {
  if (type == "string") {
    return data
      ? moment.utc(data).local().format("DD MMM YYYY HH:mm:ss")
        ? moment.utc(data).local().format("DD MMM, YYYY HH:mm:ss")
        : ""
      : "";
  } else {
    return (
      <p>
        {data
          ? moment.utc(data).local().format("DD MMM YYYY HH:mm:ss")
            ? moment.utc(data).local().format("DD MMM, YYYY HH:mm:ss")
            : ""
          : ""}
      </p>
    );
  }
};

const DateTimeSecCell = (data) => (
  <p>
    {data
      ? moment.utc(data).local().format("DD MMM YYYY HH:mm:ss")
        ? moment.utc(data).local().format("DD MMM, YYYY HH:mm:ss")
        : ""
      : ""}
  </p>
);

const VolumeOrderSell = (quantity, fill_price) => <p>{quantity * fill_price}</p>;

const ImageCell = (src) => (
  <img style={{ width: "40px", height: "40px" }} src={S3BucketImageURL + src} />
);
const UserImageCell = (src) => (
  <img
    style={{ width: "40px", height: "40px" }}
    src={
      !src || src == null
        ? S3BucketImageURL + "profile/def_profile.jpg"
        : S3BucketImageURL + src
    }
  />
);
const StaticImageCell = (src) => (
  <img style={{ width: "40px", height: "40px" }} src={src} />
);
const LinkCell = (link, href) => <a href={href ? href : "#"}>{link}</a>;
const NewsLinkCell = (link, href) => (
  <a href={link ? link : "#"} target="_blank">
    {link.slice(0, 35) + (link.length > 35 ? "..." : "")}
  </a>
);
const ColorCell = (color) => <div style={{ background: color }}>{color}</div>;
const ContentCell = (text) => (
  <p
    style={{ display: "block", width: "290px", overflow: "hidden" }}
    dangerouslySetInnerHTML={{ __html: text }}
  ></p>
);
const TextCell = (text) => <p dangerouslySetInnerHTML={{ __html: text }}></p>;
const FullNameTextCell = (value, fname, lname) => (
  <p>
    {fname} {lname}
  </p>
);
const DaysCell = (text) => <p>{text == 0 ? "Permanent" : text + " Days"}</p>;
const TicketSubjectCell = (text) => (
  <p className="link-text" dangerouslySetInnerHTML={{ __html: text }}></p>
);
const LocationCell = (text) => (
  <Tooltip title={text}>
    <p
      style={{ display: "block", width: "100px", overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: text }}
    ></p>
  </Tooltip>
);
const TierCell = (text) => <p>Tier {text}</p>;
const referralActionCell = (value, first_name, last_name, mail) => (
  <>
    {isAllowed("get_referred_id_data") && (
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() => referrals.edit(value, first_name, last_name, mail)}
          disabled
        />
      </Tooltip>
    )}
  </>
);
const FeesCell = (text) => (
  <p dangerouslySetInnerHTML={{ __html: text.toPrecision(2) + "%" }}></p>
);
const ApproveCell = (text) => (
  <p>{text == true ? "Approved" : "Dis-Approved"}</p>
);
const IPCell = (text) => (
  <p>{text.split(":").length > 1 ? text.split(":")[3] : text}</p>
);
const LegalityCell = (text, name) => (
  <p>
    {
      // text == 1 && name == "United States"
      //   ? "Partial Services Available"
      text == 1
        ? "Legal"
        : text == 2
          ? "Illegal"
          : text == 3
            ? "Neutral"
            : "Partial Services Available"
    }
  </p>
);
const SwitchCell = (
  value,
  coin_name,
  coin_code,
  min_limit,
  max_limit,
  wallet_address,
  created_at,
  is_active,
  isERC,
  coin_icon,
  disabled = false
) => (
    <Switch
      disabled={disabled}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        coinstatus(
          value,
          coin_name,
          coin_code,
          min_limit,
          max_limit,
          wallet_address,
          created_at,
          is_active,
          isERC,
          coin_icon
        );
      }}
    />
  );
const StaticSwitchCell = (
  value,
  coin_name,
  coin_code,
  limit,
  wallet_address,
  created_at,
  is_active
) => (
    <Switch
      checked={is_active}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      onChange={() => {
        coinstatus(
          value,
          coin_name,
          coin_code,
          limit,
          wallet_address,
          created_at,
          is_active
        );
      }}
    />
  );
const CountrySwitchCell = (
  value,
  name,
  legality,
  color,
  is_active,
  disabled = false
) => (
    <Switch
      disabled={disabled}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        countryStatus(value, name, legality, color, is_active);
      }}
    />
  );
const StateSwitchCell = (
  value,
  name,
  legality,
  color,
  is_active,
  disabled = false
) => (
    <Switch
      className="switch-cell"
      checkedChildren="Active"
      disabled={disabled}
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        stateStatus(value, name, legality, color, is_active);
      }}
    />
  );
const NewsSwitchCell = (
  value,
  cover_image,
  title,
  link,
  posted_at,
  description,
  is_active,
  owner,
  disabled = false
) => (
    <Switch
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      disabled={disabled}
      checked={is_active}
      onChange={() => {
        newsStatus(
          value,
          cover_image,
          title,
          link,
          posted_at,
          description,
          is_active,
          owner
        );
      }}
    />
  );
const NewsDescCell = (value) => (
  <Tooltip title={value}>
    <p>{value.slice(0, 35) + (value.length > 35 ? "..." : "")}</p>
  </Tooltip>
);
//const NewsActionsCell = (value, cover_image, title, link, posted_at, description, is_active, owner) => <div><Tooltip title="View"><Icon type="info-circle" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => viewNews(value, cover_image, title, link, posted_at, description, is_active, owner)} /></Tooltip></div>;
const ActionCell = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => (
    <div>
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() =>
            viewUser(
              value,
              profile_pic,
              first_name,
              last_name,
              email,
              city_town,
              street_address,
              street_address_2,
              phone_number,
              country,
              dob,
              is_active,
              kyc,
              date_format,
              account_tier,
              account_class,
              state,
              no_of_referrals,
              created_at
            )
          }
        />
      </Tooltip>
      {!deleted_at ? (
        <React.Fragment>
          <Tooltip title="View">
            <Icon
              type="delete"
              className="btn-icon"
              onClick={() => deleteUser(value)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Icon
              type="edit"
              className="btn-icon"
              onClick={() =>
                editUser(
                  value,
                  profile_pic,
                  first_name,
                  last_name,
                  email,
                  city_town,
                  street_address,
                  street_address_2,
                  phone_number,
                  country,
                  dob,
                  is_active,
                  kyc,
                  date_format,
                  account_tier,
                  account_class,
                  state,
                  no_of_referrals,
                  created_at,
                  deleted_at
                )
              }
            />
          </Tooltip>
        </React.Fragment>
      ) : (
          ""
        )}
    </div>
  );
const DeletedUserActionCell = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => (
    <div>
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() =>
            DeletedUsers.view(
              value,
              profile_pic,
              first_name,
              last_name,
              email,
              city_town,
              street_address,
              street_address_2,
              phone_number,
              country,
              dob,
              is_active,
              kyc,
              date_format,
              account_tier,
              account_class,
              state,
              no_of_referrals,
              created_at
            )
          }
        />
      </Tooltip>
      {!deleted_at ? (
        <React.Fragment>
          <Tooltip title="View">
            <Icon
              type="delete"
              className="btn-icon"
              onClick={() => deleteActiveUser(value)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Icon
              type="edit"
              className="btn-icon"
              onClick={() =>
                editActiveUser(
                  value,
                  profile_pic,
                  first_name,
                  last_name,
                  email,
                  city_town,
                  street_address,
                  street_address_2,
                  phone_number,
                  country,
                  dob,
                  is_active,
                  kyc,
                  date_format,
                  account_tier,
                  account_class,
                  state,
                  no_of_referrals,
                  created_at,
                  deleted_at
                )
              }
            />
          </Tooltip>
        </React.Fragment>
      ) : (
          ""
        )}
    </div>
  );
const ActiveUserActionCell = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => (
    <div>
      {(isAllowed("get_users") ||
        isAllowed("get_inactive_users") ||
        isAllowed("get_deleted_users")) && (
          <Tooltip title="View">
            <Icon
              type="info-circle"
              className="btn-icon"
              onClick={() =>
                viewActiveUser(
                  value,
                  profile_pic,
                  first_name,
                  last_name,
                  email,
                  city_town,
                  street_address,
                  street_address_2,
                  phone_number,
                  country,
                  dob,
                  is_active,
                  kyc,
                  date_format,
                  account_tier,
                  account_class,
                  state,
                  no_of_referrals,
                  created_at
                )
              }
            />
          </Tooltip>
        )}
      {!deleted_at ? (
        <React.Fragment>
          {isAllowed("delete_user") && (
            <Tooltip title="Deactivate user">
              <Icon
                type="delete"
                className="btn-icon"
                onClick={() => deleteActiveUser(value)}
              />
            </Tooltip>
          )}
          {isAllowed("update_user") && (
            <Tooltip title="Edit">
              <Icon
                type="edit"
                className="btn-icon"
                onClick={() =>
                  editActiveUser(
                    value,
                    profile_pic,
                    first_name,
                    last_name,
                    email,
                    city_town,
                    street_address,
                    street_address_2,
                    phone_number,
                    country,
                    dob,
                    is_active,
                    kyc,
                    date_format,
                    account_tier,
                    account_class,
                    state,
                    no_of_referrals,
                    created_at,
                    deleted_at
                  )
                }
              />
            </Tooltip>
          )}
        </React.Fragment>
      ) : (
          ""
        )}
    </div>
  );
const InActiveUserActionCell = (
  value,
  profile_pic,
  first_name,
  last_name,
  email,
  city_town,
  street_address,
  street_address_2,
  phone_number,
  country,
  dob,
  is_active,
  kyc,
  date_format,
  account_tier,
  account_class,
  state,
  no_of_referrals,
  created_at,
  deleted_at
) => (
    <div>
      {(isAllowed("get_users") ||
        isAllowed("get_inactive_users") ||
        isAllowed("get_deleted_users")) && (
          <Tooltip title="View">
            <Icon
              type="info-circle"
              className="btn-icon"
              onClick={() =>
                viewInActiveUser(
                  value,
                  profile_pic,
                  first_name,
                  last_name,
                  email,
                  city_town,
                  street_address,
                  street_address_2,
                  phone_number,
                  country,
                  dob,
                  is_active,
                  kyc,
                  date_format,
                  account_tier,
                  account_class,
                  state,
                  no_of_referrals,
                  created_at
                )
              }
            />
          </Tooltip>
        )}
      {!deleted_at ? (
        <React.Fragment>
          {isAllowed("delete_user") && (
            <Tooltip title="Deactivate user">
              <Icon
                type="delete"
                className="btn-icon"
                onClick={() => deleteActiveUser(value)}
              />
            </Tooltip>
          )}
          {isAllowed("update_user") && (
            <Tooltip title="Edit">
              <Icon
                type="edit"
                className="btn-icon"
                onClick={() =>
                  editInactiveUser(
                    value,
                    profile_pic,
                    first_name,
                    last_name,
                    email,
                    city_town,
                    street_address,
                    street_address_2,
                    phone_number,
                    country,
                    dob,
                    is_active,
                    kyc,
                    date_format,
                    account_tier,
                    account_class,
                    state,
                    no_of_referrals,
                    created_at,
                    deleted_at
                  )
                }
              />
            </Tooltip>
          )}
        </React.Fragment>
      ) : (
          ""
        )}
    </div>
  );
const CoinActionCell = (
  value,
  coin_name,
  coin_code,
  min_limit,
  max_limit,
  wallet_address,
  created_at,
  is_active,
  isERC,
  coin_icon,
  warm_wallet_address,
  hot_send_wallet_address,
  hot_receive_wallet_address,
  custody_wallet_address
) => (
    <div>
      {isAllowed("delete_coins") && (
        <Tooltip title="Delete">
          <Icon
            type="delete"
            onClick={() => deleteCoin(value)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
      {((isAllowed("update_coins") && isAllowed("get_coin_details")) ||
        isAllowed("get_all_limits")) && (
          <Tooltip title="Edit">
            <Icon
              type="edit"
              className="btn-icon"
              onClick={() =>
                editCoin(
                  value,
                  coin_name,
                  coin_code,
                  min_limit,
                  max_limit,
                  wallet_address,
                  created_at,
                  is_active,
                  isERC,
                  coin_icon,
                  warm_wallet_address,
                  hot_send_wallet_address,
                  hot_receive_wallet_address,
                  custody_wallet_address
                )
              }
            />
          </Tooltip>
        )}
      {isAllowed("get_coin_details") && (
        <Tooltip title="View">
          <Icon
            type="info-circle"
            className="btn-icon"
            onClick={() =>
              viewCoin(
                value,
                coin_name,
                coin_code,
                min_limit,
                max_limit,
                wallet_address,
                created_at,
                is_active,
                isERC,
                coin_icon,
                warm_wallet_address,
                hot_send_wallet_address,
                hot_receive_wallet_address,
                custody_wallet_address
              )
            }
          />
        </Tooltip>
      )}
      {/* {isAllowed("wallet_details") && (
        <Tooltip title="Wallet">
          <Icon
            type="wallet"
            className="btn-icon"
            onClick={() => assetWallet(value, coin_name, coin_code)}
          />
        </Tooltip>
      )} */}
    </div>
  );

const RolesActionCell = (
  value,
  name,
  users,
  assets,
  countries,
  roles,
  employee,
  pairs,
  transaction_history,
  trade_history,
  withdraw_requests,
  jobs,
  kyc,
  fees,
  panic_button,
  news,
  is_referral,
  add_user,
  is_active
) => (
    <div>
      {isAllowed("delete_role") && (
        <Tooltip title="Delete" key="delete_tooltips">
          <Icon
            type="delete"
            onClick={() =>
              deleteRole(
                value,
                name,
                users,
                assets,
                countries,
                roles,
                employee,
                pairs,
                transaction_history,
                trade_history,
                withdraw_requests,
                jobs,
                kyc,
                fees,
                panic_button,
                news,
                is_referral,
                add_user,
                is_active
              )
            }
          />
        </Tooltip>
      )}
      {isAllowed("get_role_value") && (
        <Tooltip title="Permissions" key="permission_key">
          <Icon
            type="sliders"
            className="btn-icon"
            onClick={() => {
              openAccessGrant(value);
            }}
          />
        </Tooltip>
      )}
      {isAllowed("update_role") && (
        <Tooltip title="Edit" key="update-tooltips">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() => {
              editRole(
                value,
                name,
                users,
                assets,
                countries,
                roles,
                employee,
                pairs,
                transaction_history,
                trade_history,
                withdraw_requests,
                jobs,
                kyc,
                fees,
                panic_button,
                news,
                is_referral,
                add_user,
                is_active
              );
            }}
          />
        </Tooltip>
      )}
    </div>
  );
const CountryActionCell = (
  value,
  name,
  legality,
  color,
  stateCount,
  is_active
) => (
    <div>
      {isAllowed("update_country") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() => editCountry(value, name, legality, color, is_active)}
          />
        </Tooltip>
      )}
    </div>
  );
const StateActionCell = (value, name, legality, color, is_active) => (
  <div>
    {isAllowed("update_state") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => editState(value, name, legality, color, is_active)}
        />
      </Tooltip>
    )}
  </div>
);
const CountryButtonCell = (value, stateCount) => (
  <Button
    type="primary"
    onClick={() => showStates(value)}
    disabled={!(stateCount > 0 && isAllowed("get_state_data"))}
  >
    Show States
  </Button>
);
const RoleSwitchCell = (
  value,
  name,
  users,
  assets,
  countries,
  roles,
  employee,
  pairs,
  transaction_history,
  trade_history,
  withdraw_requests,
  jobs,
  kyc,
  fees,
  panic_button,
  news,
  is_referral,
  add_user,
  is_active,
  disabled = false
) => (
    <Switch
      disabled={disabled}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      key="role_switch"
      onChange={() => {
        roleStatus(
          value,
          name,
          users,
          assets,
          countries,
          roles,
          employee,
          pairs,
          transaction_history,
          trade_history,
          withdraw_requests,
          jobs,
          kyc,
          fees,
          panic_button,
          news,
          is_referral,
          add_user,
          is_active
        );
      }}
    />
  );
const EmployeeSwitchCell = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  address,
  role,
  role_id,
  is_active
) => (
    <Switch
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      disabled={!isAllowed("update_employee")}
      onChange={() => {
        employeeStatus(
          value,
          first_name,
          last_name,
          email,
          phone_number,
          address,
          role,
          role_id,
          is_active
        );
      }}
    />
  );
const EmployeeActionCell = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  address,
  role,
  role_id,
  is_active
) => (
    <div>
      {isAllowed("delete_employee") && (
        <Tooltip title="Delete">
          <Icon
            type="delete"
            onClick={() => deleteEmployee(value)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
      {isAllowed("get_employee_details") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() =>
              editEmployee(
                value,
                first_name,
                last_name,
                email,
                phone_number,
                address,
                role,
                role_id,
                is_active
              )
            }
          />
        </Tooltip>
      )}
    </div>
  );
const FeeSwitchCell = (
  value,
  name,
  price_precision,
  quantity_precision,
  order_maximum,
  created_at,
  is_active
) => (
    <Switch
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        pairStatus(
          value,
          name,
          price_precision,
          quantity_precision,
          order_maximum,
          created_at,
          is_active
        );
      }}
    />
  );
const FeeActionCell = (
  value,
  name,
  price_precision,
  quantity_precision,
  order_maximum,
  created_at,
  is_active
) => (
    <div>
      {isAllowed("admin_edit_pair") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() =>
              editPair(
                value,
                name,
                price_precision,
                quantity_precision,
                order_maximum,
                created_at,
                is_active
              )
            }
          />
        </Tooltip>
      )}
    </div>
  );
const LimitActionCell = (
  value,
  daily_withdraw_crypto,
  daily_withdraw_fiat,
  min_withdrawl_crypto,
  min_withdrawl_fiat
) => (
    <div>
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() =>
            editLimit(
              value,
              daily_withdraw_crypto,
              daily_withdraw_fiat,
              min_withdrawl_crypto,
              min_withdrawl_fiat
            )
          }
        />
      </Tooltip>
    </div>
  );
const TagsCell = (value) => (
  <Tooltip title={value}>
    <p>{value.slice(0, 10) + (value.length > 10 ? "..." : "")}</p>
  </Tooltip>
);
const JobActionCell = (
  value,
  position,
  location,
  short_desc,
  job_desc,
  category_id,
  is_active,
  category
) => (
    <div>
      {isAllowed("delete_job") && (
        <Tooltip title="Delete">
          <Icon
            type="delete"
            onClick={() => deleteJob(value)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
      {isAllowed("update_job") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() =>
              editJob(
                value,
                position,
                location,
                short_desc,
                job_desc,
                category_id,
                is_active,
                category
              )
            }
          />
        </Tooltip>
      )}
      {isAllowed("get_all_jobs") && (
        <Tooltip title="View">
          <Icon
            type="info-circle"
            className="btn-icon"
            onClick={() =>
              viewJob(
                value,
                position,
                location,
                short_desc,
                job_desc,
                category_id,
                is_active,
                category
              )
            }
          />
        </Tooltip>
      )}
    </div>
  );
const JobSwitchCell = (
  value,
  position,
  location,
  short_desc,
  job_desc,
  category_id,
  is_active,
  category,
  disabled = false
) => (
    <Switch
      disabled={disabled}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        jobStatus(
          value,
          position,
          location,
          short_desc,
          job_desc,
          category_id,
          is_active,
          category
        );
      }}
    />
  );
const JobButtonCell = (value) => (
  <div>
    <Button
      size={"small"}
      disabled={!isAllowed("get_job_applicants")}
      type="primary"
      onClick={() => showApplicants(value)}
    >
      Show Applications
    </Button>
  </div>
);
const JobAppActionCell = (
  value,
  first_name,
  last_name,
  email,
  phone_number,
  created_at,
  resume,
  cover_letter,
  linkedin_profile,
  website_url
) => (
    <div>
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() =>
            viewJobApplication(
              value,
              first_name,
              last_name,
              email,
              phone_number,
              created_at,
              resume,
              cover_letter,
              linkedin_profile,
              website_url
            )
          }
        />
      </Tooltip>
    </div>
  );
const KYCActionCell = (
  value,
  mtid,
  first_name,
  last_name,
  email,
  direct_response,
  kycDoc_details,
  webhook_response,
  address,
  country,
  city,
  zip,
  dob,
  id_type,
  created_at
) => (
    <div>
      {isAllowed("get_kyc_detail") && (
        <Tooltip title="View">
          <Icon
            type="info-circle"
            className="btn-icon"
            onClick={() =>
              viewKYC(
                value,
                mtid,
                first_name,
                last_name,
                email,
                direct_response,
                kycDoc_details,
                webhook_response,
                address,
                country,
                city,
                zip,
                dob,
                id_type,
                created_at
              )
            }
          />
        </Tooltip>
      )}
    </div>
  );
const LogoutDateCell = (value, is_logged_in, created_at, updated_at) => (
  <p>
    {" "}
    {is_logged_in == false
      ? updated_at
        ? moment.utc(updated_at).local().format("DD MMM, YYYY HH:mm")
        : ""
      : "-"}
  </p>
);
const FeesActionCell = (value, trade_volume, maker_fee, taker_fee) => (
  <div>
    <Tooltip title="Edit">
      <Icon type="edit" className="btn-icon" />
    </Tooltip>
  </div>
);
const ReferralCell = (value) => <p>{value !== null ? value : 0}</p>;
const PipelineCell = (text) => (
  <p>
    {text == 1
      ? "NEW"
      : text == 2
        ? "Waiting on Customer Feedback"
          ? text == 3
            ? "Waiting on FALDAX"
            : "AClosed"
          : "BClosed"
        : "CClosed"}
  </p>
);
const AccountClassActionCell = (value, class_name) => (
  <div>
    {isAllowed("delete_account_class") && (
      <Tooltip title="Delete">
        <Icon
          type="delete"
          onClick={() => deleteAccountClass(value)}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
    )}
    {isAllowed("update_account_class") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => editAccountClass(value, class_name)}
        />
      </Tooltip>
    )}
  </div>
);
const TemplateActionCell = (value, name, content, note) => (
  <div>
    {isAllowed("get_email_template_id") && (
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() => viewTemplate(value, name, content, note)}
        />
      </Tooltip>
    )}
    {isAllowed("get_email_template_id") && isAllowed("update_email_template") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => editTemplate(value, name, content, note)}
        />
      </Tooltip>
    )}
  </div>
);
const SMSTemplateActionCell = (value, name, content, note) => (
  <div>
    {isAllowed("get_sms_template_by_id") && (
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() => viewSmsTemplate(value, name, content, note)}
        />
      </Tooltip>
    )}
    {isAllowed("get_sms_template_by_id") && isAllowed("update_sms_template") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => editSmsTemplate(value, name, content, note)}
        />
      </Tooltip>
    )}
  </div>
);
const NewsSourceSwitchCell = (
  value,
  source_name,
  slug,
  is_active,
  disabled = false
) => (
    <Switch
      disabled={disabled}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      checked={is_active}
      onChange={() => {
        newsSourceStatus(value, source_name, slug, is_active);
      }}
    />
  );
const WithdrawActionCell = (
  value,
  email,
  source_address,
  destination_address,
  amount,
  transaction_type,
  is_approve,
  user_id,
  coin_id,
  is_executed,
  created_at,
  network_fee,
  faldax_fee,
  reason,
  actual_amount
) => (
    <div>
      {is_approve == null && isAllowed("approve_disapprove_withdraw_request") ? (
        <div>
          <Button
            shape="circle"
            icon="check"
            size="small"
            className="kyc-round-btn"
            type="primary"
            onClick={() =>
              approveWithdrawReq(
                value,
                email,
                source_address,
                destination_address,
                amount,
                transaction_type,
                is_approve,
                user_id,
                coin_id,
                is_executed,
                created_at,
                network_fee,
                faldax_fee,
                reason,
                actual_amount
              )
            }
          ></Button>
          <Button
            icon="close"
            size="small"
            className="kyc-round-btn"
            type="danger"
            onClick={() =>
              declineWithdrawReq(
                value,
                email,
                source_address,
                destination_address,
                amount,
                transaction_type,
                is_approve,
                user_id,
                coin_id,
                is_executed,
                created_at
              )
            }
          ></Button>
        </div>
      ) : (
          ""
        )}
    </div>
  );
const WithdrawStatusCell = (
  value,
  email,
  source_address,
  destination_address,
  amount,
  transaction_type,
  is_approve,
  user_id,
  coin_id,
  is_executed,
  created_at
) => (
    <p
      className={
        "withdrawal-status-" +
        (is_approve == null
          ? "pending"
          : is_approve == true
            ? "approved"
            : "declined")
      }
    >
      {is_approve == null
        ? "PENDING"
        : is_approve == true
          ? "APPROVED"
          : "REJECTED"}
    </p>
  );
const JobCatSwitchCell = (value, category, is_active, disabled = false) => (
  <Switch
    disabled={disabled}
    className="switch-cell"
    checkedChildren="Active"
    unCheckedChildren="Inactive"
    checked={is_active}
    onChange={() => {
      jobCategoryStatus(value, category, is_active);
    }}
  />
);
const JobCatActionCell = (value, category, is_active) => (
  <div>
    {isAllowed("update_job_category") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => updateCategory(value, category, is_active)}
        />
      </Tooltip>
    )}
  </div>
);
const WhiteListActionCell = (value, ip, time, is_permanent) => (
  <div>
    {!is_permanent && isAllowed("update_employee") ? (
      <Tooltip title="Delete">
        <Icon
          type="delete"
          onClick={() => deleteWhitelistIP(value)}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
    ) : (
        "-"
      )}
  </div>
);
const ProfileWhiteListActionCell = (value, ip, time, is_permanent) => (
  <div>
    {!is_permanent ? (
      <Tooltip title="Delete">
        <Icon
          type="delete"
          onClick={() => deleteProfileWhitelistIP(value)}
          style={{ cursor: "pointer" }}
        />
      </Tooltip>
    ) : (
        "-"
      )}
  </div>
);
const TwoFAActionCell = (
  value,
  full_name,
  email,
  uploaded_file,
  status,
  reason,
  created_at
) => (
    <div>
      <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon"
          onClick={() =>
            viewRequest(
              value,
              full_name,
              email,
              uploaded_file,
              status,
              reason,
              created_at
            )
          }
        />
      </Tooltip>
      {status.trim() !== "open" ? (
        ""
      ) : (
          <React.Fragment>
            {isAllowed("approve_twofactors_request_status") && (
              <Tooltip title="Approve">
                <Icon
                  theme="twoTone"
                  type="check-circle"
                  className="btn-icon"
                  onClick={() =>
                    approve2FA(
                      value,
                      full_name,
                      email,
                      uploaded_file,
                      status,
                      created_at
                    )
                  }
                />
              </Tooltip>
            )}
            {isAllowed("reject_twofactors_request_status") && (
              <Tooltip title="Reject">
                <Icon
                  theme="twoTone"
                  twoToneColor="#FF0000"
                  type="close-circle"
                  className="btn-icon"
                  onClick={() =>
                    reject2FA(
                      value,
                      full_name,
                      email,
                      uploaded_file,
                      status,
                      created_at
                    )
                  }
                />
              </Tooltip>
            )}
          </React.Fragment>
        )}
    </div>
  );
const TierReqCell = (
  value,
  tier_step,
  daily_withdraw_limit,
  monthly_withdraw_limit,
  minimum_activity_thresold,
  requirements,
  requirements2
) => (
    <div>
      <ul class="style-circle" type="circle">
        {Object.keys(requirements).map((req) => (
          <li>
            <b>{requirements[req]}</b>
          </li>
        ))}
      </ul>
      <Divider>OR</Divider>
      <ul class="style-circle" type="circle">
        <li>
          <b>
            {"Total wallet USD Value : $" + requirements2["Total_Wallet_Balance"]}
          </b>
        </li>
      </ul>
    </div>
  );
const TierThresholdCell = (
  value,
  tier_step,
  daily_withdraw_limit,
  monthly_withdraw_limit,
  minimum_activity_thresold,
  requirements
) => (
    <>
      <ul class="style-circle" type="circle">
        <li>
          <b>
            {"Account Age : " +
              minimum_activity_thresold["Account_Age"] +
              " Days"}
          </b>
        </li>
        <li>
          <b>
            {"Minimum Total Transactions : " +
              minimum_activity_thresold["Minimum_Total_Transactions"] +
              " Transactions"}
          </b>
        </li>
        <li>
          <b>
            {"Minimum Total Value of All Transactions : $" +
              minimum_activity_thresold[
              "Minimum_Total_Value_of_All_Transactions"
              ]}
          </b>
        </li>
        <li>
          <b>Deposit Cryptocurrencies : Unlimited</b>
        </li>
        <li>
          <b>Trade : Unlimited</b>
        </li>
      </ul>
    </>
  );
const TierActionCell = (value) => (
  <div>
    {isAllowed("get_tier_data") && (
      <Tooltip title="Edit">
        <Icon
          type="edit"
          className="btn-icon"
          onClick={() => editTier(value)}
        />
      </Tooltip>
    )}
  </div>
);
const TierReqActionCell = (value) => (
  <div>
    <Tooltip title="Edit">
      <Icon type="edit" className="btn-icon" onClick={() => editTier(value)} />
    </Tooltip>
  </div>
);
const PendingTierReqActionCell = (
  value,
  first_name,
  last_name,
  tier_step,
  is_approved,
  request_id
) => (
    <div>
      {/* <Tooltip title="View">
        <Icon
          type="info-circle"
          className="btn-icon-view"
          onClick={() =>
            viewPendingReq(
              value,
              first_name,
              last_name,
              tier_step,
              false,
              user_id
            )
          }
        />
      </Tooltip> */}
      <Tooltip title="Approved">
        <Icon
          type="check-circle"
          className="btn-icon-accept"
          onClick={() =>
            approvePendingReq(
              value,
              first_name,
              last_name,
              tier_step,
              true,
              request_id
            )
          }
        />
      </Tooltip>
      <Tooltip title="Reject">
        <Icon
          type="close-circle"
          className="btn-icon-reject"
          onClick={() =>
            approvePendingReq(
              value,
              first_name,
              last_name,
              tier_step,
              false,
              request_id
            )
          }
        />
      </Tooltip>
    </div>
  );
const SimplexStatusCell = (
  value,
  payment_id,
  quote_id,
  currency,
  settle_currency,
  email,
  side,
  quantity,
  fill_price,
  simplex_payment_status,
  created_at
) => (
    <div className={"order-" + simplex_payment_status}>
      {simplex_payment_status == 1
        ? "Under Approval"
        : simplex_payment_status == 2
          ? "Approved"
          : "Cancelled"}
    </div>
  );

const ReferralNameCell = (value, full_name, deleted_at) => (
  <div>
    {deleted_at !== null ? (
      <Tooltip title={`${full_name} has been deleted`}>
        <Icon
          type="info-circle"
          style={{ margin: "0 10px 0 10px", cursor: "pointer" }}
        />
        {full_name}
      </Tooltip>
    ) : (
        full_name
      )}
  </div>
);

const CoinFeesActionCell = (
  value,
  name,
  slug,
  updated_at,
  type,
  fees_value
) => {
  return (
    <div>
      {isAllowed("update_fees") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() =>
              NetworkFee.edit(value, name, slug, updated_at, type, fees_value)
            }
          />
        </Tooltip>
      )}
    </div>
  );
};

const CoinNoteCell = (slug) => {
  return (
    <div>
      <span>{networkFeesFormula.slug[slug]}</span>
    </div>
  );
};

const CampaignActionCell = (
  value,
  campaign_id,
  campaign_label,
  campaign_start_date,
  campaign_end_date,
  campaign_is_active,
  campaign_created_at,
  campaign_updated_at,
  campaign_deleted_at
) => {
  return (
    <React.Fragment>
      {isAllowed("get_campaigns") && (
        <Tooltip title="View">
          <Icon
            type="info-circle"
            className="btn-icon"
            onClick={() => offers.view(campaign_id)}
          />
        </Tooltip>
      )}
      {/* <Tooltip title="Delete">
        <Icon
          type="delete"
          className="btn-icon"
          onClick={() => offers.delete( value,
            campaign_id,
            campaign_label,
            campaign_start_date,
            campaign_end_date,
            campaign_is_active,
            campaign_created_at,
            campaign_updated_at,
            campaign_deleted_at,)}
        />
      </Tooltip> */}
      {isAllowed("update_campaigns") && (
        <Tooltip title="Edit">
          <Icon
            type="edit"
            className="btn-icon"
            onClick={() => offers.edit(campaign_id)}
          />
        </Tooltip>
      )}
    </React.Fragment>
  );
};

const CampaignSwitchCell = (
  campaign_id,
  campaign_is_active,
  campaign_label
) => (
    <Switch
      checked={campaign_is_active}
      className="switch-cell"
      checkedChildren="Active"
      unCheckedChildren="Inactive"
      size="large"
      disabled={!isAllowed("change_campaign_status")}
      onChange={() =>
        offers.changeState(campaign_id, campaign_is_active, campaign_label)
      }
    />
  );

const CampaignTypeCell = (value) =>
  value == 1 ? "Single Code Use" : "Multiple Code Use";

const ExpireIpDateCell = (data) => (
  <p>
    {data ? (
      moment.utc(data).local().format("DD MMM YYYY LTS") ? (
        <span>
          {" "}
          <Icon type="calendar" />{" "}
          {moment.utc(data).local().format("DD MMM YYYY LTS")}
        </span>
      ) : (
          "-"
        )
    ) : (
        "Permanent"
      )}
  </p>
);

const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
};

const PrecisionCell = (data) => {
  if (!isNaN(parseFloat(data))) data = parseFloat(data);
  return isFloat(data)
    ? parseFloat(data).toFixed(8)
    : data == 0.0
      ? "-"
      : data
        ? parseFloat(data)
        : "-";
};
const Precise = (value, precise_value) => {
  let precise = precise_value.toString();
  let x = parseFloat(value);
  if (precise === "0") {
    // if (Math.abs(x) < 1.0) {
    //   var e = parseInt(x.toString().split("e-")[1]);
    //   if (e) {
    //     x *= Math.pow(10, e - 1);
    //     x = "0." + new Array(e).join("0") + x.toString().substring(2);
    //   }
    // } else {
    //   var e = parseInt(x.toString().split("+")[1]);
    //   if (e > 20) {
    //     e -= 20;
    //     x /= Math.pow(10, e);
    //     x += new Array(e + 1).join("0");
    //   }
    // }
    // if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 0) {
    //   {
    x = x.toFixed(0);
    //     if (
    //       x.toString()[x.toString().length - 1] == "0" &&
    //       (x.toString().split(".")[1][0] != "0" ||
    //         x.toString().split(".")[1][5] != "0")
    //     ) {
    //       return parseFloat(x);
    //     } else if (x.toString().split(".")[1][0] == "0") {
    //       return parseFloat(x).toFixed(0);
    //     }
    //   }
    // }
    return x;
  }
  if (precise === "1") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 1) {
      {
        x = parseFloat(x).toFixed(1);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][1] == "0") {
          if (x.toString().split(".")[1][0] == "0") {
            return parseFloat(x).toFixed(0);
          } else return parseFloat(x).toFixed(1);
        }
      }
    }
    return x;
  }
  if (precise === "2") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 2) {
      {
        x = parseFloat(x).toFixed(2);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][1] == "0") {
          if (x.toString().split(".")[1][0] == "0") {
            return parseFloat(x).toFixed(0);
          } else return parseFloat(x).toFixed(1);
        }
      }
    }
    return x;
  }
  if (precise === "3") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 3) {
      {
        x = parseFloat(x).toFixed(3);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][2] == "0") {
          if (x.toString().split(".")[1][1] == "0") {
            if (x.toString().split(".")[1][0] == "0") {
              return parseFloat(x).toFixed(0);
            } else return parseFloat(x).toFixed(1);
          } else return parseFloat(x).toFixed(2);
        } else return parseFloat(x).toFixed(3);
      }
    }
    return x;
  }
  if (precise === "4") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 4) {
      {
        x = parseFloat(x).toFixed(4);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][3] == "0") {
          if (x.toString().split(".")[1][2] == "0") {
            if (x.toString().split(".")[1][1] == "0") {
              if (x.toString().split(".")[1][0] == "0") {
                return parseFloat(x).toFixed(0);
              } else return parseFloat(x).toFixed(1);
            } else return parseFloat(x).toFixed(2);
          } else return parseFloat(x).toFixed(3);
        } else return parseFloat(x).toFixed(4);
      }
    }
    return x;
  }
  if (precise === "5") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 4) {
      {
        x = parseFloat(x).toFixed(4);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][4] == "0") {
          if (x.toString().split(".")[1][3] == "0") {
            if (x.toString().split(".")[1][2] == "0") {
              if (x.toString().split(".")[1][1] == "0") {
                if (x.toString().split(".")[1][0] == "0") {
                  return parseFloat(x).toFixed(0);
                } else return parseFloat(x).toFixed(1);
              } else return parseFloat(x).toFixed(2);
            } else return parseFloat(x).toFixed(3);
          } else return parseFloat(x).toFixed(4);
        } else return parseFloat(x).toFixed(5);
      }
    }
    return x;
  }
  if (precise === "6") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 6) {
      {
        x = parseFloat(x).toFixed(6);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][5] == "0") {
          if (x.toString().split(".")[1][4] == "0") {
            if (x.toString().split(".")[1][3] == "0") {
              if (x.toString().split(".")[1][2] == "0") {
                if (x.toString().split(".")[1][1] == "0") {
                  if (x.toString().split(".")[1][0] == "0") {
                    return parseFloat(x).toFixed(0);
                  } else return parseFloat(x).toFixed(1);
                } else return parseFloat(x).toFixed(2);
              } else return parseFloat(x).toFixed(3);
            } else return parseFloat(x).toFixed(4);
          } else return parseFloat(x).toFixed(5);
        } else return parseFloat(x).toFixed(6);
      }
    }
    return x;
  }
  if (precise === "7") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 8) {
      {
        x = parseFloat(x).toFixed(8);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][6] == "0") {
          if (x.toString().split(".")[1][5] == "0") {
            if (x.toString().split(".")[1][4] == "0") {
              if (x.toString().split(".")[1][3] == "0") {
                if (x.toString().split(".")[1][2] == "0") {
                  if (x.toString().split(".")[1][1] == "0") {
                    if (x.toString().split(".")[1][0] == "0") {
                      return parseFloat(x).toFixed(0);
                    } else return parseFloat(x).toFixed(1);
                  } else return parseFloat(x).toFixed(2);
                } else return parseFloat(x).toFixed(3);
              } else return parseFloat(x).toFixed(4);
            } else return parseFloat(x).toFixed(5);
          } else return parseFloat(x).toFixed(6);
        } else return parseFloat(x).toFixed(7);
      }
    }
    return x;
  }
  if (precise === "8") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 8) {
      {
        x = parseFloat(x).toFixed(8);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][7] == "0") {
          if (x.toString().split(".")[1][6] == "0") {
            if (x.toString().split(".")[1][5] == "0") {
              if (x.toString().split(".")[1][4] == "0") {
                if (x.toString().split(".")[1][3] == "0") {
                  if (x.toString().split(".")[1][2] == "0") {
                    if (x.toString().split(".")[1][1] == "0") {
                      if (x.toString().split(".")[1][0] == "0") {
                        return parseFloat(x).toFixed(0);
                      } else return parseFloat(x).toFixed(1);
                    } else return parseFloat(x).toFixed(2);
                  } else return parseFloat(x).toFixed(3);
                } else return parseFloat(x).toFixed(4);
              } else return parseFloat(x).toFixed(5);
            } else return parseFloat(x).toFixed(6);
          } else return parseFloat(x).toFixed(7);
        } else return parseFloat(x).toFixed(8);
      }
    }
    return x;
  }
  if (precise === "9") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 9) {
      {
        x = parseFloat(x).toFixed(9);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][8] == "0") {
          if (x.toString().split(".")[1][7] == "0") {
            if (x.toString().split(".")[1][6] == "0") {
              if (x.toString().split(".")[1][5] == "0") {
                if (x.toString().split(".")[1][4] == "0") {
                  if (x.toString().split(".")[1][3] == "0") {
                    if (x.toString().split(".")[1][2] == "0") {
                      if (x.toString().split(".")[1][1] == "0") {
                        if (x.toString().split(".")[1][0] == "0") {
                          return parseFloat(x).toFixed(0);
                        } else return parseFloat(x).toFixed(1);
                      } else return parseFloat(x).toFixed(2);
                    } else return parseFloat(x).toFixed(3);
                  } else return parseFloat(x).toFixed(4);
                } else return parseFloat(x).toFixed(5);
              } else return parseFloat(x).toFixed(6);
            } else return parseFloat(x).toFixed(7);
          } else return parseFloat(x).toFixed(8);
        } else return parseFloat(x).toFixed(9);
      }
    }
    return x;
  }
  if (precise === "10") {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    if (x.toString().split(".")[1] && x.toString().split(".")[1].length > 10) {
      {
        x = parseFloat(x).toFixed(10);
        if (
          x.toString()[x.toString().length - 1] == "0" &&
          (x.toString().split(".")[1][0] != "0" ||
            x.toString().split(".")[1][5] != "0")
        ) {
          return parseFloat(x);
        } else if (x.toString().split(".")[1][9] == "0") {
          if (x.toString().split(".")[1][8] == "0") {
            if (x.toString().split(".")[1][7] == "0") {
              if (x.toString().split(".")[1][6] == "0") {
                if (x.toString().split(".")[1][5] == "0") {
                  if (x.toString().split(".")[1][4] == "0") {
                    if (x.toString().split(".")[1][3] == "0") {
                      if (x.toString().split(".")[1][2] == "0") {
                        if (x.toString().split(".")[1][1] == "0") {
                          if (x.toString().split(".")[1][0] == "0") {
                            return parseFloat(x).toFixed(0);
                          } else return parseFloat(x).toFixed(1);
                        } else return parseFloat(x).toFixed(2);
                      } else return parseFloat(x).toFixed(3);
                    } else return parseFloat(x).toFixed(4);
                  } else return parseFloat(x).toFixed(5);
                } else return parseFloat(x).toFixed(6);
              } else return parseFloat(x).toFixed(7);
            } else return parseFloat(x).toFixed(8);
          } else return parseFloat(x).toFixed(9);
        } else return parseFloat(x).toFixed(10);
      }
    }
    return x;
  }
};

const CollectedAmountCell = (value) =>
  value.map((ele) => (
    <div>
      <span>
        {parseFloat(ele.collectedamount).toFixed(8) + " " + ele.coin_name}
      </span>
      <br />
    </div>
  ));

const ToolTipsCell = (data) => {
  return (
    <Tooltip title={data}>
      <p className="text-ellipsis">{data}</p>
    </Tooltip>
  );
};

export {
  IPCell,
  DateCell,
  HistoryDateCell,
  ImageCell,
  LinkCell,
  TextCell,
  ApproveCell,
  EditableCell,
  DeleteCell,
  FilterDropdown,
  ActionCell,
  DeletedUserActionCell,
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
  VolumeOrderSell,
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
  SMSTemplateActionCell,
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
  ReferralNameCell,
  ObjectCell,
  CoinFeesActionCell,
  CoinNoteCell,
  CampaignActionCell,
  CampaignSwitchCell,
  CampaignTypeCell,
  OfferDateCell,
  ExpireIpDateCell,
  CollectedAmountCell,
  PrecisionCell,
  ToolTipsCell,
  TransactionIdHashCell,
  ConvertSatoshiToAssetCell,
  InActiveUserActionCell,
  getTierDoc,
  Precise,
};
