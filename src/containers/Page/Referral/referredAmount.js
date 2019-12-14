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
    getAssetList=()=>{
        const { referredAmounts} = this.state;
        let assetList=[];
        referredAmounts.map(ele=>assetList.push(ele["coin_name"]));
        return assetList;
    }

    render() {
        const { referredAmounts, loader,user } = this.state;
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
                    <Row>
                        {
                            referredAmounts && referredAmounts.map((ref) => (
                                <Col md={8} sm={12} xs={24}>
                                    <Card className='assets-card' onClick={()=>this.props.history.push({pathname:`./${this.props.match.params.id}/${ref.coin_name}`,state:{assets:this.getAssetList()}})}>
                                        <div>
                                            <div className="asset-coinatiner">
                                                <img src={'https://s3.us-east-2.amazonaws.com/production-static-asset/' + ref.coin_icon}></img>&nbsp;&nbsp;
                                                <span>{ref.coin_name}</span>
                                                <span className="amount">{ref.amount}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
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
