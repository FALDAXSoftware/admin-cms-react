const exportResidualHeaders = [
  { key: "source_address", label: "Source Address" },
  { key: "destination_address", label: "Destination Address" },
  { key: "amount", label: "Amount" },
  { key: "user_id", label: "User ID" },
  { key: "is_executed", label: "Is Executed ?" },
  { key: "transaction_type", label: "Transaction Type" },
  { key: "coin_id", label: "Asset ID" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "is_admin", label: "Is Admin ?" },
  { key: "transaction_id", label: "Transaction Id" },
  { key: "faldax_fee", label: "FALDAX Fee" },
  { key: "estimated_network_fees", label: "Estimated Network Fees" },
  { key: "actual_network_fees", label: "Actual Network Fees" },
  { key: "actual_amount", label: "Actual Amount" },
  { key: "is_done", label: "Is Done ?" },
  { key: "sender_user_balance_before", label: "Sender User Balance Before" },
  { key: "receiver_user_balance_before", label: "Receive User Balance Before" },
  { key: "warm_wallet_balance_before", label: "Warm Wallet Balance Before" },
  { key: "transaction_from", label: "Transaction From" },
  { key: "residual_amount", label: "Residual Amount" },
  { key: "id", label: "Id" },
  { key: "coin", label: "Asset" },
  { key: "coin_code", label: "Asset Code" }
];

const exportCryptoOnly = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "symbol", label: "Asset" },
  { key: "currency", label: "Currency" },
  { key: "offer_code", label: "Offer Code" },
  { key: "order_status", label: "Order Status" },
  { key: "settle_currency", label: "Settle Currency" },
  { key: "side", label: "Side" },
  { key: "quantity", label: "Quantity" },
  { key: "fill_price", label: "Fill Price" },
  { key: "is_partially_filled", label: "Is Partially Filled ?" },
  { key: "price", label: "Price" },
  { key: "email", label: "Email" },
  { key: "created_at", label: "Created At" },
  { key: "faldax_fees", label: "FALDAX Fees" },
  { key: "network_fees", label: "Network Fees" },
  { key: "order_id", label: "Order Id" },
  { key: "buy_currency_amount", label: "You Receive" },
  { key: "sell_currency_amount", label: "You Send" },
  { key: "faldax_fees_actual", label: "Actual FALDAX Fees" },
  { key: "difference_faldax_commission", label: "FALDAX Commission" },
  { key: "offer_applied", label: "Offer Applied" },
  { key: "limit_price", label: "Limit Price" },
  { key: "asset1_usd_value", label: "Asset1 USD Value" },
  { key: "asset2_usd_value", label: "Asset2 USD Value" },
  { key: "execution_report", label: "Execution Report" }
];

const exportCreditCard = [
  { key: "email", label: "Email" },
  { key: "payment_id", label: "Payment ID" },
  { key: "quote_id", label: "Quote ID" },
  { key: "currency", label: "Currency" },
  { key: "settle_currency", label: "Settle Currency" },
  { key: "quantity", label: "Quantity" },
  { key: "user_id", label: "User ID" },
  { key: "symbol", label: "Asset" },
  { key: "side", label: "Side" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Update At" },
  { key: "fill_price", label: "Fill Price" },
  { key: "price", label: "Price" },
  { key: "simplex_payment_status", label: "Payment Status" },
  { key: "trade_type", label: "Trade Type" },
  { key: "order_status", label: "Order Status" },
  { key: "order_type", label: "Order Type" },
  { key: "address", label: "Address" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "is_processed", label: "Is Processed" },
  { key: "id", label: "ID" }
];

const exportWithdrawalRequest = [
  { key: "source_address", label: "Source Address" },
  { key: "destination_address", label: "Destination Address" },
  { key: "amount", label: "Amount" },
  { key: "user_id", label: "User ID" },
  { key: "is_approve", label: "Is Approve ?" },
  { key: "transaction_type", label: "Transaction Type" },
  { key: "coin_id", label: "Asset ID" },
  { key: "fees", label: "Fees" },
  { key: "is_executed", label: "Is Executed ?" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "id", label: "ID" },
  { key: "reason", label: "Reason" },
  { key: "faldax_fee", label: "FALDAX Fee" },
  { key: "transaction_id", label: "Transaction ID" },
  { key: "network_fee", label: "Network Fee" },
  { key: "actual_amount", label: "Actual Amount" },
  { key: "email", label: "Email" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_code", label: "Asset Code" }
];

const exportCustomerIdVerification = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "country", label: "Country" },
  { key: "dob", label: "Data Of birth" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "zip", label: "Zip" },
  { key: "front_doc", label: "Front Doc" },
  { key: "back_doc", label: "Back Doc" },
  { key: "ssn", label: "SSN" },
  { key: "result", label: "Result" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "user_id", label: "User ID" },
  { key: "steps", label: "Steps" },
  { key: "address_2", label: "Address" },
  { key: "direct_response", label: "Direct Response" },
  { key: "webhook_response", label: "Webhook Response" },
  { key: "mtid", label: "MTID" },
  { key: "comments", label: "Comment" },
  { key: "kyc_doc_details", label: "Kyc Doc Details" },
  { key: "is_approve", label: "Is Approve ?" },
  { key: "status", label: "Status" },
  { key: "phone_number", label: "Phone Number" },
  { key: "state", label: "State" },
  { key: "country_code", label: "County Code" },
  { key: "id_type", label: "ID Type" },
  { key: "id", label: "ID" },
  { key: "email", label: "Email" },
  { key: "account_tier", label: "Account Tier" }
];

const exportWallet = [
  { key: "id", label: "ID" },
  { key: "coin_icon", label: "Asset Icon" },
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_code", label: "Asset Code" },
  { key: "coin", label: "Asset" },
  { key: "min_limit", label: "Minimum Limit" },
  { key: "fiat", label: "Fiat" },
  { key: "send_address", label: "Send Address" },
  { key: "receive_address", label: "Receive Address" },
  { key: "total_earned_from_wallets", label: "Total Earned from Wallets" },
  { key: "total_earned_from_forfeit", label: "Total Earned from Forfeit" },
  { key: "total_earned_from_jst", label: "Total Earned from Jst" },
  { key: "total", label: "Total" }
];

const exportFaldaxFeeWallet = [
  { key: "coin", label: "Asset" },
  { key: "amount", label: "Amount" },
  { key: "transaction_id", label: "Transaction ID" },
  { key: "faldax_fee", label: "FALDAX Fee" },
  { key: "residual_amount", label: "Residual Amount" },
  { key: "created_at", label: "Created At" },
  { key: "coin_code", label: "Asset Code" },
  { key: "source_address", label: "Source Address" },
  { key: "destination_address", label: "Destination Address" }
];

const exportForfietFund = [
  { key: "id", label: "Id" },
  { key: "coin", label: "Asset" },
  { key: "coin_code", label: "Asset Code" },
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "created_at", label: "Created At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "balance", label: "Balance" },
  { key: "receive_address", label: "Receive Address" },
  { key: "send_address", label: "Send Address" }
];

const exportDirectDeposit = [
  { key: "source_address", label: "Source Address" },
  { key: "coin", label: "Asset" },
  { key: "destination_address", label: "Destination Address" },
  { key: "amount", label: "Amount" },
  { key: "transaction_id", label: "Transaction ID" },
  { key: "user_id", label: "User ID" },
  { key: "is_executed", label: "Is Executed ?" },
  { key: "transaction_type", label: "Transaction Type" },
  { key: "coin_id", label: "Asset ID" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "id", label: "ID" },
  { key: "is_admin", label: "Is Admin" },
  { key: "faldax_fee", label: "FALDAX Fee" },
  { key: "estimated_network_fees", label: "Estimated Network Fees" },
  { key: "actual_network_fees", label: "Actual Network Fees" },
  { key: "actual_amount", label: "Actual Amount" },
  { key: "is_done", label: "Is Done ?" },
  { key: "sender_user_balance_before", label: "Sender User Balance Before" },
  { key: "receiver_user_balance_before", label: "Receive User Balance Before" },
  { key: "warm_wallet_balance_before", label: "Warm Wallet Balance Before" },
  { key: "transaction_from", label: "Transaction From" },
  { key: "residual_amount", label: "Residual Amount" },
  { key: "coin_code", label: "Asset Code" }
];

const exportCryptoOnlyWallet = [
  { key: "fill_price", label: "Fill Price" },
  { key: "quantity", label: "Quantity" },
  { key: "order_status", label: "Order Status" },
  { key: "symbol", label: "Asset" },
  { key: "settle_currency", label: "Settle Currency" },
  { key: "currency", label: "Currency" },
  { key: "limit_price", label: "Limit Price" },
  { key: "order_id", label: "Order ID" },
  { key: "execution_report", label: "Execution Report" },
  { key: "exec_id", label: "Execution ID" },
  { key: "transact_time", label: "Transact_time" },
  { key: "faldax_fees", label: "FALDAX Fees" },
  { key: "network_fees", label: "Network Fees" },
  { key: "comission", label: "Commission" },
  { key: "email", label: "Email" },
  { key: "coin_code", label: "Asset Code" }
];

const exportNews = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "cover_image", label: "Cover Image" },
  { key: "posted_at", label: "Posted At" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "search_keywords", label: "Search Keywords" },
  { key: "owner", label: "Owner" },
  { key: "link", label: "Link" },
  { key: "is_active", label: "Is Active ?" },
  { key: "owner_id", label: "Owner ID" }
];

const exportReferrals = [
  { key: "id", label: "ID" },
  { key: "email", label: "Email" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "emailValue", label: "Email Value" },
  { key: "no_of_referral", label: "No of Referral" },
  { key: "profile_pic", label: "Profile Pic" }
];

const export2faRequest = [
  { key: "user_id", label: "User ID" },
  { key: "uploaded_file", label: "Upload File" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "id", label: "ID" },
  { key: "reason", label: "Reason" },
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" }
];

const exportOffers = [
  { key: "id", label: "ID" },
  { key: "label", label: "Label" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "is_active", label: "Is Active ?" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "description", label: "Description" },
  { key: "no_of_transactions", label: "No of Transactions" },
  { key: "fees_allowed", label: "Fees Allowed" },
  { key: "usage", label: "Usage" }
];

const exportHotReceiveWallet = [
  { key: "id", label: "ID" },
  { key: "coin_icon", label: "Asset Icon" },
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_code", label: "Asset Code" },
  { key: "coin", label: "Asset" },
  { key: "hot_receive_wallet_address", label: "Hot Receive Wallet Address" },
  { key: "balance", label: "Balance" },
  { key: "address", label: "Address" }
];

const exportOffersUsages = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "created_at", label: "Create At" },
  { key: "campaign_offer_id", label: "Campaign Offer ID" },
  { key: "order_id", label: "Order ID" },
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "offer_type", label: "Offer Type" },
  { key: "is_attempted", label: "Is Attempted ?" },
  { key: "waived_fees", label: "Waived Fees" },
  { key: "faldax_fees", label: "FALDAX Fees" }
];

const exportReferralDetails = [
  { key: "amount", label: "Amount" },
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_icon", label: "Asset Icon" },
  { key: "email", label: "Email" },
  { key: "txid", label: "Transaction ID" },
  { key: "updated_at", label: "Updated At" }
];

const exportJobApplicants = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone Number" },
  { key: "location", label: "Location" },
  { key: "linkedin_profile", label: "Linkedin Profile" },
  { key: "website_url", label: "Website Url" },
  { key: "resume", label: "Resume" },
  { key: "cover_letter", label: "Cover Latter" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "id", label: "ID" },
  { key: "job_id", label: "Job ID" }
];
const exportJobs = [
  { key: "Id", label: "ID" },
  { key: "position", label: "Position" },
  { key: "job_desc", label: "Job Description" },
  { key: "location", label: "Location" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "short_desc", label: "Short Description" },
  { key: "is_active", label: "Is Active ?" },
  { key: "category_id", label: "Category Id" },
  { key: "category", label: "Category" }
];

const exportLoginHistory = [
  { key: "id", label: "ID" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "ip", label: "Ip" },
  { key: "is_logged_in", label: "Is LoggedIn ?" },
  { key: "device_type", label: "Device Type" },
  { key: "device_token", label: "Device Token" },
  { key: "jwt_token", label: "Jwt Token" },
  { key: "user", label: "User" }
];

const exportTransactionHistory = [
  { key: "source_address", label: "Source Address" },
  { key: "destination_address", label: "Destination Address" },
  { key: "amount", label: "Amount" },
  { key: "user_id", label: "User Id" },
  { key: "is_executed", label: "Is Executed" },
  { key: "transaction_type", label: "Transaction Type" },
  { key: "coin_id", label: "Asset Code" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "id", label: "ID" },
  { key: "is_admin", label: "Is Admin ?" },
  { key: "transaction_id", label: "Transaction ID" },
  { key: "faldax_fee", label: "FALDAX Fee" },
  { key: "estimated_network_fees", label: "Estimated Network fees" },
  { key: "actual_network_fees", label: "Actual Network Fees" },
  { key: "actual_amount", label: "Actual Amount" },
  { key: "is_done", label: "Is Done ?" },
  { key: "sender_user_balance_before", label: "Sender User Balance Before" },
  { key: "receiver_user_balance_before", label: "Receive User Balance Before" },
  { key: "warm_wallet_balance_before", label: "Warm Wallet Balance" },
  { key: "transaction_from", label: "Transaction From" },
  { key: "residual_amount", label: "Residual Amount" },
  { key: "email", label: "Email" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "coin", label: "Asset" },
  { key: "coin_code", label: "Asset Code" }
];

const exportAsset = [
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_code", label: "Asset Code" },
  { key: "is_active", label: "Is Active ?" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Delete At" },
  { key: "wallet_address", label: "Wallet Address" },
  { key: "id", label: "ID" },
  { key: "description", label: "Description" },
  { key: "coin_icon", label: "Asset Icon" },
  { key: "is_fiat", label: "Is Fiat ?" },
  { key: "coin", label: "Asset" },
  { key: "type", label: "Asset Type" },
  { key: "iserc", label: "Is ERC ?" },
  { key: "deposit_method", label: "Deposit Method" },
  { key: "kraken_coin_name", label: "Kraken Asset Name" },
  { key: "min_limit", label: "Min Limit" },
  { key: "max_limit", label: "Max Limit" },
  { key: "warm_wallet_address", label: "Warm Wallet Address" },
  { key: "hot_send_wallet_address", label: "Hot Send Wallet Address" },
  { key: "custody_wallet_address", label: "Custodial Wallet Address" },
  { key: "hot_receive_wallet_address", label: "Hot Receive Wallet Address" },
  { key: "is_address_created_signup", label: "Is Address Created SignUp ?" },
  { key: "min_thresold", label: "Min Threshold" },
  { key: "is_simplex_supported", label: "Is Simplex Supported ?" },
  { key: "is_jst_supported", label: "Is Jst Supported ?" },
  { key: "jst_min_coin_limit", label: "Jst Min Asset Limit" }
];

const exportCountry = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "is_active", label: "Is Active ?" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "color", label: "Color" },
  { key: "legality", label: "Legality" },
  { key: "stateCount", label: "State Count" }
];

const exportState = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "is_active", label: "Is Active ?" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "color", label: "Color" },
  { key: "legality", label: "Legality" },
  { key: "stateCount", label: "State Count" }
];

const exportEmployee = [
  { key: "id", label: "ID" },
  { key: "first_name", label: "First Name" },
  { key: "email", label: "Email" },
  { key: "password", label: "Password" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "reset_token", label: "Reset Token" },
  { key: "role_id", label: "Role ID" },
  { key: "is_active", label: "Is Active ?" },
  { key: "last_name", label: "Last Name" },
  { key: "address", label: "Address" },
  { key: "phone_number", label: "Phone Number" },
  { key: "is_twofactor", label: "Is 2FA" },
  { key: "twofactor_secret", label: "2FA Secret" },
  { key: "auth_code", label: "Auth Code" },
  { key: "add_user", label: "Add User" },
  { key: "whitelist_ip", label: "Whitelist Ip" },
  { key: "is_whitelist_ip", label: "Is Whitelist Ip" },
  { key: "role", label: "Role" }
];

const exportUsers = [
  { key: "id", label: "ID" },
  { key: "full_name", label: "Full Name" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "password", label: "Password" },
  { key: "phone_number", label: "Phone Number" },
  { key: "country", label: "Country" },
  { key: "uuid", label: "UUID" },
  { key: "dob", label: "Date of Birth" },
  { key: "created_at", label: "Created At" },
  { key: "street_address", label: "Street Address" },
  { key: "city_town", label: "City" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "referred_id", label: "Referred Id" },
  { key: "is_active", label: "Is Active ?" },
  { key: "is_verified", label: "Is Verified ?" },
  { key: "email_verify_token", label: "Email Verify Token" },
  { key: "reset_token", label: "Reset Token" },
  { key: "is_twofactor", label: "Is Enable 2FA ?" },
  { key: "twofactor_secret", label: "2FA Secret" },
  { key: "auth_code", label: "Auth Code" },
  { key: "referral_code", label: "Referral Code" },
  { key: "zip", label: "Zip" },
  { key: "street_address_2", label: "Street Address 2" },
  { key: "postal_code", label: "Postal Code" },
  { key: "reset_token_expire", label: "Reset Token Expire" },
  { key: "device_token", label: "Device token" },
  { key: "device_type", label: "Device Type" },
  { key: "fiat", label: "Fiat" },
  { key: "state", label: "State" },
  { key: "country_id", label: "Country ID" },
  { key: "state_id", label: "State ID" },
  { key: "diffrence_fiat", label: "Different Fiat" },
  { key: "total_value", label: "Total Value" },
  { key: "percent_wallet", label: "Percent Wallet" },
  { key: "date_format", label: "Date Formate" },
  { key: "referal_percentage", label: "Referral Percentage" },
  { key: "hubspot_id", label: "Hobspot ID" },
  { key: "new_ip_verification_token", label: "New Ip Verification Token" },
  { key: "new_ip", label: "New Ip" },
  { key: "requested_email", label: "Requested Email Label" },
  { key: "new_email_token", label: "New Email Token" },
  { key: "is_new_email_verified", label: "Is New Email Verified ?" },
  { key: "account_tier", label: "Account Tier" },
  { key: "account_class", label: "Account Class" },
  { key: "country_code", label: "Country Code" },
  { key: "gender", label: "Gender" },
  { key: "middle_name", label: "Middle Name" },
  { key: "deleted_by", label: "Deleted By" },
  { key: "whitelist_ip", label: "WhiteList Ip" },
  { key: "security_feature", label: "Security Feature" },
  {
    key: "security_feature_expired_time",
    label: "Security Feature Expired Time"
  },
  { key: "is_whitelist_ip", label: "Is Whitelist Ip ?" },
  { key: "twofactor_backup_code", label: "2FA Backup Code" },
  { key: "is_terms_agreed", label: "Is Terms Agreed ?" },
  { key: "signup_token_expiration", label: "SignUp Token Expiration" },
  { key: "forgot_token_expiration", label: "Forgot Token Expiration" },
  { key: "device_token_expiration", label: "Device Token Expiration" },
  { key: "default_language", label: "Default Language" },
  { key: "customer_id", label: "Customer ID" },
  { key: "send_address", label: "Send Address" },
  { key: "receive_address", label: "Receive Address" },
  { key: "no_of_referrals", label: "No of Referrals" },
  { key: "ip", label: "Ip" },
  { key: "is_logged_in", label: "Is Logged In ?" },
  { key: "last_login_datetime", label: "Last Seen" }
];

const exportReferralUsers = [
  { key: "email", label: "Email" },
  { key: "password", label: "Password" },
  { key: "phone_number", label: "Phone Number" },
  { key: "full_name", label: "Full Name" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "country", label: "Country" },
  { key: "street_address", label: "Street Address" },
  { key: "city_town", label: "City Town" },
  { key: "profile_pic", label: "Profile Pic" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "created_at", label: "Created At" },
  { key: "id", label: "ID" },
  { key: "referred_id", label: "Referred ID" },
  { key: "is_active", label: "Is Active ?" },
  { key: "is_verified", label: "Is Verified ?" },
  { key: "email_verify_token", label: "Email Verify Token" },
  { key: "reset_token", label: "Reset Token" },
  { key: "dob", label: "Date of Birth" },
  { key: "is_twofactor", label: "Is 2FA ?" },
  { key: "twofactor_secret", label: "2FA Secret" },
  { key: "auth_code", label: "Auth Code" },
  { key: "referral_code", label: "Referral Code" },
  { key: "zip", label: "Zip" },
  { key: "street_address_2", label: "Street Address" },
  { key: "postal_code", label: "Postal Code" },
  { key: "reset_token_expire", label: "Reset Token Expire" },
  { key: "device_token", label: "Device Token" },
  { key: "device_type", label: "Device Type" },
  { key: "fiat", label: "Fiat" },
  { key: "state", label: "State" },
  { key: "country_id", label: "Country ID" },
  { key: "state_id", label: "State ID" },
  { key: "diffrence_fiat", label: "Difference Fiat" },
  { key: "total_value", label: "Total Value" },
  { key: "percent_wallet", label: "Wallet Percent" },
  { key: "date_format", label: "Date Formate" },
  { key: "referal_percentage", label: "Referral Percentage" },
  { key: "hubspot_id", label: "Hubsport ID" },
  { key: "new_ip_verification_token", label: "New Ip Verification Token" },
  { key: "new_ip", label: "New Ip" },
  { key: "requested_email", label: "Requested Email" },
  { key: "new_email_token", label: "New Email Token" },
  { key: "is_new_email_verified", label: "Is New Email Verified ?" },
  { key: "account_tier", label: "Account Tier" },
  { key: "account_class", label: "Account Class" },
  { key: "country_code", label: "Country Code" },
  { key: "gender", label: "Gender" },
  { key: "middle_name", label: "Middle Name" },
  { key: "deleted_by", label: "Delete By" },
  { key: "whitelist_ip", label: "Whitelist Ip" },
  { key: "security_feature", label: "Security Feature" },
  {
    key: "security_feature_expired_time",
    label: "Security Feature Expired Time"
  },
  { key: "is_whitelist_ip", label: "is Whitelist Ip" },
  { key: "twofactor_backup_code", label: "2FA Backup code" },
  { key: "is_terms_agreed", label: "Is Terms Agreed ?" },
  { key: "signup_token_expiration", label: "Signup Token Expiration" },
  { key: "forgot_token_expiration", label: "Forgot Token Expiration" },
  { key: "device_token_expiration", label: "Device Token Expiration" },
  { key: "default_language", label: "Default Language" },
  { key: "customer_id", label: "Customer ID" },
  { key: "total_referal", label: "Total Referral" },
  { key: "refered_by", label: "Referred By" },
  { key: "collected_amount", label: "Collected Amount" }
];

const exportHotReceiveWalletDetails = [
  { key: "id", label: "ID" },
  { key: "coin", label: "Asset" },
  { key: "wallet", label: "Wallet" },
  { key: "enterprise", label: "Enterprise" },
  { key: "txid", label: "Txid" },
  { key: "height", label: "Height" },
  { key: "date", label: "Date" },
  { key: "confirmations", label: "Confirmations" },
  { key: "type", label: "Type" },
  { key: "value", label: "Value" },
  { key: "valueString", label: "Value String" },
  { key: "baseValue", label: "Base Value" },
  { key: "baseValueString", label: "Base Value String" },
  { key: "feeString", label: "Fee String" },
  { key: "payGoFee", label: "Pay Go Fee" },
  { key: "payGoFeeString", label: "Pay Go Fee String" },
  { key: "usd", label: "USD" },
  { key: "usdRate", label: "USD Rate" },
  { key: "state", label: "State" },
  { key: "instant", label: "Instant" },
  { key: "isReward", label: "isReward" },
  { key: "isFee", label: "Is Fee" },
  { key: "tags", label: "Tags" },
  { key: "history", label: "History" },
  { key: "entries", label: "Entries" },
  { key: "unconfirmedTime", label: "Unconfirmed Time" },
  { key: "createdTime", label: "Created Time" },
  { key: "label", label: "Label" },
  { key: "outputs", label: "Outputs" },
  { key: "inputs", label: "Inputs" },
  { key: "normalizedTxHash", label: "Normalized Tx Hash" }
];
const exportFaldaxMainWallet = [
  { key: "id", label: "ID" },
  { key: "coin_icon", label: "Asset Icon" },
  { key: "coin_name", label: "Asset Name" },
  { key: "coin_code", label: "Asset Code" },
  { key: "coin", label: "Asset" },
  { key: "min_limit", label: "Min Limit" },
  { key: "iserc", label: "Is ERC ?" },
  { key: "is_active", label: "Is Active ?" },
  { key: "fiat", label: "Fiat Value" },
  { key: "send_address", label: "Send Address" },
  { key: "receive_address", label: "Receive Address" },
  { key: "balance", label: "Balance" }
];
const exportPanicHistory = [
  { key: "id", label: "ID" },
  { key: "ip", label: "IP" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "panic_status", label: "Status" }
];

const exportPair = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "maker_fee", label: "Maker Fee" },
  { key: "taker_fee", label: "Taker Fee" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
  { key: "deleted_at", label: "Deleted At" },
  { key: "is_active", label: "Is Active ?" },
  { key: "coin_code1", label: "Asset Code1" },
  { key: "coin_code2", label: "Asset Code2" },
  { key: "symbol", label: "Symbol" },
  { key: "ask_price", label: "Ask Price" },
  { key: "bid_price", label: "Bid Price" },
  { key: "kraken_pair", label: "Kraken Pair" }
];

export {
  exportResidualHeaders,
  exportLoginHistory,
  exportJobApplicants,
  exportCryptoOnly,
  exportCreditCard,
  exportWithdrawalRequest,
  exportReferralDetails,
  exportCustomerIdVerification,
  exportWallet,
  exportFaldaxFeeWallet,
  exportForfietFund,
  exportDirectDeposit,
  exportCryptoOnlyWallet,
  exportNews,
  exportReferrals,
  export2faRequest,
  exportOffers,
  exportOffersUsages,
  exportJobs,
  exportTransactionHistory,
  exportAsset,
  exportCountry,
  exportState,
  exportEmployee,
  exportUsers,
  exportReferralUsers,
  exportHotReceiveWallet,
  exportHotReceiveWalletDetails,
  exportFaldaxMainWallet,
  exportPanicHistory,
  exportPair
};
