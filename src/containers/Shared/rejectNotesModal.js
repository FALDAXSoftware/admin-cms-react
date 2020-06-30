import React, { Component } from 'react';
import { Modal, Button } from 'antd';
    import SimpleReactValidator from 'simple-react-validator';
import TextArea from 'antd/lib/input/TextArea';
class rejectNotesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:this.props.visible,
            public_note:"",
            private_note:""
        };
        this.validator = new SimpleReactValidator();
    }
    componentWillReceiveProps(newProps){
      if(newProps.visible!==this.state.visible){
          this.setState({visible:newProps.visible});
      }
    }

    onCancel=()=>{
        this.validator.hideMessages();
        this.setState({visible:false});
        this.props.setVisible(false)
    }
    onRejectRequestSubmit=()=>{
        if(this.validator.allValid()){
            this.props.callback(this.state.private_note,this.state.public_note)
        }else{
            this.validator.showMessages();
            this.forceUpdate();
        }
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
              <fieldset>
                <label><b>Private Note</b></label>
                <TextArea
                placeholder="Write here.."
                autoSize={{ minRows: 2, maxRows: 6 }}
                name="private_note"
                onChange={this.onChange}
                />
                <span style={{ color: "red" }}>
                        {this.validator.message('Private Note', this.state.private_note, 'required')}
                </span>
            </fieldset> 
  
            
            <fieldset className="mt-8">
            <label><b>Public Note</b></label>
          <TextArea
          
            placeholder="Write here"
            name="public_note"
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={this.onChange}
          />
           <span style={{ color: "red" }}>
          {this.validator.message('Public Note', this.state.public_note, 'required')}
           </span>
           </fieldset>
          </Modal>
        );
    }
}

export default rejectNotesModal;