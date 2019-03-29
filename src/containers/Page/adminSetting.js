import React, { Component } from 'react';
import { Button, Input, notification } from 'antd';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import FaldaxLoader from '../Page/faldaxLoader';

const { TextArea } = Input;

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
                email: fields['email'],
                address: fields['address'],
                press: fields['press'],
                fb_profile: fields['fb_profile'],
                twitter_profile: fields['twitter_profile'],
                insta_profile: fields['insta_profile'],
                telegram_profile: fields['telegram_profile'],
                faldax_url: fields['faldax_url'],
                google_profile: fields['google_profile'],
                linkedin_profile: fields['linkedin_profile'],
                youtube_profile: fields['youtube_profile'],
                media_name: fields['media_name'],
                media_email: fields['media_email'],
                phone: fields['phone'],
                discord_profile: fields['discord_profile']
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
                    <b> Contact Setting </b>
                </h2>

                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Contact Address</b>
                    </span>
                    <TextArea placeholder="Contact Address" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "address")} value={fields["address"]} />
                    <span className="field-error">
                        {this.validator.message('Address', fields['address'], 'required')}
                    </span>

                    <span>
                        <b>Contact Email</b>
                    </span>
                    <Input placeholder="Contact Email" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "email")} value={fields["email"]} />
                    <span className="field-error">
                        {this.validator.message('Email', fields['email'], 'required|email')}
                    </span>

                    <span>
                        <b>Support Contact</b>
                    </span>
                    <Input placeholder="Support Contact" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "phone")} value={fields["phone"]} />
                    <span className="field-error">
                        {this.validator.message('support contact', fields['phone'], 'required')}
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
                        <b>Youtube Profile</b>
                    </span>
                    <Input placeholder="Youtube Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "youtube_profile")} value={fields["youtube_profile"]} />
                    <span className="field-error">
                        {this.validator.message('Youtube profile', fields['youtube_profile'], 'required')}
                    </span>

                    <span>
                        <b>Instagram Profile</b>
                    </span>
                    <Input placeholder="Instagram Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "insta_profile")} value={fields["insta_profile"]} />
                    <span className="field-error">
                        {this.validator.message('Instagram profile', fields['insta_profile'], 'required')}
                    </span>

                    <span>
                        <b>Telegram Profile</b>
                    </span>
                    <Input placeholder="Telegram Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "telegram_profile")} value={fields["telegram_profile"]} />
                    <span className="field-error">
                        {this.validator.message('Telegram profile', fields['telegram_profile'], 'required')}
                    </span>

                    <span>
                        <b>Discord Profile</b>
                    </span>
                    <Input placeholder="Discord Profile" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "discord_profile")} value={fields["discord_profile"]} />
                    <span className="field-error">
                        {this.validator.message('Discord profile', fields['discord_profile'], 'required')}
                    </span>

                    <span>
                        <b>FALDAX URL</b>
                    </span>
                    <Input placeholder="FALDAX URL" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "faldax_url")} value={fields["faldax_url"]} />
                    <span className="field-error">
                        {this.validator.message('FALDAX URL', fields['faldax_url'], 'required')}
                    </span>

                    <span>
                        <b>Press</b>
                    </span>
                    <Input placeholder="Press" style={{ "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                        onChange={this._onChangeFields.bind(this, "press")} value={fields["press"]} />
                    <span className="field-error">
                        {this.validator.message('Press', fields['press'], 'required')}
                    </span>
                    <Button type="primary" onClick={this._editProfile}> Update </Button>
                </div>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
    }))(ContactUsForm);
