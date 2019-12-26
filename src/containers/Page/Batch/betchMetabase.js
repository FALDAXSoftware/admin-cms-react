import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { withRouter} from "react-router-dom";
import { connect} from 'react-redux';
import { notification } from 'antd';

class BatchMetabase extends Component {
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
        await ApiUtils.metabase(this.props.token).getBatchMetabaseUrl()
      ).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL });
      } else if (response.state == 400 || response.status == 403) {
        this.openNotificationWithIconError("Error", response.message);
        this.props.logout();
      }
    } catch (error) {
      console.error("error", error);
    }
  }
  render() {
    let { metabaseUrl } = this.state;
    return (
      <React.Fragment>
        {metabaseUrl && (
          <div class="full-width">
            <iframe
              className="metabase-iframe"
              src={metabaseUrl}
              frameborder="0"
              width="100%"
              allowtransparency
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
    }), { ...authAction })(BatchMetabase));