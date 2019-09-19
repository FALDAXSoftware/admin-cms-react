import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Row, Col, notification, Card, Button } from 'antd';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';

const { logout } = authAction;

const ParentDiv = styled.div`
    padding: 20px;
    background-color: white;
    margin: 30px !important;
`

class UserWallets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userDetails: null,
            errType: 'error'
        }
    }

    componentDidMount = () => {
        this._getUserWallets();
    }

    _getUserWallets = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getUserDetails(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ userDetails: res.data[0] });
                } else if (res.status == 403) {
                    _this.props.logout();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    _createUserWallet = () => {

    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    render() {
        const { userDetails, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div>
                {userDetails != null &&
                    <ParentDiv className="parent-div">
                        <Row>
                            <Col>
                                <Card title="Bitcoin - BTC" style={{ width: 500 }}
                                    actions={[
                                        <Button type="primary" onClick={this._createUserWallet}>Create Wallet</Button>,
                                    ]}>
                                    <p><b>HOT Send Address :</b> <span>8z3D2rtqCKcZkECu84EDK6f2dk26GpTkdS</span></p>
                                    <p><b>HOT Receive Address :</b><span>8z3D2rtqCKcZkECu84EDK6f2dk26GpTkdS</span></p>
                                </Card>
                            </Col>
                        </Row>
                    </ParentDiv>
                }
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(UserWallets);
