import React, { Component } from 'react';
import {Modal,Button} from 'antd'

class ConfirmDeleteModalComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            callbackFn:this.props.callbackFn,
            callbackData:this.props.callbackData,
            visible:this.props.visible
        }
    }

    onYesClick=()=>{
        this.state.callbackFn(this.state.callbackData);
    }

    componentWillReceiveProps(nextProp){
        if(this.state!=nextProp){
            this.setState(nextProp)
        }
    }
    closeModal=()=>{
        this.setState({visible:false})
    }
    render() { 
        let {visible}=this.state;
        return ( <Modal
            title="Delete"
            onCancel={this.closeModal}
            visible={visible}
            footer={[
              <Button onClick={this.closeModal}>
                No
              </Button>,
              <Button onClick={this.onYesClick}>Yes</Button>
            ]}
          >
            Are you sure you want to delete this ?
          </Modal> );
    }
}
 
export default ConfirmDeleteModalComponent;