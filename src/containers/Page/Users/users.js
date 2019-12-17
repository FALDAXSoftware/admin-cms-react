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
import styled from 'styled-components';
import ApiUtils from "../../../helpers/apiUtills";
import TableDemoStyle from "../../Tables/antTables/demo.style";
const { TabPane } = Tabs;
const { logout } = authAction;

const IframeCol = styled(Col)`
  width: 100%;
  > iframe {
    height: calc(100vh - 326px);
    min-height: 500px;
  }
`;

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
      console.log("Metabase is calling")
      this.getMetaBaseUrl();
    }
  }

  render() {
    const {
      metabaseUrl
    } = this.state;
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
        <Tabs className="float-clear" size={"large"} onChange={this.onChangeTabs}>
          {isAllowed("get_users") &&
            <TabPane tab="Active Users" key="1"><ActiveUsers /></TabPane>
          }
          {isAllowed("get_inactive_users") &&
            <TabPane tab="In-Active Users" key="2"><InActiveUsers /></TabPane>
          }
          {isAllowed("get_deleted_users") &&
            <TabPane tab="Deactivated Users" key="3"><DeletedUsers /></TabPane>
          }
         {isAllowed('metabase_users_report') && <TabPane tab="Report" key="metabase">
            <TableDemoStyle className="isoLayoutContent">
              {metabaseUrl &&
                <IframeCol>
                  <iframe
                    src={metabaseUrl}
                    frameborder="0"
                    width="100%"
                    allowtransparency
                  ></iframe>
                </IframeCol>}
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