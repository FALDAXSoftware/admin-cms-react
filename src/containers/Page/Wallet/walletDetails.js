import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from "../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";

class WalletDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={}
        this.loader={show:this.setState({loader:false}),hide:this.setState({loader:false})}
    }

    componentDidMount(){
        this.getWalletData();
    }

    getWalletData=async ()=>{
        try{
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(this.props.match.params.coin)).json();
            if(res.status==200){
                console.log(res)
            }
        }catch(error){
            console.log("error",error);
        }
    }
    render() { 
        return ( <p>data not found</p> );
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(WalletDetailsComponent))
 
