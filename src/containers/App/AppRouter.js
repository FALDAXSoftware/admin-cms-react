import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import { connect } from 'react-redux';

const routes = [
  {
    path: "",
    component: asyncComponent(() => import("../Widgets/index.js"))
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
    path: "profile",
    component: asyncComponent(() => import("../Page/editProfile"))
  },
  {
    path: "referral",
    component: asyncComponent(() => import("../Page/referral"))
  },
  {
    path: "email-templates",
    component: asyncComponent(() => import("../Page/EmailTemplates/emailTemplates"))
  },
  {
    path: "coins",
    component: asyncComponent(() => import("../Page/Coins/coins"))
  },
  {
    path: "static-pages",
    component: asyncComponent(() => import("../Page/StaticPages/staticPages"))
  }
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
  isLoggedIn: state.Auth.get('token') !== null,
  user: state.Auth.get('user'),
}))(AppRouter));
