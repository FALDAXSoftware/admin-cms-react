import React, { Component } from 'react';
import { Tabs, Button, Col } from 'antd';
import ActiveUsers from './activeUsers';
import InActiveUsers from './inActiveUsers';
import DeletedUsers from "./deletedUsers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isAllowed } from '../../../helpers/accessControl';
import authAction from "../../../redux/auth/actions";
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import ApiUtils from "../../../helpers/apiUtills";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { BackButton } from '../../Shared/backBttton';
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
    debugger
    if (!isAllowed("add_user") && !isAllowed("get_users") && !isAllowed("get_inactive_users") && !isAllowed("get_deleted_users")) {
      this.props.logout();
    }
  }

  async getMetaBaseUrl() {
    try {
      this.setState({ loader: true })
      let response = await (await ApiUtils.metabase(this.props.token).getUsersRequest()).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL })
      } else if (response.statue == 400 || response.status == 403) {

      }
    } catch (error) {

    } finally {
      this.setState({ loader: false })
    }
  }


  onChangeTabs = (key) => {
    if (key == "metabase" && this.state.metabaseUrl == "") {
      this.getMetaBaseUrl();
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
        <BackButton {...this.props}/>
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
            <TableDemoStyle className="isoLayoutContent">
              {metabaseUrl &&
                  <iframe
                    className="metabase-iframe"
                    src={metabaseUrl}
                    frameBorder="0"
                    width="100%"
                    allowtransparency="true"
                  ></iframe>
              }
            </TableDemoStyle>
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