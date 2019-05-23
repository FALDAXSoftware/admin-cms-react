import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Input, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class EditAssetLimit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            fields: {},
            errMsg: false,
            errMessage: '',
            errType: 'Success',
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

    _editCoin = () => {
        const { token, getAllCoins } = this.props;
        const { fields, selectedToken } = this.state;

    }

    render() {
        const { loader, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>

                {loader && <FaldaxLoader />}
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditAssetLimit);
