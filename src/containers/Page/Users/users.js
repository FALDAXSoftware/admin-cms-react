import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import ActiveUsers from './activeUsers';
import InActiveUsers from './inActiveUsers';
import DeletedUsers from "./deletedUsers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isAllowed } from '../../../helpers/accessControl';
import authAction from "../../../redux/auth/actions";
import LayoutWrapper from '../../../components/utility/layoutWrapper';
const { TabPane } = Tabs;
const { logout } = authAction;

class Users extends Component {
  componentDidMount() {
    if (!isAllowed("add_user") && !isAllowed("get_users") && !isAllowed("get_inactive_users") && !isAllowed("get_deleted_users")) {
      this.props.logout();
    }
  }

  render() {
    return (
      <LayoutWrapper>
        <div className="full-width">
          {isAllowed("add_user") &&

            <Button
              className="float-right"
              icon="plus"
              onClick={() => this.props.history.push("/dashboard/users/add-user")}
              type="primary"
            >
              Add User
          </Button>
          }
        </div>
        <Tabs className="float-clear" defaultActiveKey="1" size={"large"}>
          {isAllowed("get_users") &&
            <TabPane tab="Active Users" key="1"><ActiveUsers /></TabPane>
          }
          {isAllowed("get_inactive_users") &&
            <TabPane tab="In-Active Users" key="2"><InActiveUsers /></TabPane>
          }
          {isAllowed("get_deleted_users") &&
            <TabPane tab="Deactivated Users" key="3"><DeletedUsers /></TabPane>
          }
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(withRouter(Users));