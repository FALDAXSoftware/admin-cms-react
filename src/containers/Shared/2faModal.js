import { Input, Button, Modal } from "antd";
import React,{Component} from 'react';
import SimpleReactValidator from 'simple-react-validator';
import {Link} from 'react-router-dom'
class TwoFactorModal extends Component
{
  constructor(props){
    super(props)
    this.state={fields:{
      otp:""
    }}
    this.validator = new SimpleReactValidator();
  }  
  close=(e)=>{
    this.props.onClose();
  };
  onSubmit=(otp)=>{
    if(this.validator.allValid()){
      this.props.callback(otp);
    }else{
      this.validator.showMessages();
      this.forceUpdate();
    }
  };
    render(){
      let {fields}=this.state;
     return (
      <>
      <Modal visible={true} title={this.props.title} footer={null} onOk={this.close}
      onCancel={this.close}>
        <div>
          <span>Enter your 2FA code here:</span>
          <div style={{ marginTop: "20px" }}>
            <Input
              style={{ width: "200px" }}
              value={fields["otp"]}
              onChange={(e)=>this.setState({fields:{"otp":e.target.value}})}
            />
          </div>
          <span className="field-error">
            {this.validator.message("OTP", fields["otp"],"required|numeric")}
          </span>
          <Button
            type="primary"
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={(e)=>this.onSubmit(fields["otp"])}
          >
            Submit
          </Button>
        </div>
      </Modal>
      </>
    );
      }
}

class TwoFactorEnableModal extends Component
{
  constructor(props){
    super(props)
  }  
  close=(e)=>{
    this.props.onClose();
  };
  render(){
     return (
      <>
      <Modal visible={true} title={this.props.title} onOk={this.close}
        onCancel={this.close}>
        <div>
          <Button type="primary"><Link to="./edit-profile">Enable your 2FA</Link></Button>
        </div>
      </Modal>
      </>
    );
  }
}

export {TwoFactorModal,TwoFactorEnableModal};