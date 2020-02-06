import React from "react";
import { Tabs, Pagination, Input, Button, notification } from 'antd';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from "../../../helpers/apiUtills";
import { isAllowed } from "../../../helpers/accessControl";
const { logout } = authAction;

class ReferralPercentage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchReferral: '',
            fields: {},
            prevDefaultReferral: '',
            errType: 'Success'
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
            },
            gtzero: {
                // name the rule
                message: "Amount must be greater than 0.",
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true // optional
            }
        });
    }
    componentDidMount = () => {
        this._getReferalPercentage();
        // this._getContactDetails();
    }
    _getReferalPercentage = () => {
        let _this = this;
        const { token } = this.props

        _this.setState({ loader: true });
        ApiUtils.getReferPercentage(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let fields = _this.state.fields;
                    fields['percentage'] = res.data.value;
                    _this.setState({ fields, prevDefaultReferral: res.data.value });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({ errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error' });
            })
    }
    _onChangeFields(field, e) {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    _updateDefaultReferral = () => {
        const { token } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                percentage: fields['percentage'],
            }

            ApiUtils.updateReferral(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        }, () => {
                        })
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
                    }
                })
                .catch(() => {
                    _this.setState({ loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _cancelDefaultReferral = () => {
        let fields = this.state.fields;
        fields['percentage'] = this.state.prevDefaultReferral;
        this.setState({ fields });
    }
    render() {
        const { loader, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }
        return (
            <div style={{ "marginTop": "10px", "marginLeft": "200px" }}>
                {loader && <FaldaxLoader />}

                <span>
                    <b>Default Referral Percentage</b>
                </span>
                <Input addonAfter={'%'} placeholder="Referral Percentage" style={{ "marginTop": "15px", "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                    onChange={this._onChangeFields.bind(this, "percentage")} value={fields["percentage"]} />
                <span className="field-error">
                    {this.validator.message('percentage', fields['percentage'], 'required|custom_between:0,100|max:10|gtzero')}
                </span>
                {isAllowed("update_user_referal") &&
                    <div>
                        <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._updateDefaultReferral}> Update </Button>
                        <Button type="primary" className="cancel-btn" onClick={this._cancelDefaultReferral}> Cancel </Button>
                    </div>
                }
            </div>
        )
    }
}



export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }), { logout })(ReferralPercentage);