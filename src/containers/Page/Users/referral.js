import React, { Component } from 'react';
import { Button, Input, notification, Spin, Icon } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class Referral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            errors: {},
            loader: false,
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getReferralDetails()
    }

    _getReferralDetails = () => {

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
        let fields = this.state.fields;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                percentage: fields['percentage'],
                days: fields['days'],
            }

            ApiUtils.editContact(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        _this.setState({
                            errMsg: true, errMessage: 'Details updated successfully.',
                            loader: false, errType: 'Success'
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

    render() {
        const { user_id } = this.props;
        const { errMsg, errType, fields, loader } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Referral Percentage</b>
                    </span>
                    <Input addonAfter={'%'} placeholder="Referral Percentage" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "percentage")} value={fields["percentage"]} />
                    <span className="field-error">
                        {this.validator.message('percentage', fields['percentage'], 'required')}
                    </span>

                    <span>
                        <b>Referral Days</b>
                    </span>
                    <Input addonAfter={'%'} placeholder="Referral Days" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "days")} value={fields["days"]} />
                    <span className="field-error">
                        {this.validator.message('days', fields['days'], 'required')}
                    </span>
                    <Button type="primary" onClick={this._updateReferral}> Update </Button>
                </div>
                {loader && <Spin indicator={loaderIcon} />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
    }))(Referral);
