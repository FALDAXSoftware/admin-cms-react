import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
// import TierComponent from './tiers'
// import TierRequest from './tierRequests'
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import ApiUtils from '../../../helpers/apiUtills';
import SimpleReactValidator from 'simple-react-validator';
import TierDocument from './tierDocument';
// import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class TierDocsTabs extends Component {
    constructor(props){
        super(props)
        this.state = { 
            loader:false,
            tierDocsUrlList:[],
            filteredDocsList:[]
        }    
        this.loader={
            show:()=>this.setState({loader:true}),
            hide:()=>this.setState({loader:false})
        }
    }
    async componentDidMount(){
        try{
            this.loader.show();
            let {token,logout}=this.props;
            let res=await(await ApiUtils.getTierDocuments(token)).json();
            let {status,data}=res,fields={};
            if(status==200){
                this.setState({tierDocsUrlList:data,fields,filteredDocsList:data.filter((ele)=>ele.type=="static_form_tier_3")})
            }else if(status==400 || status==403){
                this.showNotification("error",res.err)
                logout();
            }else{
                this.showNotification("error",res.message)
            }
       }catch(error){
           console.error(error);
       }finally{
           this.loader.hide();
       }
    }
    
    showNotification(type,description){
        notification[type]({
            message:type,
            description:description
        });
   }
   onChangeTab=(activeKey)=>{
       switch(activeKey){
           case "5":
               this.setState({filteredDocsList:(this.state.tierDocsUrlList.filter((ele)=>ele.type=="static_form_tier_4"))})
                break;
            case "3":
                this.setState({filteredDocsList:(this.state.tierDocsUrlList.filter((ele)=>ele.type=="static_form_tier_3"))})
                break;
            default:
                
       }
   }

    render() { 
        return (
                <>
                <Tabs className="full-width" onChange={this.onChangeTab}>
                  <TabPane tab="Tier 3" key="3"><TierDocument data={this.state.filteredDocsList}/></TabPane>
                  <TabPane tab="Tier 4" key="5"><TierDocument data={this.state.filteredDocsList}/></TabPane>
                </Tabs>
                {this.state.loader &&<FaldaxLoader></FaldaxLoader>}
                </>
        );
    }
}
 
export default  withRouter(connect(state => ({
    token: state.Auth.get("token")
  }),
  { ...authAction })(TierDocsTabs));