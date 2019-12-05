import React, { Component } from "react";
import { Tabs, Button } from "antd";
import ActiveUsers from "./activeUsers";
import InActiveUsers from "./inActiveUsers";
import DeletedUsers from "./deletedUsers";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";

const { TabPane } = Tabs;

class Users extends Component {
  render() {
    return (
      <LayoutWrapper>
        <div className="full-width">
          <Button
           className="float-right"
            icon="plus"
            onClick={() => this.props.history.push("/dashboard/users/add-user")}
            type="primary"
          >
            Add User
          </Button>
        </div>
        <Tabs className="float-clear" defaultActiveKey="1" size={"large"}>
          <TabPane tab="Active Users" key="1">
            <ActiveUsers />
          </TabPane>
          <TabPane tab="In-Active Users" key="2">
            <InActiveUsers />
          </TabPane>
          <TabPane tab="Deactivated Users" key="3">
            <DeletedUsers />
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default Users;
