import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider, Input, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';

const { logout } = authAction;

const ParentDiv = styled.div`
padding: 20px;
background-color: white;
margin: 30px !important;
`

class PersonalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeDetails: [],
            fields: {},
            errors: {},
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        const { token, emp_id } = this.props;
        let _this = this;

        ApiUtils.getEmployeeDetails(token, emp_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ employeeDetails: res.data[0] });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {

                }
            })
            .catch((err) => {
                console.log(err)
            });
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

    _changePassword = () => {
        const { token, user } = this.props;
        console.log(user)
        let { fields, errors } = this.state;
        let _this = this;

        if (this.validator.allValid() && fields["newPwd"] === fields["confirmPwd"]) {
            _this.setState({ loader: true });

            let formData = {
                email: user.email,
                current_password: fields["oldPwd"],
                new_password: fields["newPwd"],
                confirm_password: fields["confirmPwd"]
            };

            ApiUtils.changePassword(token, formData)
                .then((response) => response.json())
                .then((res) => {
                    if (res.status == 200) {
                        let fields = _this.state.fields;
                        fields["oldPwd"] = "";
                        fields["newPwd"] = "";
                        fields["confirmPwd"] = "";
                        _this.validator = new SimpleReactValidator();
                        _this.setState({
                            fields, loader: false, errMsg: true, errType: res.err ? 'Error' : 'Success',
                            errMessage: res.err ? res.err : res.message
                        });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({
                            loader: false, errMsg: true, errType: 'Error', errMessage: res.message
                        });
                    }
                })
                .catch(err => {
                    _this.setState({ loader: false, errMsg: true });
                });
        } else {
            if (fields["confirmPwd"] !== fields["newPwd"] || fields["newPwd"] !== fields["confirmPwd"]) {
                this.state.errors["main"] = "New Password and Confirm Password doesn't match.";
                this.setState({ errors, loader: false })
            }
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { employeeDetails, fields, errors } = this.state;

        return (
            <ParentDiv className="kyc-div">
                <Divider>Personal Information</Divider>
                <div className="">
                    <p style={{ "marginBottom": "10px" }}>
                        <span> <b>Name:</b> </span>
                        {employeeDetails.first_name ? employeeDetails.last_name ? employeeDetails.first_name + ' ' + employeeDetails.last_name : employeeDetails.first_name : ''}
                    </p>

                    <p style={{ "marginBottom": "10px" }}>
                        <span> <b>Email:</b> </span>
                        {employeeDetails.email ? employeeDetails.email : ''}
                    </p>

                    <p style={{ "marginBottom": "10px" }}>
                        <span><b>Address: </b></span>
                        {employeeDetails.address ? employeeDetails.address : ''}
                    </p>

                    <p style={{ "marginBottom": "10px" }}>
                        <span><b>Phone Number: </b></span>
                        {employeeDetails.phone_number ? employeeDetails.phone_number : ''}
                    </p>
                </div>
                <Divider>Change Password</Divider>
                <div className="">
                    <div style={{ "marginTop": "10px" }}>
                        <span>
                            <b>New Password</b>
                        </span>
                        <Input
                            type="password"
                            placeholder="New Password"
                            style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                            onChange={this._onChangeFields.bind(this, "newPwd")}
                            value={fields["newPwd"]}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('New Password', fields["newPwd"], 'required', 'text-danger')}
                        </span>

                        <span>
                            <b>Confirm Password</b>
                        </span>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                            onChange={this._onChangeFields.bind(this, "confirmPwd")}
                            value={fields["confirmPwd"]}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Confirm Password', fields["confirmPwd"], 'required', 'text-danger')}
                            {errors["main"]}
                        </span>
                        <br />
                        <Button type="primary" onClick={this._changePassword}> Change </Button>
                    </div>
                </div>
                {/* <Divider>Change Email Address</Divider>
                <div className="">
                    <div style={{ "marginTop": "10px" }}>
                        <span>
                            <b>Email ID</b>
                        </span>
                        <Input
                            type="email"
                            placeholder="Email ID"
                            style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                            onChange={this._onChangeFields.bind(this, "email")}
                            value={fields["email"]}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('Email ID', fields["email"], 'required', 'text-danger')}
                        </span>
                        <br />
                        <Button type="primary" onClick={this._changePassword}> Change </Button>
                    </div> 
                </div>*/}
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(PersonalDetails);

