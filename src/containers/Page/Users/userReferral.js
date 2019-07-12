import React, { Component } from 'react';
import { Button, Input, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class Referral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userDetails: [],
            fields: {},
            errors: {},
            loader: false,
            errType: 'Success',
            prevReferral: ''
        }
        this.validator = new SimpleReactValidator({
            className: 'text-danger',
            custom_between: {
                message: 'The :attribute must be between 1 to 100 %.',
                rule: function (val, params, validator) {
                    if (isNaN(val)) {
                        return false;
                    } else if (parseFloat(val) >= parseFloat(params[0]) && parseFloat(val) <= parseFloat(params[1])) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
    }

    componentDidMount = () => {
        this._getUserDetails()
    }

    _getUserDetails = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getUserDetails(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let fields = _this.state.fields;
                    fields["percentage"] = res.data[0].referal_percentage;
                    _this.setState({ userDetails: res.data[0], fields, prevReferral: res.data[0].referal_percentage });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _onChangeFields(field, e) {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _updateReferral = () => {
        const { token, user_id } = this.props;
        const { userDetails } = this.state;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });
            const formData = {
                percentage: fields['percentage'],
                user_id: user_id,
                email: userDetails.email
                //days: fields['days'],
            }

            ApiUtils.updateReferral(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        if (res.status == 200) {
                            _this.setState({
                                errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                            }, () => {
                                _this._getUserDetails();
                            })
                        } else if (res.status == 403) {
                            _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                                _this.props.logout();
                            });
                        } else {
                            _this.setState({ errMsg: true, errMessage: res.message });
                        }
                        _this.setState({ loader: false });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
                    }
                }).catch(() => {
                    _this.setState({ loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _cancelReferral = () => {
        let _this = this;
        let fields = _this.state.fields;
        fields["percentage"] = _this.state.prevReferral;
        _this.setState({ fields }, () => {
            _this.validator = new SimpleReactValidator({
                className: 'text-danger',
                custom_between: {
                    message: 'The :attribute must be between 1 to 100 %.',
                    rule: function (val, params, validator) {
                        if (isNaN(val)) {
                            return false;
                        } else if (parseFloat(val) >= parseFloat(params[0]) && parseFloat(val) <= parseFloat(params[1])) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    required: true
                }
            });
        });
    }

    render() {
        const { errMsg, errType, fields, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <div style={{ "marginTop": "10px", "marginLeft": "200px" }}>
                    <span>
                        <b>Referral Percentage</b>
                    </span>
                    <Input addonAfter={'%'} placeholder="Referral Percentage" style={{ "marginTop": "15px", "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "percentage")} value={fields["percentage"]} />
                    <span className="field-error">
                        {this.validator.message('percentage', fields['percentage'], 'required|custom_between:0,100|max:10')}
                    </span>
                    {/* <span>
                        <b>Referral Days</b>
                    </span>
                    <Input addonAfter={'%'} placeholder="Referral Days" style={{ "marginTop": "15px", "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "days")} value={fields["days"]} />
                    <span className="field-error">
                        {this.validator.message('days', fields['days'], 'required')}
                    </span> */}
                    <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._updateReferral}> Update </Button>
                    <Button type="primary" className="cancel-btn" onClick={this._cancelReferral}> Cancel </Button>
                </div>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { logout })(Referral);
