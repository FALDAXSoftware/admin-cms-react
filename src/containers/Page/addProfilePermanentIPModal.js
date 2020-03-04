import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../helpers/apiUtills';
import { Modal, Input, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../redux/auth/actions';
import FaldaxLoader from './faldaxLoader';

const { logout } = authAction;

class AddProfileIPModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddProfilePermanentIPModal: this.props.showAddProfilePermanentIPModal,
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            showIPError: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddProfilePermanentIPModal: nextProps.showAddProfilePermanentIPModal });
            this.validator = new SimpleReactValidator();
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeAddIPModal = () => {
        // this.setState({ showAddProfilePermanentIPModal: false })
        this.props.closeAddModal();
        this._resetAddForm()
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
            if (field == 'ip') {
                this.checkIP(e.target.value);
            }
        }
        this.setState({ fields });
    }

    checkIP = (ip) => {
        var x = ip.split("."), x1, x2, x3, x4;

        if (x.length == 4) {
            x1 = parseInt(x[0], 10);
            x2 = parseInt(x[1], 10);
            x3 = parseInt(x[2], 10);
            x4 = parseInt(x[3], 10);

            if (isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(x4)) {
                return false;
            }

            if ((x1 >= 0 && x1 <= 255) && (x2 >= 0 && x2 <= 255) && (x3 >= 0 && x3 <= 255) && (x4 >= 0 && x4 <= 255)) {
                this.setState({ showIPError: false })
                return true;
            }
        }
        this.setState({ showIPError: true })
        return false;
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['ip'] = '';
        this.setState({ fields });
    }

    handleClose=()=>{
        this.setState({ showAddProfilePermanentIPModal: false })
        this._resetAddForm()
    }

    _closeAddIPModal = () => {
        this.setState({ showAddProfilePermanentIPModal: false })
        this.props.closeAddPermanentModal();
        this._resetAddForm()
    }

    _addPermanentIPAddress = async() => {
        const { token, getAllWhitelistIP ,enableWhitelistIp,closeAddPermanentModal} = this.props;
        let { fields, showIPError } = this.state;

        if (this.validator.allValid() && !showIPError) {
            this.setState({ loader: true });
            let formData = {
                ip: fields["ip"],
                is_permanent: true
            };
            try {
              await enableWhitelistIp(true);
              let res = await (
                await ApiUtils.addProfileWhitelistIP(token, formData)
              ).json();
              if (res.status == 200) {
                this.setState(
                  {
                    errMsg: true,
                    errMessage: res.message,
                    loader: false,
                    errType: "Success"
                  },
                  () => {
                    getAllWhitelistIP();
                    this._resetAddForm();
                    closeAddPermanentModal();
                    
                  }
                );
              } else if (res.status == 403) {
                this.setState(
                  { errMsg: true, errMessage: res.err, errType: "error" },
                  () => {
                    this.props.logout();
                  }
                );
              } else {
                this.setState({
                  errMsg: true,
                  errMessage: res.message,
                  loader: false,
                  errType: "error"
                });
              }
              this._closeAddIPModal();
            } catch (error) {
              this._resetAddForm();
              this.setState({
                errMsg: true,
                errMessage: "Unable to complete the requested action.",
                loader: false,
                errType: "error"
              });
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showAddProfilePermanentIPModal, fields, errMsg, errType, showIPError } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Add Permanent IP Address"
                visible={showAddProfilePermanentIPModal}
                confirmLoading={loader}
                closable={false}
                onCancel={this.handleClose}
                footer={[
                    <Button onClick={this._addPermanentIPAddress}>Add</Button>,
                    <Button onClick={this.handleClose}>Cancel</Button>
                ]}
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>
                        <b>NOTE:</b>
                    </span>
                    <span>
                        Please note that you're about to add permanent IP address which will be whitelisted to access the system.
                        After this,You'll be able to add temporary addresses.
                    </span>
                </div>
                <div style={{ "marginBottom": "15px" }}>
                    <span>IP Address:</span>
                    <Input placeholder="192.168.0.0" onChange={this._handleChange.bind(this, "ip")} value={fields["ip"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('ip', fields["ip"], 'required|max:50', 'text-danger')}
                        {showIPError && <span>The IP Address is not valid.</span>}
                    </span>
                </div>
                {loader && <FaldaxLoader />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddProfileIPModal);
