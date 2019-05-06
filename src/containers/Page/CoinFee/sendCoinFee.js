import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import FaldaxLoader from '../faldaxLoader';

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
                    errMsg: true, errMessage: 'Something went wrong!!', searchCoin: '', errType: 'error',
                });
            });
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

        fields['coin_fee'] = '';
        this.setState({ fields });
    }

    _sendCoinFee = () => {
        const { token } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                coin_fee: fields["coin_fee"],
            };

            // ApiUtils.addCoinFee(token, formData)
            //     .then((res) => res.json())
            //     .then(() => {
            //         this._getCoinFee();
            //     })
            //     .catch(error => {
            //         this._resetAddForm();
            //     });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, fields } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Edit Asset Fee:</span>
                        <Input placeholder="Asset Fee" onChange={this._handleChange.bind(this, "coin_fee")} value={fields["coin_fee"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('asset fee', fields["coin_fee"], 'required|decimal', 'text-danger')}
                        </span>
                    </div>
                    <Button type="primary" onClick={this._sendCoinFee}>Save</Button>
                    {loader && <FaldaxLoader />}
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(SendCoinFee);
