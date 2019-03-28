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
            userDetails: [],
            fields: {},
            errors: {},
            loader: false,
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator();
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
                let fields = _this.state.fields;
                fields["percentage"] = res.data[0].referal_percentage;
                _this.setState({ userDetails: res.data[0], fields });
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
                referal_percentage: fields['percentage'],
                user_id: user_id,
                email: userDetails.email
                //days: fields['days'],
            }

            ApiUtils.updateReferral(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        _this.setState({
                            errMsg: true, errMessage: res.message,
                            loader: false, errType: 'Success'
                        }, () => {
                            _this._getUserDetails();
                        })
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
                        {this.validator.message('percentage', fields['percentage'], 'required|numeric')}
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
                </div>
                {loader && <span className="loader-class"><Spin /></span>}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user'),
    }))(Referral);
