import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import { connect } from 'react-redux';

const routes = [
    {
        path: "",
        component: asyncComponent(() => import("../Page/dashboard"))
    },
    {
        path: "dashboard",
        component: asyncComponent(() => import("../Page/dashboard"))
    },
    {
        path: "users",
        component: asyncComponent(() => import("../Page/Users/users"))
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
        path: "announce",
        component: asyncComponent(() => import("../Page/Announce/announce"))
    },
    {
        path: "coins",
        component: asyncComponent(() => import("../Page/Coins/coins"))
    },
    {
        path: "static-pages",
        component: asyncComponent(() => import("../Page/StaticPages/staticPages"))
    },
    {
        path: "countries",
        component: asyncComponent(() => import("../Page/Country/countries"))
    },
    {
        path: "roles",
        component: asyncComponent(() => import("../Page/Roles/roles"))
    },
    {
        path: "users/history/:id",
        component: asyncComponent(() => import("../Page/Users/loginHistory"))
    },
    {
        path: "country/:id/states",
        component: asyncComponent(() => import("../Page/Country/StateList"))
    },
    {
        path: "employee",
        component: asyncComponent(() => import("../Page/Employee/employee"))
    },
    {
        path: "blogs",
        component: asyncComponent(() => import("../Page/Blogs/blogs"))
    },
    {
        path: "pairs",
        component: asyncComponent(() => import("../Page/Pairs/pairs"))
    },
    {
        path: "send-coin-fee",
        component: asyncComponent(() => import("../Page/CoinFee/sendCoinFee"))
    },
    {
        path: "limit-management",
        component: asyncComponent(() => import("../Page/LimitManagement/limitManagement"))
    },
    {
        path: "transaction-history",
        component: asyncComponent(() => import("../Page/TransactionHistory/transactionHistory"))
    },
];

class AppRouter extends Component {
    render() {
        const { url, style } = this.props;

        return (
            <div style={style}>
                {routes.map(singleRoute => {
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
            </div>
        );
    }
}

export default withRouter(connect(state => ({
    isLoggedIn: state.Auth.get('token') !== null ? false : true,
    user: state.Auth.get('user'),
}))(AppRouter));
