import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Button ,DatePicker} from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import moment from 'moment';
const { logout } = authAction;
class AddIPModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddIPModal: this.props.showAddIPModal,
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            showIPError: false,
            endDate:""
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({ showAddIPModal: nextProps.showAddIPModal });
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
        this.setState({ showAddIPModal: false, showIPError: false ,endDate:''})
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
        fields['time'] = '';
        this.setState({ fields,endDate:""});
    }

    _addIPAddress = () => {
        const { token, getAllWhitelistIP, emp_id } = this.props;
        let { fields, showIPError } = this.state;
        let _this = this;

        if (this.validator.allValid() && !showIPError) {
            _this.setState({ loader: true, isDisabled: true });
            let formData = {
                ip: fields["ip"],
                days: fields["time"],
                user_type: 2,
                user_id: emp_id
            };

            ApiUtils.addEmpWhitelistIP(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        _this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        }, () => {
                            getAllWhitelistIP();
                            _this._resetAddForm();
                        })
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true,errType: 'error',errMessage: res.message, loader: false });
                    }
                    _this._closeAddIPModal();
                })
                .catch(() => {
                    _this._resetAddForm();
                    _this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error'
                    });
                });
        } else {
            _this.validator.showMessages();
            _this.forceUpdate();
        }
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current < moment().startOf('day');
      }

    onChangeDate=(date)=>{
        const {fields}=this.state;
        fields["time"]=moment(date).endOf('day').diff(moment().startOf('day'), 'days');
        fields["time"]=parseInt(fields["time"])+1;
        this.setState({fields,endDate:date});
    
    }

    render() {
        const { loader, showAddIPModal, fields, errMsg, errType, showIPError,endDate } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          <Modal
            title="Add IP Address"
            visible={showAddIPModal}
            confirmLoading={loader}
            onCancel={this._closeAddIPModal}
            footer={[
              <Button onClick={this._closeAddIPModal}>Cancel</Button>,
              <Button onClick={this._addIPAddress}>Add</Button>
            ]}
          >
            <div style={{ marginBottom: "15px" }}>
              <span>IP Address:</span>
              <Input
                placeholder="192.168.0.0"
                onChange={this._handleChange.bind(this, "ip")}
                value={fields["ip"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "ip",
                  fields["ip"],
                  "required|max:50",
                  "text-danger"
                )}
                {showIPError && <span>The IP Address is not valid.</span>}
              </span>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <span>End Date:</span>
              <DatePicker
              style={{width:"100%"}}
              disabledDate={this.disabledDate}
              value={endDate}
              format="YYYY-MM-DD"
              showTime={false}
              allowClear={false}
              onChange={this.onChangeDate}
            />
            <span style={{fontStyle: 'italic'}}>* {fields['time']} Days</span>
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "time",
                  fields["time"],
                  "required",
                  "text-danger"
                )}
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
    }), { logout })(AddIPModal);
