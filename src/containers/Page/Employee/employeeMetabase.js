import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { withRouter} from "react-router-dom";
import { connect} from 'react-redux';
import { notification } from 'antd';

class EmployeeMetabase extends Component {
  state = {
    metabaseUrl: ""
  };

  componentDidMount() {
    this.getIframeUrl();
  }

  openNotificationWithIconError(type, message) {
    notification[type.toLowerCase()]({
      message: type,
      description: message
    });
  }

  async getIframeUrl() {
    try {
      let response = await (
        await ApiUtils.metabase(this.props.token).getEmployeeMetabaseUrl()
      ).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL });
      } else if(response.status==400 || response.status==403) {
        this.openNotificationWithIconError("Error", response.message);
        this.props.logout();
      }
    } catch (error) {
      this.openNotificationWithIconError(
        "Error",
        "Something went to wrong please try again later"
      );
    }
  }
  
  render() {
    let { metabaseUrl } = this.state;
    return (
      <React.Fragment>
        {metabaseUrl && (
          <div className="full-width">
            <iframe
              className="metabase-iframe"
              src={metabaseUrl}
              frameBorder="0"
              width="100%"
              allowtransparency="true"
            ></iframe>
          </div>
        )}
      </React.Fragment>
    );
  }
}
 
export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { ...authAction })(EmployeeMetabase));