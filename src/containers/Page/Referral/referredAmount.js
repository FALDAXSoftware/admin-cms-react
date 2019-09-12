import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Card } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import { Link } from 'react-router-dom';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

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
                if (res.status == 200) {
                    _this.setState({ referredAmounts: res.data, userData: res.userData[0], loader: false });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                _this.setState({ loader: false });
            });
    }

    render() {
        const { referredAmounts, userData, loader } = this.state;

        return (
            <div className="referral-div">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/referral">
                        <i style={{ marginBottom: '15px', marginRight: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/referral') }}>Back</a>
                    </Link>
                </div>
                <Card
                    title={userData.full_name}
                    style={{ width: 300 }}
                >
                    {referredAmounts.length > 0 ?
                        referredAmounts.map((referral) => {
                            return (
                                <p>
                                    <span className="amount-span">{referral.amount}</span>
                                    <span>{referral.coin_name}</span>
                                </p>
                            )
                        })
                        : ' No Referral Earning'
                    }
                </Card>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(ReferredAmount);
