import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import { withRouter} from "react-router-dom";
import { connect} from 'react-redux';
class AssetsMetabase extends Component {
    constructor(props){
        super(props)
        this.state = { 
            metabaseUrl:""
         }
    }

    componentDidMount(){
        this.getIframeUrl();
    }

    async getIframeUrl(){
        try{
            let response=await(await ApiUtils.metabase(this.props.token).getAssetsMetabaseUrl()).json();
            if(response.status==200){
                this.setState({metabaseUrl:response.frameURL});
            }else{
                
            }
        }catch(error){
            console.error("error",error)
        }
    }
    render() { 
        let {metabaseUrl}=this.state;
        return (<React.Fragment>
                {metabaseUrl &&
                <div class="full-width">
                  <iframe
                    className="metabase-iframe"
                    src={metabaseUrl}
                    frameborder="0"
                    width="100%"
                    allowtransparency
                    ></iframe>
                </div>
                }
                </React.Fragment>
        );
    }
}
 
export default withRouter(connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { ...authAction })(AssetsMetabase));