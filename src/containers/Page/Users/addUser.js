import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, Select, notification, Button, Form, Checkbox, Col, Row, DatePicker } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import CountryFields from './countryFields';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PasswordGenerator from './passwordGenerator';

const { logout } = authAction;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

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
            indeterminate: true,
            checkAll: false,
            showDOBErr: false,
            selectedGender: 'male'
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getAllCoins();
        this._getAllAccountClasses();
    }

    _getAllCoins = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getWalletCoins(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    let coinsArray = [];
                    res.data && res.data.map((asset) => {
                        coinsArray.push(asset.coin_name);
                    })
                    _this.setState({ allCoins: coinsArray });
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

    _getAllAccountClasses = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllAccountClasses(token, 'id', 'ASC')
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allAccountClasses: res.allClasses });
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
            fields, selectedTier, selectedClass, isKYC, countryCode, password,
            countrySelected, stateSelected, citySelected, checkedList, dob, selectedGender
        } = this.state;
        let _this = this;

        if (this.validator.allValid() && selectedTier && selectedClass) {
            let formData = {
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                middle_name: fields["middle_name"],
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
                generate_wallet_coins: checkedList,
                kyc_done: isKYC,
                gender: selectedGender,
                password,
                dob
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
                showClassError: selectedClass ? false : true, loader: false,
                showDOBErr: dob ? false : true
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeAccountTier = (field, value) => {
        this.setState({ selectedTier: value })
    }

    onCountryChange(country, state, city, stateID, countryID, countryCode) {
        this.setState({
            countrySelected: country, stateSelected: state, citySelected: city, countryCode
        })
    }

    _changeAccountClass = (field, value) => {
        this.setState({ selectedClass: value })
    }

    _isKYCCompleted = (e) => {
        this.setState({ isKYC: e.target.checked })
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.allCoins.length),
            checkAll: checkedList.length === this.state.allCoins.length,
        });
    }

    _changeDate = (date, dateString) => {
        this.setState({ dob: moment(date).format('DD-MM-YYYY') })
    }

    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.allCoins : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    _changeGender = (val) => {
        this.setState({ selectedGender: val });
    }

    _disabledDate = (current) => {
        return current && current > moment().endOf('day');
    }

    _getPassword = (value) => {
        this.setState({ password: value });
    }

    render() {
        const { loader, fields, errType, errMsg, showTierError, allCoins, showClassError,
            showDOBErr, isKYC, selectedGender, allAccountClasses } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/users">
                        <i style={{ marginRight: '10px', marginBottom: '10px' }} className="fa fa-arrow-left" aria-hidden="true"></i>
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
                            <span>Middle Name:</span>
                            <Input placeholder="Middle Name" onChange={this._handleChange.bind(this, "middle_name")} value={fields["middle_name"]} />
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
                                {this.validator.message('address 1', fields["street_address"], 'required', 'text-danger')}
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
                        <Col sm={4}>
                            <span>Date of Birth:</span>
                        </Col>
                        <Col>
                            <DatePicker disabledDate={this._disabledDate} onChange={this._changeDate} /><br />
                            {showDOBErr && <span style={{ "color": "red" }}>
                                {'The date of birth field is required.'}
                            </span>}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <span>Gender:</span>
                        </Col>
                        <Col>
                            <Select
                                getPopupContainer={trigger => trigger.parentNode}
                                style={{ width: 125 }}
                                placeholder="Select a type"
                                onChange={this._changeGender}
                                value={selectedGender}
                            >
                                <Option value={'male'}>Male</Option>
                                <Option value={'female'}>Female</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={24}>
                            <CountryFields
                                {...this.props}
                                onCountryChange={(country, state, city, stateID, countryID, countryCode) => this.onCountryChange(country, state, city, stateID, countryID, countryCode)} />
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px", "paddingTop": "78px" }}>
                        <Col>
                            <span>Postal Code:</span>
                            <Input placeholder="Postal Code" onChange={this._handleChange.bind(this, "postal_code")} value={fields["postal_code"]} />
                            <span style={{ "color": "red" }}>
                                {this.validator.message('postal_code', fields["postal_code"], 'required|numeric', 'text-danger')}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col sm={4}>
                            <span>Account Tier:</span>
                        </Col>
                        <Col>
                            <Select
                                getPopupContainer={trigger => trigger.parentNode}
                                style={{ width: 300, "marginLeft": "15px" }}
                                placeholder="Select an Account Tier"
                                onChange={this._changeAccountTier.bind(this, 'tier')}
                            >
                                <Option value='1'>Tier 1</Option>
                                <Option value='2'>Tier 2</Option>
                                <Option value='3'>Tier 3</Option>
                                <Option value='4'>Tier 4</Option>
                            </Select><br />
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
                                getPopupContainer={trigger => trigger.parentNode}
                                style={{ width: 450, "marginLeft": "15px" }}
                                placeholder="Select an Account Class"
                                onChange={this._changeAccountClass.bind(this, 'acc_class')}
                            >
                                {allAccountClasses && allAccountClasses.map((account) => <Option value={account.id}>{`${account.id} - ${account.class_name}`}</Option>)}
                            </Select><br />
                            {showClassError && <span style={{ "color": "red" }}>
                                {'The account class field is required.'}
                            </span>}
                        </Col>
                    </Row>
                    <Row style={{ "marginBottom": "15px" }}>
                        <Col>
                            <Checkbox checked={isKYC} onChange={this._isKYCCompleted} /> <span>Do you want to accept KYC ?</span><br />
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <span>Select Assets to generate wallet address:</span><br />
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                Check all
          </Checkbox>
                            <br />
                            <CheckboxGroup options={allCoins} value={this.state.checkedList} onChange={this.onChange} />
                        </Col>
                        {/* <PasswordGenerator /> */}
                    </Row>
                    <br /><br />
                    <PasswordGenerator getPassword={this._getPassword.bind(this)} />
                    <Row>
                        <Col>
                            <Button type="primary" htmlType="submit" className="user-btn" style={{ marginLeft: "0px" }} >Add</Button>
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
    }), { logout })(AddUser);
