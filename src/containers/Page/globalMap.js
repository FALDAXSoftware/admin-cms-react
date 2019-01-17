import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../helpers/apiUtills';
import { Input } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

class GlobalMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
        }
        this.validator = new SimpleReactValidator();
    }

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

        fields['loc_name'] = '';
        fields['address'] = '';
        fields['limit'] = '';
        this.setState({ fields });
    }

    _addLocation = () => {
        const { token, getAllCoins } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                coin_name: fields["coin_name"],
                coin_code: fields["coin_code"],
                limit: fields["limit"],
                wallet_address: fields["wallet_address"]
            };

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then(() => {
                    getAllCoins();
                    this._resetAddForm();
                })
                .catch(error => {
                    console.error(error);
                    this._resetAddForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, fields } = this.state;

        return (
            <div>
                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin Name:</span>
                    <Input placeholder="Coin Name" onChange={this._handleChange.bind(this, "coin_name")} value={fields["coin_name"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('coin name', fields["coin_name"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Coin Code:</span>
                    <Input placeholder="Coin Code" onChange={this._handleChange.bind(this, "coin_code")} value={fields["coin_code"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('coin code', fields["coin_code"], 'required', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Limit:</span>
                    <Input placeholder="Limit" onChange={this._handleChange.bind(this, "limit")} disabled={this.state.disabled} value={fields["limit"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('limit', fields["limit"], 'required|numeric', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Wallet Address:</span>
                    <Input placeholder="Wallet Address" onChange={this._handleChange.bind(this, "wallet_address")} value={fields["wallet_address"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('wallet address', fields["wallet_address"], 'required', 'text-danger')}
                    </span>
                </div>

            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(GlobalMap);
