const options = [
  {
    key: "dashboard",
    label: "sidebar.dashboard",
    leftIcon: "fas fa-tachometer-alt",
    module: "dashboard",
  },
  {
    key: "users",
    label: "sidebar.users",
    leftIcon: "fas fa-users",
    module: "users",
    permssions: [
      "get_users",
      "get_inactive_users",
      "get_deleted_users"
    ]
  },
  {
    key: "assets",
    label: "sidebar.coins",
    leftIcon: "fas fa-coins",
    module: "assets",
    permssions: [
      "get_coins"
    ]
  },
  {
    key: "pairs",
    label: "sidebar.fees",
    leftIcon: "fas fa-coins",
    module: "pairs",
    permssions: [
      "get_all_pairs"
    ]
  },
  {
    key: "countries",
    label: "sidebar.country",
    leftIcon: "far fa-flag",
    module: "countries",
    permssions: [
      "get_countries_data"
    ]
  },
  {
    key: "roles",
    label: "sidebar.roles",
    leftIcon: "fas fa-tasks",
    module: "roles",
    permssions: [
      "get_role"
    ]
  },
  {
    key: "employee",
    label: "sidebar.employee",
    leftIcon: "fas fa-user-tie",
    module: "employee",
    permssions: [
      "get_employee"
    ]
  },
  // {
  //   key: "limit-management",
  //   label: "sidebar.limit",
  //   leftIcon: "fas fa-sliders-h",
  //   module: "limit_management",

  // },
  {
    key: "transaction-history",
    label: "sidebar.transactionHistory",
    leftIcon: "fas fa-exchange-alt",
    module: "transaction_history",
    permssions: [
      "get_all_transactions"
    ]
  },
  {
    key: "trade-history",
    label: "sidebar.tradeHistory",
    leftIcon: "fas fa-history",
    module: "trade_history",
    permssions: [
      "get_all_trade"
    ]
  },
  {
    key: "withdraw-requests",
    label: "sidebar.withdrawRequests",
    leftIcon: "fas fa-hand-holding-usd",
    module: "withdraw_requests",
    permssions: [
      "get_all_withdraw_request"
    ]
  },
  {
    key: "jobs",
    label: "sidebar.jobs",
    leftIcon: "fas fa-suitcase-rolling",
    module: "jobs",
    permssions: [
      "get_all_jobs",
      "get_job_categories"
    ]
  },
  {
    key: "kyc",
    label: "sidebar.kyc",
    leftIcon: "fas fa-id-card",
    module: "kyc",
    permssions: [
      "get_all_kyc_data"
    ]
  },
  {
    key: "fees",
    label: "Fees",
    leftIcon: "fas fa-percentage",
    module: "fees",
    permssions: [
      "get_withdrawl_faldax_fee",
      "get_all_fee"
    ]
  },
  {
    key: "panic-button",
    label: "Panic Button",
    leftIcon: "fas fa-ban",
    module: "panic_button",
    permssions: [
      "get_panic_status"
    ]
  },
  {
    key: "news",
    label: "News",
    leftIcon: "fas fa-newspaper",
    module: "news",
    permssions: [
      "get_all_news"
    ]
  },
  {
    key: "news-source",
    label: "News Sources",
    leftIcon: "fas fa-rss-square",
    module: "news_source",
    permssions: [
      "get_all_news_source"
    ]
  },
  {
    key: "referral",
    label: "Affiliate Program & Referrals",
    leftIcon: "fas fa-user-friends",
    module: "is_referral",
    permssions: [
      "get_referal_list",
      "get_referral_details"
    ]
  },
  {
    key: "account-class",
    label: "Account Class Management",
    leftIcon: "fas fa-file-invoice",
    module: "account_class",
    permssions: [
      "get_all_account_classes"
    ]
  },
  {
    key: "email-templates",
    label: "Email Templates",
    leftIcon: "fas fa-envelope",
    module: "email_templates",
    permssions: [
      "get_email_template"
    ]
  },
  {
    key: "two-factor-requests",
    label: "Two-Factor Requests",
    leftIcon: "fas fa-address-card",
    module: "two_factor_requests",
    permssions: [
      "get_twofactors_requests"
    ]
  },
  {
    key: "notifications",
    label: "Notifications",
    leftIcon: "fas fa-bell",
    module: "notifications",
    permssions: [
      "get_admin_thresholds",
      "get_admin_thresholds_contacts"
    ]
  },
  {
    key: "wallet-dashboard",
    label: "Wallet Dashboard",
    leftIcon: "fas fa-wallet",
    module: "wallet_dashboard",
    permssions: [
      "admin_wallet_fees_details"
    ]
  },
  // {
  //   key: "network-fee",
  //   label: "Network Fees",
  //   leftIcon: "fas fa-wifi",
  //   module: "network_fee",
  //   permssions: [
  //     "get_coin_fees"
  //   ]
  // },
  {
    key: "batch-and-balance",
    label: "Batch & Balance",
    leftIcon: "fas fa-balance-scale",
    module: "batch_and_balance",
    permssions: [
      "list_batch"
    ]
  },
  // {
  //   key: "account-tier",
  //   label: "Account Tier Management",
  //   leftIcon: "fas fa-file-invoice",
  //   module: "tiers",
  //   permssions: [
  //     "get_tier_details",
  //     "user_tier_request"
  //   ]
  // },
  {
    key: "simplex-token",
    label: "Simplex Token",
    leftIcon: "fas fa-file-invoice",
    module: "simplex_token",
    permssions: [
      "get_token_value"
    ]
  },
  {
    key: "campaign",
    label: "Offers",
    leftIcon: "fas fa-percent",
    module: "offers",
    permssions: [
      "list_campaigns"
    ]
  }
];

export default options;
