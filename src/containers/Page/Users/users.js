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
import Metabase from './metabase';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
const { TabPane } = Tabs;
const { logout } = authAction;
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metabaseUrl: ""
    }
  }
  componentDidMount() {
    if (!isAllowed("add_user") && !isAllowed("get_users") && !isAllowed("get_inactive_users") && !isAllowed("get_deleted_users")) {
      this.props.logout();
    }
  }

  render() {
    const {
      metabaseUrl
    } = this.state;
    let tabOptionalProps={}
    if(this.props.location.state && this.props.location.state.selectedTab){
      tabOptionalProps.defaultActiveKey=this.props.location.state.selectedTab;
    }
    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <BreadcrumbComponent {...this.props}/>  
        <div className="txt-align-right full-width">
          {isAllowed("add_user") &&
            <Button
              icon="plus"
              onClick={() => this.props.history.push("/dashboard/users/add-user")}
              type="primary"
            >
              Add User
          </Button>
          }
        </div>
        <Tabs {...tabOptionalProps} className="float-clear full-width" onChange={this.onChangeTabs}>
          {isAllowed("get_users") &&
            <TabPane tab="Active Users" key="1"><ActiveUsers /></TabPane>
          }
          {isAllowed("get_inactive_users") &&
            <TabPane tab="Inactive Users" key="2"><InActiveUsers /></TabPane>
          }
          {isAllowed("get_deleted_users") &&
            <TabPane tab="Deactivated Users" key="3"><DeletedUsers /></TabPane>
          }
         {isAllowed('metabase_users_report') && <TabPane tab="Report" key="metabase">
              <Metabase/>
          </TabPane>
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