import React, { Component } from 'react';
import { BUCKET_URL } from '../../../helpers/globals';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Row, Col, Switch, notification } from 'antd';
import authAction from '../../../redux/auth/actions';
import styled from 'styled-components';
const { logout } = authAction;

const ParentDiv = styled.div`
padding: 20px;
background-color: white;
margin: 30px !important;
`
const UserPic = styled.div`
height: 150px;
width: 150px;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
border-radius:5px;
`
const UserName = styled.h2`
    padding-top:10px;
`
const UserEmail = styled.p`
`
const Address = styled.p`
    margin-top:10px;
    color: grey;
    & i {
        margin-right:10px;
    }
`
const DateOfBirth = styled(Address)`
`
const StatusSwitch = styled(Switch)`
width: 84px;
text-align: center;
height: 30px !important;
line-height: 26px !important;
&::after{
    width: 26px !important;
    height: 26px !important;
}
`
class PersonalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userDetails: null
        }
    }

    componentDidMount = () => {
        this._getUserDetail();
    }

    _getUserDetail = () => {
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

    _userStatus = () => {
        const { token } = this.props;
        const { userDetails } = this.state;
        let formData = {
            user_id: userDetails.id,
            email: userDetails.email,
            is_active: !userDetails.is_active
        };

        this.setState({ loader: true });
        let message = userDetails.is_active ? 'User has been inactivated successfully.' : 'User has been activated successfully.'
        ApiUtils.activateUser(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    this._getUserDetail();
                    this.setState({
                        errMsg: true, errMessage: message, errType: 'Success', loader: false
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
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
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
                        <Row type="flex" justify="end">
                            <Col>
                                <StatusSwitch checked={userDetails.is_active} checkedChildren="Active" unCheckedChildren="Inactive" size="large" onChange={this._userStatus} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <UserPic style={{ backgroundImage: `url(${BUCKET_URL + userDetails.profile_pic})` }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <UserName>{userDetails.first_name ? userDetails.last_name ? userDetails.first_name + ' ' + userDetails.last_name : userDetails.first_name : ''}</UserName>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <UserEmail>{userDetails.email ? userDetails.email : ''}</UserEmail>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Address>
                                    <i class="fas fa-map-marker-alt"></i>
                                    {userDetails.street_address ? userDetails.street_address_2 ? userDetails.street_address + ',' + userDetails.street_address_2 : userDetails.street_address : 'N/A'}
                                    {userDetails.city_town ? `, ${userDetails.city_town}` : ''}
                                    {userDetails.country ? `, ${userDetails.country}` : ''}
                                </Address>
                            </Col>
                        </Row>
                        {userDetails.dob &&
                            <Row>
                                <Col>
                                    <DateOfBirth>
                                        <i class="fas fa-calendar-day"></i>
                                        {userDetails.dob}
                                    </DateOfBirth>
                                </Col>
                            </Row>
                        }
                    </ParentDiv>
                }
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(PersonalDetails);
