import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, Select, notification, Button, Form, Checkbox, Col, Row } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import CountryFields from './countryFields';
import { Link } from 'react-router-dom';

const { logout } = authAction;
const Option = Select.Option;

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            tierMsg: false,
            countryCode: '',
            selectedClass: '',
            errType: 'Success',
            allCoins: [],
            showClassError: false,
            isKYC: false,
            generate_wallet_coins: []
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getAllCoins();
    }

    _getAllCoins = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getWalletCoins(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allCoins: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                _this.setState({ loader: false })
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

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['first_name'] = '';
        fields['last_name'] = '';
        fields['email'] = '';
        fields['phone_number'] = '';
        fields['street_address'] = '';
        this.setState({ fields });
    }

    _addUser = (e) => {
        e.preventDefault();
        const { token } = this.props;
        let {
            fields, selectedTier, selectedClass, isKYC, countryCode,
            countrySelected, stateSelected, citySelected, generate_wallet_coins
        } = this.state;
        let _this = this;

        if (this.validator.allValid() && selectedTier && selectedClass) {
            let formData = {
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                email: fields["email"],
                street_address: fields["street_address"],
                street_address_2: fields["street_address_2"],
                postal_code: fields["postal_code"],
                account_tier: selectedTier,
                account_class: selectedClass,
                country: countrySelected,
                city_town: citySelected,
                state: stateSelected,
                country_code: countryCode,
                generate_wallet_coins,
                kyc_done: isKYC,
            };

            this.setState({ loader: true, isDisabled: true })
            ApiUtils.addUser(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        _this._resetAddForm();
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
            this.setState({
                showTierError: selectedTier ? false : true,
                showClassError: selectedClass ? false : true, loader: false
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeAccountTier = (field, value) => {
        let tier = value;
        this.setState({ selectedTier: tier })
    }

    onCountryChange(country, state, city, stateID, countryID, countryCode) {
        this.setState({
            countrySelected: country, stateSelected: state, citySelected: city, countryCode
        })
    }

    _changeAccountClass = (field, value) => {
        this.setState({ selectedClass: value })
    }

    _selectCoin = (field, val) => {
        let selectedCoins = this.state.generate_wallet_coins;

        if (selectedCoins.indexOf(field.coin) > -1) {
            selectedCoins.splice(selectedCoins.indexOf(field.coin), 1);
            this.setState({ generate_wallet_coins: selectedCoins })
        } else {
            selectedCoins.push(field.coin);
            this.setState({ generate_wallet_coins: selectedCoins })
        }
    }

    _isKYCCompleted = (e) => {
        this.setState({ isKYC: e.target.checked })
    }

    render() {
        const {
            loader, fields, errType, errMsg, showTierError, allCoins, showClassError, isKYC, generate_wallet_coins
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/users">
                        <i style={{ marginRight: '10px', marginBottom: '10px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/users') }}>Back</a>
                    </Link>
                </div>
                <div>
                    <h2>Add User</h2>
                    <br />
                </div>
                <Form onSubmit={this._addUser}>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>First Name:</span>
                            <Input placeholder="First Name" onChange={this._handleChange.bind(this, "first_name")} value={fields["first_name"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('first name', fields["first_name"], 'required|max:30', 'text-danger')}
                            </span>
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Last Name:</span>
                            <Input placeholder="Last Name" onChange={this._handleChange.bind(this, "last_name")} value={fields["last_name"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('last name', fields["last_name"], 'required|max:30', 'text-danger')}
                            </span>
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Email:</span>
                            <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
                            </span>
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Street Address 1:</span>
                            <Input placeholder="Street Address 1" onChange={this._handleChange.bind(this, "street_address")} value={fields["street_address"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('address', fields["street_address"], 'required', 'text-danger')}
                            </span>
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Street Address 2:</span>
                            <Input placeholder="Street Address 2" onChange={this._handleChange.bind(this, "street_address_2")} value={fields["street_address_2"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('address 2', fields["street_address_2"], 'required', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <CountryFields
                                {...this.props}
                                onCountryChange={(country, state, city, stateID, countryID, countryCode) => this.onCountryChange(country, state, city, stateID, countryID, countryCode)} />
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px", "paddingTop": "78px" }}>
                        <Col>
                            <span>Postal Code:</span>
                            <Input placeholder="Postal Code" onChange={this._handleChange.bind(this, "postal")} value={fields["postal"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('postal', fields["postal"], 'required|numeric', 'text-danger')}
                            </span>
                        </Col>
                    </Row>

                    <Row style={{ "marginBottom": "15px" }}>
                        <Col sm={4}>
                            <span>Account Tier:</span>
                        </Col>
                        <Col>
                            <Select
                                style={{ width: 300, "marginLeft": "15px" }}
                                placeholder="Select a Account Tier"
                                onChange={this._changeAccountTier.bind(this, 'tier')}
                            >
                                <Option value='1'>Tier 1</Option>
                                <Option value='2'>Tier 2</Option>
                                <Option value='3'>Tier 3</Option>
                                <Option value='4'>Tier 4</Option>
                            </Select>
                            {showTierError && <span style={{ "color": "red" }}>
                                {'The tier field is required.'}
                            </span>}
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col sm={4}>
                            <span>Account Class:</span>
                        </Col>
                        <Col>
                            <Select
                                style={{ width: 300, "marginLeft": "15px" }}
                                placeholder="Select a Account Class"
                                onChange={this._changeAccountClass.bind(this, 'acc_class')}
                            >
                                <Option value='0'>FALDAX Internal Account</Option>
                                <Option value='1'>Liquidity Partner</Option>
                                <Option value='2'>Institutional Customer</Option>
                                <Option value='3'>Retail Customer</Option>
                                <Option value='4'>Future FALDAX Venture 1 Customers</Option>
                                <Option value='5'>Future FALDAX Venture 2 Customers</Option>
                            </Select>
                            {showClassError && <span style={{ "color": "red" }}>
                                {'The account class field is required.'}
                            </span>}
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <span>Do you want to accept KYC ? :</span><br />
                            <Checkbox checked={isKYC} onChange={this._isKYCCompleted}>Yes</Checkbox><br />
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <span>Select Assets to generate wallet address:</span><br />
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                allowClear={true}
                            // onChange={handleChange}
                            >
                                {
                                    allCoins && allCoins.map((coin) => (
                                        <Option value={coin.coin} key={coin.id}>{coin.coin_name}-{coin.coin}</Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        {/* {
                                allCoins && allCoins.map((coin) => {
                                    return (
                                        <Col md={6}>
                                            <Checkbox onChange={this._selectCoin.bind(this, coin)}>{coin.coin_name}-{coin.coin}</Checkbox>
                                        </Col>
                                    )
                                })
                            } */}
                    </Row>
                    <Row>
                        <Col>
                            <Button type="primary" htmlType="submit" className="user-btn" style={{ marginLeft: "0px" }} >Add</Button>
                        </Col>
                    </Row>

                </Form>

                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddUser);
