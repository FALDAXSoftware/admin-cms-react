import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, Icon, Spin, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class SendCoinFee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        //this._getCoinFee();
    }

    _getCoinFee = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllCoins(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ fields: res.coin_fee });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchCoin: '', errType: 'error',
                });
            });
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['coin_fee'] = '';
        this.setState({ fields });
    }

    _sendCoinFee = () => {
        const { token } = this.props;
        let { fields } = this.state;

        // if (this.validator.allValid()) {
        //     let formData = {
        //         coin_fee: fields["coin_fee"],
        //     };

        //     ApiUtils.addCoin(token, formData)
        //         .then((res) => res.json())
        //         .then(() => {
        //            this._getCoinFee();
        //         })
        //         .catch(error => {
        //             this._resetAddForm();
        //         });
        // } else {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // }
    }

    render() {
        const { loader, fields } = this.state;

        return (
            <div>
                <div style={{ "marginBottom": "15px" }}>
                    <span>Edit Coin Fee:</span>
                    <Input placeholder="Coin Fee" onChange={this._handleChange.bind(this, "coin_fee")} value={fields["coin_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('coin fee', fields["coin_fee"], 'required|decimal', 'text-danger')}
                    </span>
                </div>

                <Button onClick={this._sendCoinFee}>Save</Button>

                {loader && <Spin indicator={loaderIcon} />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(SendCoinFee);
