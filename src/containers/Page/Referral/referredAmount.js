import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'antd';
import FaldaxLoader from '../faldaxLoader';
import { Link } from 'react-router-dom';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;

class ReferredAmount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referredAmounts: [],
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
                    _this.setState({ referredAmounts: res.data, loader: false });
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

    groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    }

    render() {
        const { referredAmounts, loader } = this.state;
        let result = this.groupBy(referredAmounts, function (item) {
            return [item.userid];
        });

        return (
            <div className="referral-div">
                <div style={{ "display": "inline-block", "width": "100%" }}>
                    <Link to="/dashboard/referral">
                        <i style={{ marginBottom: '15px', marginRight: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/referral') }}>Back</a>
                    </Link>
                </div>
                {result.length > 0 ?
                    result.map((referral) => {
                        return (
                            <Row>
                                <Col xs={{ span: 5 }} lg={{ span: 8 }}>
                                    <Card style={{ width: 300, padding: '5px' }}>
                                        <span>{referral[0].firstname} {referral[0].lastname}</span> <br />
                                        <span>{referral[0].email}</span> <br />
                                        {
                                            referral && referral.map(function (ref) {
                                                return (
                                                    <p>
                                                        <span className="amount-span">{ref.earned} {ref.coinname}</span>
                                                    </p>
                                                );
                                            })
                                        }
                                    </Card>
                                </Col>
                            </Row>
                        )
                    })
                    : ' No Referral Earning'
                }
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(ReferredAmount);
