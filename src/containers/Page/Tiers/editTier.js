import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, notification, Button, Form, Col, Row } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { Link } from 'react-router-dom';

const { logout } = authAction;

class EditTier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            errType: 'Success',
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let tierId = path[path.length - 1]
        this._getTierDetails(tierId);
    }

    _getTierDetails = (tierId) => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getTierDetails(token, tierId)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    //let fields;
                    //fields['account_age'] = res.data.minimum_activity_thresold[0];
                    _this.setState({ fields: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
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

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['daily_withdraw_limit'] = '';
        fields['monthly_withdraw_limit'] = '';
        this.setState({ fields });
    }

    _updateTier = (e) => {
        e.preventDefault();
        const { token } = this.props;
        let { fields } = this.state;
        let _this = this;

        if (this.validator.allValid()) {
            let formData = {
                daily_withdraw_limit: fields["daily_withdraw_limit"],
                monthly_withdraw_limit: fields["monthly_withdraw_limit"],

            };

            this.setState({ loader: true, isDisabled: true })
            ApiUtils.updateTier(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        _this._resetForm();
                        _this.setState({
                            errMsg: true, errMessage: res.message, errType: 'Success'
                        }, () => {
                            _this.props.history.push('/dashboard/users');
                        })
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                    }
                    _this.setState({ loader: false })
                })
                .catch(() => {
                    _this.setState({
                        errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, fields, errType, errMsg } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/account-tier">
                        <i style={{ marginRight: '10px', marginBottom: '10px' }} className="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/account-tier') }}>Back</a>
                    </Link>
                </div>
                <div>
                    <h2>Update Tier</h2>
                    <br />
                </div>
                <Form onSubmit={this._updateTier}>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Tier:</span>
                            <Input placeholder="tier_step" value={fields["tier_step"]} />
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Daily Withdraw Limit:</span>
                            <Input placeholder="Daily Withdraw Limit" onChange={this._handleChange.bind(this, "daily_withdraw_limit")} value={fields["daily_withdraw_limit"]} />
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Monthly Withdraw Limit:</span>
                            <Input placeholder="Monthly Withdraw Limit" onChange={this._handleChange.bind(this, "monthly_withdraw_limit")} value={fields["monthly_withdraw_limit"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('monthly_withdraw_limit', fields["monthly_withdraw_limit"], 'required', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    {/* <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Minimum Activity Thresold:</span>
                            <Input placeholder="Minimum Activity Thresold" onChange={this._handleChange.bind(this, "monthly_withdraw_limit")} value={fields["monthly_withdraw_limit"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('monthly_withdraw_limit', fields["monthly_withdraw_limit"], 'required', 'text-danger')}
                            </span>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col>
                            <Button type="primary" htmlType="submit" className="user-btn" style={{ marginLeft: "0px" }} >Update</Button>
                        </Col>
                    </Row>
                </Form>
                {loader && <FaldaxLoader />}
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditTier);
