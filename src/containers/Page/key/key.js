import React, { Component } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Button, notification } from 'antd';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import aesjs from "aes-js"
import SimpleReactValidator from 'simple-react-validator';
import { BackButton } from '../../Shared/backBttton';

class Keys extends Component {
    constructor(props){
        super(props)
        this.state={
            plainText:"",
            cypherText:"",
            key:"",
            iv:"",
            loader:false
        }
        this.validator = new SimpleReactValidator();
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})}
    }

    encryptText=async()=>{
        try{
            if(this.validator.allValid()){
                this.loader.show();
                let {plainText,key,iv}=this.state;
                // Convert text to bytes (must be a multiple of the segment size you choose below)
                var textBytes = aesjs.utils.utf8.toBytes(plainText);
                let keyArray = key.split(",").map(element=>parseInt(element))
                let ivArray = iv.split(",").map(element=>parseInt(element))
                var aesOfb = new aesjs.ModeOfOperation.ofb(keyArray, ivArray);
                var encryptedBytes = aesOfb.encrypt(textBytes);
                // To print or store the binary data, you may convert it to hex
                var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
                this.setState({cypherText:encryptedHex})
            }else{
                this.validator.showMessages();
                this.forceUpdate()
            }
        }catch(error){
            notification.error({
                message: "Error",
                description: "Something went to wrong"
              });
        }finally{
            this.loader.hide();
        }
    }

    render() { 
        let {plainText,cypherText,loader,iv,key}=this.state;
        return (<>
        <LayoutWrapper className="full-width ">
            <BackButton {...this.props}></BackButton>
            <TableDemoStyle className="isoLayoutContent full-width">
                <div>
                  <span>
                    <b>Plain Text</b>
                  </span>
                </div>
                <TextArea  className="cypher-text-container" onChange={(value)=>this.setState({plainText:value.target.value})} placeholder="Enter plain text" value={plainText}></TextArea> 
                <span className="field-error">
                    {this.validator.message(
                        "Plain text",
                        plainText,
                        "required"
                    )}
                </span>
                <div>
                  <span>
                    <b>Key</b>
                  </span>
                </div>
                <TextArea className="cypher-text-container" onChange={(value)=>this.setState({key:value.target.value})} placeholder="Enter key" value={key}></TextArea>  
                <span className="field-error">
                    {this.validator.message(
                        "Secrete key",
                        key,
                        "required"
                    )}
                </span>
                <div>
                  <span>
                    <b>Initial Vector</b>
                  </span>
                </div>
                <TextArea className="cypher-text-container" onChange={(value)=>this.setState({iv:value.target.value})} placeholder="Enter initial vector" value={iv}></TextArea>   
                <span className="field-error">
                    {this.validator.message(
                        "Initial vector",
                        iv,
                        "required"
                    )}
                </span>
                {cypherText &&
                    <>
                        <div>
                            <p><b>Cypher Text :</b></p>
                        </div> 
                        <div className="cypher-text-container"> 
                            <span className="cypher-text">&nbsp;&nbsp;{cypherText}</span>
                        </div>
                    </>
                }
                <Button icon="key" className="mg-top-15" onClick={this.encryptText}type="primary">Encrypt Key</Button>
            </TableDemoStyle>
        </LayoutWrapper>
        {loader &&<FaldaxLoader/>}
        </>);
    }
}
 
export default connect(state => ({
    token: state.Auth.get("token")
  }),
  { ...authAction })(Keys);



  