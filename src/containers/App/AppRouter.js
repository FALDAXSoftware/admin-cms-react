import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import { connect } from 'react-redux';

const routes = [
    {
        path: "users",
        component: asyncComponent(() => import("../Page/Users/users")),
        module: "users"
    },
    {
        path: "assets",
        component: asyncComponent(() => import("../Page/Assets/assets")),
        module: "assets"
    },
    {
        path: "countries",
        component: asyncComponent(() => import("../Page/Country/countries")),
        module: "countries"
    },
    {
        path: "roles",
        component: asyncComponent(() => import("../Page/Roles/roles")),
        module: "roles"
    },
    {
        path: "employee",
        component: asyncComponent(() => import("../Page/Employee/employee")),
        module: "employee"
    },
    {
        path: "pairs",
        component: asyncComponent(() => import("../Page/Pairs/pairs")),
        module: "pairs"
    },
    {
        path: "send-coin-fee",
        component: asyncComponent(() => import("../Page/CoinFee/sendCoinFee")),
        module: "send_coin_fee"
    },
    {
        path: "limit-management",
        component: asyncComponent(() => import("../Page/LimitManagement/limitManagement")),
        module: "limit_management"
    },
    {
        path: "transaction-history",
        component: asyncComponent(() => import("../Page/TransactionHistory/transactionHistory")),
        module: "transaction_history"
    },
    {
        path: "trade-history",
        component: asyncComponent(() => import("../Page/Trade/tradeHistory")),
        module: "trade_history"
    },
    {
        path: "withdraw-requests",
        component: asyncComponent(() => import("../Page/WithdrawRequest/withdrawRequest")),
        module: "withdraw_requests"
    },
    {
        path: "jobs",
        component: asyncComponent(() => import("../Page/Jobs/jobs")),
        module: "jobs"
    },
    {
        path: "kyc",
        component: asyncComponent(() => import("../Page/KYC/kyc")),
        module: "kyc"
    },
    {
        path: "fees",
        component: asyncComponent(() => import("../Page/Fees/fees")),
        module: "fees"
    },
    {
        path: "panic-button",
        component: asyncComponent(() => import("../Page/panicButton")),
        module: "panic_button"
    },
    {
        path: "news",
        component: asyncComponent(() => import("../Page/News/news")),
        module: "news"
    },
    {
        path: "referral",
        component: asyncComponent(() => import("../Page/Referral/referral")),
        module: "is_referral"
    },
    {
        path: "users/add-user",
        component: asyncComponent(() => import("../Page/Users/addUser")),
        module: "add_user"
    },
    {
        path: "account-class",
        component: asyncComponent(() => import("../Page/AccountClass/accountClass")),
        module: "account_class"
    },
    // {
    //     path: "edit-asset",
    //     component: asyncComponent(() => import("../Page/Assets/editAsset")),
    //     module: "edit_asset"
    // },
];

const mandatoryRoutes = [
    {
        path: "",
        component: asyncComponent(() => import("../Page/dashboard"))
    },
    {
        path: "dashboard",
        component: asyncComponent(() => import("../Page/dashboard"))
    },
    {
        path: "change-password",
        component: asyncComponent(() => import("../Page/changePassword"))
    },
    {
        path: "edit-profile",
        component: asyncComponent(() => import("../Page/editProfile"))
    },
    {
        path: "users/history/:id",
        component: asyncComponent(() => import("../Page/Users/loginHistory"))
    },
    {
        path: "users/sell-orders/:id",
        component: asyncComponent(() => import("../Page/Orders/sellOrders"))
    },
    {
        path: "users/buy-orders/:id",
        component: asyncComponent(() => import("../Page/Orders/buyOrders"))
    },
    {
        path: "users/trade-history/:id",
        component: asyncComponent(() => import("../Page/Users/userTradeHistory"))
    },
    {
        path: "country/:id/states",
        component: asyncComponent(() => import("../Page/Country/StateList"))
    },
    {
        path: "job-applications/:id",
        component: asyncComponent(() => import("../Page/Jobs/jobApplications")),
    },
    {
        path: "users/edit-user/:id",
        component: asyncComponent(() => import("../Page/Users/editUser"))
    },
    {
        path: "users/:id",
        component: asyncComponent(() => import("../Page/Users/viewUser"))
    },
    {
        path: "employee/:id",
        component: asyncComponent(() => import("../Page/Employee/employeeProfile"))
    },
    {
        path: "referral/:id",
        component: asyncComponent(() => import("../Page/Referral/referredAmount"))
    },
    {
        path: "assets/edit-asset/:id",
        component: asyncComponent(() => import("../Page/Assets/editAsset"))
    },
]

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
                        rolesArray.map((role) => (
                            routes.map(singleRoute => {
                                const { path, exact, ...otherProps } = singleRoute;
                                if ((role.module == singleRoute.module) && role.value == true) {
                                    return (
                                        <Route
                                            exact={true}
                                            key={singleRoute.path}
                                            path={`${url}/${singleRoute.path}`}
                                            {...otherProps}
                                        />
                                    )
                                }
                            })
                        ))
                    }
                    {
                        mandatoryRoutes.map(singleRoute => {
                            const { path, exact, ...otherProps } = singleRoute;
                            return (
                                <Route
                                    exact={true}
                                    key={singleRoute.path}
                                    path={`${url}/${singleRoute.path}`}
                                    {...otherProps}
                                />
                            )
                        })
                    }
                    <Redirect to={`/404`} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(connect(state => ({
    isLoggedIn: state.Auth.get('token') !== null ? false : true,
    user: state.Auth.get('user'),
    roles: state.Auth.get('roles'),
}))(AppRouter));
