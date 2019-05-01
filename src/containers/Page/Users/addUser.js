import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, Select, notification, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import CountryFields from './countryFields';

const { logout } = authAction;
const Option = Select.Option;

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            selectedRole: '',
            isDisabled: false,
            showRoleErr: false
        }
        this.validator = new SimpleReactValidator();
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
        fields['address'] = '';
        this.setState({ fields, selectedRole: '', showRoleErr: false });
    }

    _addEmployee = () => {
        const { token, getAllEmployee } = this.props;
        let { fields, selectedRole } = this.state;

        if (this.validator.allValid() && selectedRole) {
            let formData = {
                first_name: fields["first_name"],
                last_name: fields["last_name"],
                email: fields["email"],
                address: fields["address"],
                roles: selectedRole,
                phone_number: fields["phone_number"],
            };

            this.setState({ loader: true, isDisabled: true })
            ApiUtils.addEmployee(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        getAllEmployee();
                        this._resetAddForm();
                        this.setState({
                            errMsg: true, errMessage: res.message, showRoleErr: false,
                            errType: 'Success', loader: false, isDisabled: false
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message });
                    }
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true, isDisabled: false,
                        errMessage: 'Something went wrong', loader: false
                    });
                });
        } else {
            this.setState({ showRoleErr: selectedRole ? false : true })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeRole = (value) => {
        this.setState({ selectedRole: value }, () => {
            this.setState({ showRoleErr: this.state.selectedRole ? false : true });
        })
    }

    _changeAccountTier = (field, value) => {
        console.log('>>>>', field, value)

    }

    onCountryChange(country, state, city, stateID, countryID) {
        this.setState({ countrySelected: country, stateSelected: state, citySelected: city, stateID: stateID, countryID: countryID })
        var loc = {
            country: country,
            state: state,
            city: city
        }
        console.log('>>>>loc', loc)
        //this.onChangeField(loc, 'country');
    }

    render() {
        const { loader, fields, allRoles, errType, errMsg, isDisabled, showRoleErr } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }
        // email, phone, fname, lname, country, state, city, address 1 & 2, postal Code
        //, dob, account Tier, acc class

        return (
            <div>
                <div style={{ "marginBottom": "15px" }}>
                    <span>First Name:</span>
                    <Input placeholder="First Name" onChange={this._handleChange.bind(this, "first_name")} value={fields["first_name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('first name', fields["first_name"], 'required|max:30', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Last Name:</span>
                    <Input placeholder="Last Name" onChange={this._handleChange.bind(this, "last_name")} value={fields["last_name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('last name', fields["last_name"], 'required|max:30', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Email:</span>
                    <Input placeholder="Email" onChange={this._handleChange.bind(this, "email")} value={fields["email"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('email', fields["email"], 'required|email', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Street Address 1:</span>
                    <Input placeholder="Address" onChange={this._handleChange.bind(this, "address")} value={fields["address"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('address', fields["address"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Street Address 2:</span>
                    <Input placeholder="Address" onChange={this._handleChange.bind(this, "address")} value={fields["address"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('address', fields["address"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Postal Code:</span>
                    <Input placeholder="Postal Code" onChange={this._handleChange.bind(this, "postal")} value={fields["postal"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('postal', fields["postal"], 'required|numeric', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Account Tier:</span>
                    <Select
                        style={{ width: 200, "marginLeft": "15px" }}
                        placeholder="Select a Account Tier"
                        onChange={this._changeAccountTier.bind(this, 'tier')}
                    >
                        <Option value='1'>Tier 1</Option>
                        <Option value='2'>Tier 2</Option>
                        <Option value='3'>Tier 3</Option>
                        <Option value='4'>Tier 4</Option>
                    </Select>
                </div>

                <CountryFields
                    {...this.props}
                    onCountryChange={(country, state, city, stateID, countryID) => this.onCountryChange(country, state, city, stateID, countryID)} />
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AddUser);
