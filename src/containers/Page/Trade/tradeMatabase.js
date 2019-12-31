import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { withRouter} from "react-router-dom";
import { connect} from 'react-redux';
import { notification } from 'antd';
import FaldaxLoader from '../faldaxLoader';

class Metabase extends Component {
  constructor(props){
    super(props);
    this.state = {
      metabaseUrl: "",
      loader:false
    };
    this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})}
  }

  

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
      this.loader.show();
      let response = await (
        await ApiUtils.metabase(this.props.token).getHistoryMetabaseUrl()
      ).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL });
      } else if(response.status==400 || response.status==403){
        this.openNotificationWithIconError("Error", response.message);
        this.loader.hide();
        this.props.logout();
      }
    } catch (error) {
      this.loader.hide();
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
              onLoad={()=>{this.loader.hide()}}
              allowtransparency="true"
            ></iframe>
          </div>
        )}
        {this.state.loader && <FaldaxLoader/>}
      </React.Fragment>
    );
  }
}
 
export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { ...authAction })(Metabase));