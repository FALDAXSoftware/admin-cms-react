import React, { Component } from "react";
import { BUCKET_URL } from "../../../helpers/globals";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { Row, Col, Switch, notification, Icon, Button } from "antd";
import authAction from "../../../redux/auth/actions";
import userAction from "../../../redux/users/actions";
import styled from "styled-components";
import { isAllowed } from "../../../helpers/accessControl";
import FaldaxLoader from "../faldaxLoader";
const { logout } = authAction;
const { showUserDetails } = userAction;


const ParentDiv = styled.div`
  padding: 20px;
  background-color: white;
  margin: 30px !important;
`;
const UserPic = styled.img`
  height: 160px;
  width: 160px;
`;
const UserName = styled.h2`
  padding-top: 10px;
`;
const UserEmail = styled.p``;
const Address = styled.p`
  margin-top: 10px;
  color: grey;
  & i {
    margin-right: 10px;
  }
`;
const DateOfBirth = styled(Address)``;
class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      errType: "error",
      loader: false
    };
  }

  componentDidMount = () => {
    this._getUserDetail();
  };

  _getUserDetail = () => {
    const { token, user_id, showUserDetails } = this.props;
    let _this = this;
    this.setState({ "loader": true });
    ApiUtils.getUserDetails(token, user_id)
      .then(response => response.json())
      .then(function (res) {

        if (res.status == 200) {
          let { email, first_name, last_name } = res.data[0]
          showUserDetails({ full_name: first_name + " " + last_name, email });
          _this.setState({ userDetails: res.data[0], loader: false });
        } else if (res.status == 403) {
          _this.setState({ errMsg: true, errMessage: res.err, loader: false }, () => _this.props.logout());
        } else {
          _this.setState({ errMsg: true, errMessage: res.message, loader: false });
        }
      })
      .catch(err => {
        _this.setState({ errMsg: true, errMessage:"Unable to complete the requested action.", loader: false });
      });
  };

  _userStatus = val => {
    const { token } = this.props;
    const { userDetails } = this.state;
    let formData = {
      user_id: userDetails.id,
      email: userDetails.email
    };

    if (val == "is_active") {
      formData["is_active"] = !userDetails.is_active;
    } else {
      formData["is_verified"] = !userDetails.is_verified;
    }

    this.setState({ loader: true });

    ApiUtils.activateUser(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          this._getUserDetail();
          this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "Success",
            loader: false
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.message, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({ errMsg: true, errMessage: res.message });
        }
      })
      .catch(() => {
        this.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
          loader: false
        });
      });
  };

  sendResendPasswordLink = async () => {
    try {
      let { email } = this.state.userDetails;
      await this.setState({ loader: true });
      let res = await (await ApiUtils.sendResetPasswordLink(this.props.token, { email: email })).json();
      let { status, message, err } = res;
      if (status == 200) {
        this.setState({
          errMsg: true,
          errMessage: message,
          errType: "success",
        })
      } else if (status == 400 || status == 403) {
        this.setState({
          errMsg: true,
          errMessage: err,
          errType: "error",
        }, () => this.props.logout())
      } else if (status == 401) {
        this.setState({
          errMsg: true,
          errMessage: err,
          errType: "error",
        });
      }
      else {
        this.setState({
          errMsg: true,
          errMessage: message,
          errType: "error",
        })
      }
    } catch (error) {

    } finally {
      this.setState({ loader: false })
    }
  }

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    const { userDetails, errMsg, errType, loader } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <div>
        {userDetails != null && (
          <ParentDiv className="parent-div">
            <Row type="flex" justify="end">
              <Col span={3}>
                <Switch
                  disabled={!isAllowed("user_activate") || (isAllowed("user_activate") && userDetails.deleted_by)}
                  className="personal-btn"
                  checked={userDetails.is_active}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  size="large"
                  onChange={this._userStatus.bind(this, "is_active")}
                />
                <br />
              </Col>
              <Col span={3}>
                <Switch
                  disabled={!isAllowed("user_activate") || (isAllowed("user_activate") && userDetails.deleted_by)}
                  className="kyc-btn"
                  checked={userDetails.is_verified}
                  checkedChildren="Email Verified"
                  unCheckedChildren="Email Unverified"
                  size="large"
                  onChange={this._userStatus.bind(this, "is_verified")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <UserPic
                  src={
                    !userDetails.profile_pic || userDetails.profile_pic == null
                      ? BUCKET_URL + "profile/def_profile.jpg"
                      : BUCKET_URL + userDetails.profile_pic
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <UserName>
                  <Icon type="user"></Icon>&nbsp;
                  {userDetails.first_name
                    ? userDetails.last_name
                      ? userDetails.first_name + " " + userDetails.last_name
                      : userDetails.first_name
                    : ""}
                </UserName>
              </Col>
            </Row>
            <Row>
              <Col>
                <UserEmail><Icon type="mail" />&nbsp;&nbsp;&nbsp;
                  {userDetails.email ? userDetails.email : ""}
                </UserEmail>
              </Col>
            </Row>
            {userDetails.UUID && (
              <Row>
                <Col>
                  <DateOfBirth>
                    <i className="fas fa-hashtag"></i>
                    {userDetails.UUID}
                  </DateOfBirth>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <div className="address">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>&nbsp;&nbsp;&nbsp;{userDetails.street_address
                    ? userDetails.street_address_2
                      ? (userDetails.street_address ? userDetails.street_address + " , " : "") +
                      userDetails.street_address_2
                      : userDetails.street_address
                    : ""}</span>
                  {/* {userDetails.city_town ? `, ${userDetails.city_town}` : ""}
                  {userDetails.country ? `, ${userDetails.country}` : ""} */}
                  <span className="address-text">
                    {(userDetails.city_town ? userDetails.city_town + " , " : "") + (userDetails.state ? userDetails.state + " , " : "") + (userDetails.postal_code ? userDetails.postal_code : "")}
                  </span>
                  <span className="address-text">
                    {(userDetails.country ? userDetails.country : "")}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <DateOfBirth>
                  <i className="fas fa-calendar-day"></i>
                  {userDetails.dob && userDetails.dob !== null
                    ? userDetails.dob
                    : ""}
                </DateOfBirth>
              </Col>
            </Row>
            {userDetails.deleted_by == 1 || userDetails.deleted_by == 2 ? (
              <Row>
                <Col>
                  <DateOfBirth>
                    <i className="fas fa-trash"></i>
                    {userDetails.deleted_by == 1 ? (
                      <span>Deactivated By User</span>
                    ) : (
                        <span>Deactivated By Admin</span>
                      )}
                  </DateOfBirth>
                </Col>
              </Row>
            ) : (
                ""
              )}
            <Row>
              <Col>
                <Button type="primary" onClick={this.sendResendPasswordLink}>Reset Password</Button>
              </Col>
            </Row>
          </ParentDiv>
        )}
        {loader && <FaldaxLoader />}
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token"),
    user: state.Auth.get("user")
  }),
  { logout, showUserDetails }
)(PersonalDetails);
