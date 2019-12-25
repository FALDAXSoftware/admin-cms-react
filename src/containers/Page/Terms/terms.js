import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { connect } from "react-redux";
import authAction from '../../../redux/auth/actions';
import { BackButton } from '../../Shared/backBttton';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Divider, Input,Button, Card, notification } from 'antd';
import Loader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../../helpers/apiUtills';

class TermsAndConditions extends Component {
   constructor(props){
       super(props);
       this.state={loader:false,policyUrlList:[]};
       this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})}
   }

   componentDidMount(){
       this.getPolicyUrl();
   }

   async getPolicyUrl(){
       try{
            this.loader.show();
            let {token,logout}=this.props;
            let res=await(await ApiUtils.getPolicyUrl(token)).json();
            let {status,data}=res,fields={};
            if(status==200){
                data.map((ele)=>{
                    this[ele.slug]=new SimpleReactValidator()
                    fields[ele.slug]="";
                    return ele;
                })
                this.setState({policyUrlList:data,fields})
            }else if(status==400 || status==403){
                this.showNotification("error",res.err)
                logout();
            }else{
                this.showNotification("error",res.message)
            }
       }catch(error){
           console.log(error);
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

   onSubmit=async(slug)=>{
       try{
           if(this[slug].allValid()){
            let formData=new FormData(),{fields}=this.state,{logout,token}=this.props;
            this.loader.show();
            formData.append("slug",slug);
            formData.append("pdf_file",fields[slug])
            let res=await(await ApiUtils.setPolicyDocs(token,formData)).json();
            if(res.status==200){
                this.showNotification("success",res.message)
            }else if(res.status==400 || res.status==403){
                this.showNotification("error",res.err)
                logout();
            }else{
                this.showNotification("error",res.message)
            }
           }else{
               this[slug.toLowerCase()].showMessages();
               this.forceUpdate();
           }
       }catch(error){
           console.log("Error in file uploading")
       }finally{
            this.loader.hide();
       }
   }

   onChangeImg=async(e,slug)=>{
    const { fields } = this.state;
    fields[slug]=e.target.files[0]
    this.setState(fields);
   }

    render() { 
        let {loader,fields,policyUrlList}=this.state;
        return (<>
            <LayoutWrapper>
                <BackButton {...this.props}/>
                <TableDemoStyle className="full-width">
                    <div>
                       { policyUrlList.map((ele,index)=>{
                         return  <>
                        <Divider className="title-case" key={index}>{ele.name}</Divider>
                        <Card key={index}>
                            <input type="file" onChange={(e)=>this.onChangeImg(e,ele.slug)} accept="application/pdf" name="Upload Privacy Doc"></input>
                            <Input key={index} className="cypher-text-container"  ref={ele.slug} disabled="true" value={"https://s3.us-east-2.amazonaws.com/"+ele.value} placeholder="Enter the url"/>
                            {this[ele.slug].message(ele.name,fields[ele.slug],"required","error-danger")}
                            <Button key={index} type="primary" onClick={()=>this.onSubmit(ele.slug)}>Submit</Button>
                        </Card></>
                        })
                    }
                    </div>
                </TableDemoStyle>
            </LayoutWrapper>
            {loader && <Loader/>}
        </>);
    }
}
 
export default connect(state => ({
    token: state.Auth.get("token")
  }),
  { ...authAction })(TermsAndConditions);