import React, { Component } from 'react';
import { Button, Input, Spin, Icon, notification } from 'antd';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class ContactUsForm extends Component {
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
        this._getContactDetails();
    }

    _getContactDetails = () => {
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getContactDetails()
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ fields: res.data });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
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

    _editProfile = () => {
        const { token } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                press: fields['press'],
                fb_profile: fields['fb_profile'],
                twitter_profile: fields['twitter_profile'],
                google_profile: fields['google_profile'],
                linkedin_profile: fields['linkedin_profile'],
                media_name: fields['media_name'],
                media_email: fields['media_email'],
                phone: fields['phone'],
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
        const { loader, fields, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div style={{ "paddingLeft": "50px", "paddingTop": "50px" }}>
                <h2>
                    <b> Contact US </b>
                </h2>

                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Press</b>
                    </span>
                    <Input placeholder="Press" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "press")} value={fields["press"]} />
                    <span className="field-error">
                        {this.validator.message('Press', fields['press'], 'required')}
                    </span>

                    <span>
                        <b>Facebook Profile</b>
                    </span>
                    <Input placeholder="Facebook Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "fb_profile")} value={fields["fb_profile"]} />
                    <span className="field-error">
                        {this.validator.message('facebook profile', fields['fb_profile'], 'required')}
                    </span>

                    <span>
                        <b>Twitter Profile</b>
                    </span>
                    <Input placeholder="Twitter Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "twitter_profile")} value={fields["twitter_profile"]} />
                    <span className="field-error">
                        {this.validator.message('twitter profile', fields['twitter_profile'], 'required')}
                    </span>

                    <span>
                        <b>Google Profile</b>
                    </span>
                    <Input placeholder="Google Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "google_profile")} value={fields["google_profile"]} />
                    <span className="field-error">
                        {this.validator.message('google profile', fields['google_profile'], 'required')}
                    </span>

                    <span>
                        <b>LinkedIn Profile</b>
                    </span>
                    <Input placeholder="LinkedIn Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "linkedin_profile")} value={fields["linkedin_profile"]} />
                    <span className="field-error">
                        {this.validator.message('linkedIn profile', fields['linkedin_profile'], 'required')}
                    </span>

                    <span>
                        <b>Media Contact Name</b>
                    </span>
                    <Input placeholder="Media Contact Name" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "media_name")} value={fields["media_name"]} />
                    <span className="field-error">
                        {this.validator.message('Name', fields['media_name'], 'required')}
                    </span>

                    <span>
                        <b>Media Contact Email</b>
                    </span>
                    <Input placeholder="Media Contact Email" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "media_email")} value={fields["media_email"]} />
                    <span className="field-error">
                        {this.validator.message('Email', fields['media_email'], 'required|email')}
                    </span>

                    <span>
                        <b>Support Contact</b>
                    </span>
                    <Input placeholder="Support Contact" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "phone")} value={fields["phone"]} />
                    <span className="field-error">
                        {this.validator.message('support contact', fields['phone'], 'required')}
                    </span>

                    <Button type="primary" onClick={this._editProfile}> Update </Button>
                </div>
                {loader && <Spin indicator={loaderIcon} />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
    }))(ContactUsForm);
