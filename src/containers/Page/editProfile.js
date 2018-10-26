import React, { Component } from 'react';
import { Button, Input, Spin, Icon, notification } from 'antd';
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import ApiUtils from '../../helpers/apiUtills';
import authAction from '../../redux/auth/actions';

const { login } = authAction;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditProfile extends Component {
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
        let fields = this.state.fields;
        const { name, email } = this.props.user;
        fields["name"] = name;
        fields["email"] = email;
        this.setState({ fields });
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
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _editProfile = () => {
        const { token, login, user } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                name: fields['name'],
                email: user.email
            }

            ApiUtils.editProfile(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        login({ user: res.data[0] });
                        _this.setState({
                            errMsg: true, errMessage: 'Profile updated Successfully.',
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
                    <b> Edit Profile </b>
                </h2>

                <div style={{ "marginTop": "10px" }}>
                    <span>
                        <b>Name</b>
                    </span>
                    <Input placeholder="Name" style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }} onChange={this._onChangeFields.bind(this, "name")} value={fields["name"]} />
                    <span className="field-error">
                        {this.validator.message('Name', fields['name'], 'required|max:30')}
                    </span>

                    <span>
                        <b>Email</b>
                    </span>
                    <Input disabled style={{ "marginBottom": "15px", "width": "25%", "display": "inherit", "readonly": "readonly" }} value={fields["email"]} />
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
        user: state.Auth.get('user'),
    }),
    { login }
)(EditProfile);
