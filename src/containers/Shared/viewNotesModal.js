import React, { Component } from 'react';
import { Modal, Button } from 'antd';
class ViewNotesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:this.props.visible,
            public_note:"",
            private_note:""
        };
    }
    componentWillReceiveProps(newProps){
      if(newProps.public_note!==this.state.public_note){
          this.setState({public_note:newProps.public_note,private_note:newProps.private_note});
      }
      if(newProps.visible!==this.state.visible){

        this.setState({visible:newProps.visible})
      }
    }
    onCancel=()=>{
        this.setState({visible:false});
        this.props.setVisible(false)
    }
    onRejectRequestSubmit=()=>{
        this.props.callback(this.state.private_note,this.state.public_note)
    }

    onChange=({target})=>{
        if(target.name=="public_note"){
            this.setState({public_note:target.value})
        }else{
            this.setState({private_note:target.value})
        }
    }

    render() {
        return (
            <Modal
            title="Notes"
            visible={this.state.visible}
            onCancel={this.onCancel}
            key={this.state.private_note}
            footer={[
            <Button onClick={this.onCancel}>close</Button>,
            ]}
          >
           <p><b>Public Note</b> : &nbsp;{this.state.public_note}</p>
           {this.state.private_note &&<p><b>Private Note</b> : &nbsp;{this.state.private_note}</p>}
          </Modal>
        );
    }
}

export default ViewNotesModal;