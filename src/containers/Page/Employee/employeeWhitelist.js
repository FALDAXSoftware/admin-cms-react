import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Divider, Input, Button, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';

const { logout } = authAction;

const ParentDiv = styled.div`
padding: 20px;
background-color: white;
margin: 30px !important;
`

class EmployeeWhitelist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeDetails: [],
            ipAddress: {},
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        const { token, emp_id } = this.props;
        let _this = this;

        ApiUtils.getAllWhitelistIP(token, emp_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ ipAddress: res.data.whitelist_ip });
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

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _onChangeFields(field, e) {
        if (e.target.value.trim() == "") {
            this.setState({ [field]: '' });
        } else {
            this.setState({ [field]: e.target.value });
        }
    }

    _updateIPs = () => {
        const { token, user, emp_id } = this.props;
        let { ipAddress } = this.state;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            let formData = {
                admin_id: emp_id,
                email: user.email,
                ip: ipAddress
            };

            ApiUtils.addWhitelistIP(token, formData)
                .then((response) => response.json())
                .then((res) => {
                    if (res.status == 200) {
                        _this.validator = new SimpleReactValidator();
                        _this.setState({
                            loader: false, errMsg: true, errType: res.err ? 'Error' : 'Success',
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
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { ipAddress, errMsg, errType } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <ParentDiv className="kyc-div">
                <Divider>IP Whitelist</Divider>
                <div className="">
                    <div style={{ "marginTop": "10px" }}>
                        <span>
                            <b>IP Address</b>
                        </span>
                        <Input
                            type="text"
                            placeholder="IP Address"
                            style={{ "marginBottom": "15px", "width": "25%", "display": "inherit" }}
                            onChange={this._onChangeFields.bind(this, "ipAddress")}
                            value={ipAddress}
                        />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('IP Address', ipAddress, 'required', 'text-danger')}
                        </span>
                        <br />
                        <Button type="primary" onClick={this._updateIPs}> Add </Button>
                    </div>
                </div>
            </ParentDiv>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(EmployeeWhitelist);
