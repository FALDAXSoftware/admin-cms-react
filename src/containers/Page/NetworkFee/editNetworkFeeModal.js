import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class EditNetworkFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      fields: this.props.fields,
      errMsg: false,
      errMessage: "",
      errType: "Success",
      showEditNetworkFeeModal: this.props.showEditNetworkFeeModal
    };
    this.validator = new SimpleReactValidator();
  }

  componentWillReceiveProps(nextProps) {
  this.state.showEditNetworkFeeModal=nextProps.showEditNetworkFeeModal;
  this.state.fields=nextProps.fields;
  }


  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };

  _resetForm = () => {
    const { fields } = this.state;

    fields["name"] = "";
    this.setState({ fields, showError: false });
  };

  onCloseModel = () => {
    this.setState({ showEditNetworkFeeModal: false });
    this.props.onCloseEditModal();
    this._resetForm();
  };

  onEditFees = async() => {
    const {token} = this.props;
    const {fields}=this.state;
    if (this.validator.allValid()) {
        try{
            let body={
                "slug":fields['slug'],
                "value":fields['value']
            }
            this.setState({loader:true})
            let res = await(await ApiUtils.updateNetworkFee(token,body)).json();
            if (res.status == 200) {
            this.onCloseModel();
               this.setState({
                    errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                })
            } else if (res.status == 403) {
               this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                   this.props.logout();
                });
            } else {
               this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
            }
        }catch(error){
            console.log(error)
            this.setState({loader:false})
        }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
    this.setState({ showError: false });
  };

  render() {
    const {
      loader,
      fields,
      errMsg,
      errType,
      showEditNetworkFeeModal
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    return (
      <div>
        <Modal
          title="Edit Network Fees"
          onCancel={this.onCloseModel}
          visible={showEditNetworkFeeModal}
          confirmLoading={loader}
          footer={[
            <Button onClick={this.onCloseModel}>Cancel</Button>,
            <Button onClick={this.onEditFees}>Update</Button>
          ]}
        >
          <div className="mg-top-15">
            <span>Name</span>
            <Input value={fields["name"]} disabled={true} />
          </div>
          <div className="mg-top-15">
            <span>Type</span>
            <Input value={fields["type"]} disabled={true} />
          </div>
          <div className="mg-top-15">
            <span>Value</span>
            <Input
                type="number"
              placeholder="Value"
              onChange={this._handleChange.bind(this, "value")}
              value={fields["value"]}
            />
            <span className="error-danger">
              {this.validator.message(
                "Value",
                fields["value"],
                "required|max:30",
                "text-danger"
              )}
            </span>
          </div>
          {loader && <FaldaxLoader />}
        </Modal>
      </div>
    );
  }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditNetworkFee);
