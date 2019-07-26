import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, notification, Select, Form, Col, Row, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import { BUCKET_URL } from '../../../helpers/globals';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import { withRouter } from 'react-router'

const { logout } = authAction;
const Option = Select.Option;

class EditAssetDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            isDisabled: false,
            selectedToken: false
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getAssetDetails();
    }

    _getAssetDetails = () => {
        const { token, coin_id } = this.props;
        const { } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAssetDetails(token, coin_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ fields: res.coin, selectedToken: res.coin.isERC });
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
        this._getAssetDetails();
    }

    _editCoin = (e) => {
        e.preventDefault();
        const { token, coin_id } = this.props;
        const { fields, selectedToken } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                coin_id,
                coin_name: fields['coin_name'],
                min_limit: fields['min_limit'],
                max_limit: fields['max_limit'],
                warm_wallet_address: fields['warm_wallet_address'],
                hot_send_wallet_address: fields['hot_send_wallet_address'],
                hot_receive_wallet_address: fields['hot_receive_wallet_address'],
                custody_wallet_address: fields['custody_wallet_address'],
                isERC: selectedToken
            }

            ApiUtils.editCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', isDisabled: false
                        }, () => {
                            this._getAssetDetails();
                        });
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false,
                            errType: 'Error', isDisabled: false
                        });
                    }
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Something went wrong!!',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeFilter = (val) => {
        this.setState({ selectedToken: val });
    }

    render() {
        const { loader, fields, errMsg, errType, selectedToken } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <Form onSubmit={this._editCoin}>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Asset Icon:</span><br />
                            <img style={{ width: '150px', height: 'auto' }}
                                src={BUCKET_URL + fields['coin_icon']} />
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Asset Name:</span>
                            <Input placeholder="Asset Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('asset name', fields["coin_name"], 'required|max:30', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Minimum Limit:</span>
                            <Input placeholder="Minimum Limit" onChange={this._handleChange.bind(this, "min_limit")} value={fields["min_limit"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('minimum limit', fields["min_limit"], 'required|numeric', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Maximum Limit:</span>
                            <Input placeholder="Maximum Limit" onChange={this._handleChange.bind(this, "max_limit")} value={fields["max_limit"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('maximum limit', fields["max_limit"], 'required|numeric', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Warm Wallet Address:</span>
                            <Input placeholder="Warm Wallet Address" onChange={this._handleChange.bind(this, "warm_wallet_address")} value={fields["warm_wallet_address"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('warm wallet address', fields["warm_wallet_address"], 'required|max:100', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Hot Send Wallet Address:</span>
                            <Input placeholder="Hot Send Wallet Address" onChange={this._handleChange.bind(this, "hot_send_wallet_address")} value={fields["hot_send_wallet_address"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('hot send wallet address', fields["hot_send_wallet_address"], 'required|max:100', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Hot Receive Wallet Address:</span>
                            <Input placeholder="Hot Receive Wallet Address" onChange={this._handleChange.bind(this, "hot_receive_wallet_address")} value={fields["hot_receive_wallet_address"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('hot receive wallet address', fields["hot_receive_wallet_address"], 'required|max:100', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Custody Wallet Address:</span>
                            <Input placeholder="Custody Wallet Address" onChange={this._handleChange.bind(this, "custody_wallet_address")} value={fields["custody_wallet_address"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('custody wallet address', fields["custody_wallet_address"], 'required|max:100', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Is ERC20 Token? :</span>
                            <Select
                                getPopupContainer={trigger => trigger.parentNode}
                                style={{ width: 125, "marginLeft": "15px" }}
                                placeholder="Select a type"
                                onChange={this._changeFilter}
                                value={selectedToken}
                            >
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="primary" htmlType="submit" className="user-btn" style={{ marginLeft: "0px" }} >Update</Button>
                            <Button type="primary"
                                onClick={() => this._resetForm()}
                                className="user-btn"
                                style={{ marginLeft: "15px" }}>
                                Cancel
                                </Button>
                        </Col>
                    </Row>
                </Form>
                {loader && <FaldaxLoader />}
            </div >
        );
    }
}

export default withRouter(connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditAssetDetails));
