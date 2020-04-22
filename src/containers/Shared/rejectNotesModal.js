import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
class rejectNotesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:this.props.visible,
            public_note:"",
            private_note:""
        };
    }
    componentWillReceiveProps(newProps){
      if(newProps.visible!==this.state.visible){
          this.setState({visible:newProps.visible});
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
            footer={[
            <Button onClick={this.onCancel}>Cancel</Button>,
            <Button type="primary" onClick={this.onRejectRequestSubmit}>Submit</Button>
            ]}
          >
            <TextArea
            placeholder="Private Note"
            autoSize={{ minRows: 2, maxRows: 6 }}
            name="private_note"
            onChange={this.onChange}
          />
  
  
          <TextArea
          className="mt-8"
            placeholder="Public Note"
            name="public_note"
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={this.onChange}
          />
          </Modal>
        );
    }
}

export default rejectNotesModal;