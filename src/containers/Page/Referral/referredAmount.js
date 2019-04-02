import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Card } from 'antd';
import FaldaxLoader from '../faldaxLoader';

class ReferredAmount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referredAmounts: [],
            userData: [],
            loader: false
        }
    }

    componentDidMount = () => {
        const { token, location } = this.props;
        let path = location.pathname.split('/');
        let user_id = path[path.length - 1]
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getReferredAmounts(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ referredAmounts: res.data, userData: res.userData[0], loader: false });
            })
            .catch((err) => {
                console.log(err)
                _this.setState({ loader: false });
            });
    }

    render() {
        const { referredAmounts, userData, loader } = this.state;

        return (
            <div className="referral-div">
                <Card
                    title={userData.full_name}
                    style={{ width: 300 }}
                >
                    {referredAmounts.length > 0 && referredAmounts.map((referral) => {
                        return (
                            <p>
                                <span className="amount-span">{referral.amount}</span>
                                <span>{referral.coin_name}</span>
                            </p>
                        )
                    })}
                </Card>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(ReferredAmount);
