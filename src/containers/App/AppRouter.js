import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import { connect } from "react-redux";

const routes = [
  {
    path: "users",
    component: asyncComponent(() => import("../Page/Users/users")),
    module: "users",
  },
  {
    path: "assets",
    component: asyncComponent(() => import("../Page/Assets/assets")),
    module: "assets",
  },
  {
    path: "key",
    component: asyncComponent(() => import("../Page/key/key")),
    module: "key",
  },
  {
    path: "terms-and-conditions",
    component: asyncComponent(() => import("../Page/Terms/terms")),
    module: "terms-and-conditions",
  },
  {
    path: "tier-documentation",
    component: asyncComponent(() => import("../Page/TierDocument/tabs")),
    module: "tier-documentation",
  },
  {
    path: "countries",
    component: asyncComponent(() => import("../Page/Country/countries")),
    module: "countries",
  },
  {
    path: "roles",
    component: asyncComponent(() => import("../Page/Roles/roles")),
    module: "roles",
  },
  {
    path: "employee",
    component: asyncComponent(() => import("../Page/Employee/employee")),
    module: "employee",
  },
  {
    path: "pairs",
    component: asyncComponent(() => import("../Page/Pairs/tabs")),
    module: "pairs",
  },
  {
    path: "send-coin-fee",
    component: asyncComponent(() => import("../Page/CoinFee/sendCoinFee")),
    module: "send_coin_fee",
  },
  // {
  //     path: "limit-management",
  //     component: asyncComponent(() => import("../Page/LimitManagement/limitManagement")),
  //     module: "limit_management"
  // },
  {
    path: "transaction-history",
    component: asyncComponent(() =>
      import("../Page/TransactionHistory/transactionHistoryTabs")
    ),
    module: "transaction_history",
  },
  {
    path: "trade-history",
    component: asyncComponent(() => import("../Page/Trade/allHistory")),
    module: "trade_history",
  },
  {
    path: "withdraw-requests",
    component: asyncComponent(() => import("../Page/WithdrawRequest/tabs")),
    module: "withdraw_requests",
  },
  {
    path: "jobs",
    component: asyncComponent(() => import("../Page/Jobs/jobs")),
    module: "jobs",
  },
  {
    path: "kyc",
    component: asyncComponent(() => import("../Page/KYC/kycTabs")),
    module: "kyc",
  },
  {
    path: "fees",
    component: asyncComponent(() => import("../Page/Fees/fees")),
    module: "fees",
  },
  {
    path: "panic-button",
    component: asyncComponent(() => import("../Page/Panic/tabs")),
    module: "panic_button",
  },
  {
    path: "news",
    component: asyncComponent(() => import("../Page/News/tabs")),
    module: "news",
  },
  {
    path: "referral",
    component: asyncComponent(() => import("../Page/Referral/tabs")),
    module: "is_referral",
  },
  {
    path: "users/add-user",
    component: asyncComponent(() => import("../Page/Users/addUser")),
    module: "add_user",
  },
  {
    path: "account-class",
    component: asyncComponent(() => import("../Page/AccountClass/tabs")),
    module: "account_class",
  },
  {
    path: "email-templates",
    component: asyncComponent(() =>
      import("../Page/EmailTemplates/emailTemplates")
    ),
    module: "email_templates",
  },
  {
    path: "sms-templates",
    component: asyncComponent(() =>
      import("../Page/SmsTemplates/smsTemplates")
    ),
    module: "sms_templates",
  },
  {
    path: "new's-source",
    component: asyncComponent(() => import("../Page/NewsSource/newsSources")),
    module: "news_source",
  },
  {
    path: "two-factor-requests",
    component: asyncComponent(() =>
      import("../Page/TwoFactorRequest/TwoFactorRequestTab")
    ),
    module: "two_factor_requests",
  },
  {
    path: "notifications",
    component: asyncComponent(() =>
      import("../Page/Notifications/notifications")
    ),
    module: "notifications",
  },
  {
    path: "wallet",
    component: asyncComponent(() => import("../Page/Wallet/walletDashboard")),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/faldax/:coin",
    component: asyncComponent(() => import("../Page/Wallet/faldax/wallet")),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/faldax-main-wallet/:coin",
    component: asyncComponent(() =>
      import("../Page/Wallet/faldax main/details")
    ),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/warm/:coin",
    component: asyncComponent(() => import("../Page/Wallet/warm/wallet")),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/hotsend/:coin",
    component: asyncComponent(() => import("../Page/Wallet/hot-send/wallet")),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/hotreceive/:coin",
    component: asyncComponent(() =>
      import("../Page/Wallet/hot-receive/wallet")
    ),
    module: "wallet_dashboard",
  },
  {
    path: "wallet/custodial/:coin",
    component: asyncComponent(() => import("../Page/Wallet/custodial/wallet")),
    module: "wallet_dashboard",
  },
  {
    path: "batch-and-balance",
    component: asyncComponent(() => import("../Page/Batch/batch")),
    module: "batch_and_balance",
  },
  // {
  //     path: "edit-asset",
  //     component: asyncComponent(() => import("../Page/Assets/editAsset")),
  //     module: "edit_asset"
  // },
  {
    path: "account-tier",
    component: asyncComponent(() => import("../Page/Tiers/tabs")),
    module: "tiers",
  },
  {
    path: "simplex-token",
    component: asyncComponent(() =>
      import("../Page/SimplexToken/simplexToken")
    ),
    module: "simplex_token",
  },
  // {
  //   path: "campaign",
  //   component: asyncComponent(() => import("../Page/Offers/offers")),
  //   module: "offers",
  // },
  // {
  //   path: "campaign/add-campaign",
  //   component: asyncComponent(() => import("../Page/Offers/addCampaign")),
  //   module: "offers",
  // },
  // {
  //   path: "campaign/update-campaign/:id",
  //   component: asyncComponent(() => import("../Page/Offers/addCampaign")),
  //   module: "offers",
  // },
  // {
  //   path: "campaign/:campaignId/offer-usage/:id",
  //   component: asyncComponent(() => import("../Page/Offers/offersUsage")),
  //   module: "offers",
  // },
  {
    path: "network-fee",
    component: asyncComponent(() => import("../Page/NetworkFee/networkFee")),
    module: "network_fee",
  },
  {
    path: "tradedesk/:pair",
    component: asyncComponent(() => import("../Page/TradeDesk/tradedesk")),
    module: "trade_desk_management",
  },
  {
    path: "tradedesk-monitoring",
    component: asyncComponent(() =>
      import("../Page/TradeMonitoring/trademonitoring")
    ),
    module: "trade_desk_monitoring",
  },
];

const mandatoryRoutes = [
  {
    path: "",
    component: asyncComponent(() => import("../Page/Dashboard/tabs")),
  },
  // {
  //     path: "dashboard",
  //     component: asyncComponent(() => import("../Page/Dashboard/tabs"))
  // },
  {
    path: "change-password",
    component: asyncComponent(() => import("../Page/changePassword")),
  },
  {
    path: "edit-profile",
    component: asyncComponent(() => import("../Page/editProfile")),
  },
  {
    path: "users/history/:id",
    component: asyncComponent(() => import("../Page/Users/loginHistory")),
  },
  {
    path: "users/sell-orders/:id",
    component: asyncComponent(() => import("../Page/Orders/sellOrders")),
  },
  {
    path: "users/buy-orders/:id",
    component: asyncComponent(() => import("../Page/Orders/buyOrders")),
  },
  {
    path: "users/trade-history/:id",
    component: asyncComponent(() => import("../Page/Users/userTrades")),
  },
  {
    path: "countries/:id/states",
    component: asyncComponent(() => import("../Page/Country/StateList")),
  },
  {
    path: "jobs/job-applications/:id",
    component: asyncComponent(() => import("../Page/Jobs/jobApplications")),
  },
  {
    path: "users/edit-user/:id",
    component: asyncComponent(() => import("../Page/Users/editUser")),
  },
  {
    path: "users/:id",
    component: asyncComponent(() => import("../Page/Users/viewUser")),
  },
  // {
  //   path: "campaign/:id",
  //   component: asyncComponent(() => import("../Page/Offers/viewCampaign")),
  // },
  {
    path: "employee/:id",
    component: asyncComponent(() => import("../Page/Employee/employeeProfile")),
  },
  {
    path: "referral/:id",
    component: asyncComponent(() => import("../Page/Referral/referredAmount")),
  },
  {
    path: "referral/:id/:coin_code",
    component: asyncComponent(() =>
      import("../Page/Referral/details/referralDetails")
    ),
  },
  {
    path: "assets/edit-asset/:id",
    component: asyncComponent(() => import("../Page/Assets/editAsset")),
  },
  {
    path: "assets/wallet/:id",
    component: asyncComponent(() => import("../Page/Assets/assetWallet")),
  },
  {
    path: "email-templates/edit-template/:id",
    component: asyncComponent(() =>
      import("../Page/EmailTemplates/updateEmailTemplate")
    ),
  },
  {
    path: "sms-templates/edit-sms-template/:id",
    component: asyncComponent(() =>
      import("../Page/SmsTemplates/updateSmsTemplate")
    ),
  },
  {
    path: "batch-and-balance/:id",
    component: asyncComponent(() => import("../Page/Batch/batchDetails")),
  },
  {
    path: "account-tier/:id",
    component: asyncComponent(() => import("../Page/Tiers/editTier")),
  },
  {
    path: "roles/access-grant/:id",
    component: asyncComponent(() => import("../Page/Roles/access-grant")),
  },
];

class AppRouter extends Component {
  render() {
    const { url, style, roles } = this.props;
    let rolesArray = [];
    for (let key in roles.roles) {
      rolesArray.push({ module: key, value: roles.roles[key] });
    }

    return (
      <div style={style}>
        <Switch>
          {
            // rolesArray.map((role) => (
            routes.map((singleRoute) => {
              const { path, exact, ...otherProps } = singleRoute;
              // if ((role.module == singleRoute.module) && role.value == true) {
              return (
                <Route
                  exact={true}
                  key={singleRoute.path}
                  path={`${url}/${singleRoute.path}`}
                  {...otherProps}
                />
              );
              // }
            })
            // ))
          }
          {mandatoryRoutes.map((singleRoute) => {
            const { path, exact, ...otherProps } = singleRoute;
            return (
              <Route
                exact={true}
                key={singleRoute.path}
                path={`${url}/${singleRoute.path}`}
                {...otherProps}
              />
            );
          })}
          <Redirect to={`/404`} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(
  connect((state) => ({
    isLoggedIn: state.Auth.get("token") !== null ? false : true,
    user: state.Auth.get("user"),
    roles: state.Auth.get("roles"),
  }))(AppRouter)
);
