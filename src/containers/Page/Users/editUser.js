import React, { Component } from "react";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  Button,
  DatePicker,
  notification
} from "antd";
import CountryFields from "./countryFields";
import authAction from "../../../redux/auth/actions";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import moment from "moment";
import FaldaxLoader from "../faldaxLoader";

const Option = Select.Option;
const { logout } = authAction;

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {}
    };
    this.validator = new SimpleReactValidator({});
  }

  componentDidMount = () => {
    this._getAllAccountClasses();
    this._getUserDetails();
  };

  _getUserDetails = () => {
    const { token } = this.props;
    let user_id = this.props.match.params.id;
    ApiUtils.getUserDetails(token, user_id)
      .then(response => response.json())
      .then((res)=> {
        if (res.status == 200) {
          res=res.data[0]
          this.setState({
            fields: res,
            dob: res.dob
              ? moment(res.dob, "DD-MM-YYYY").local()
              : "",
            selectedClass: res.account_class,
            selectedTier: res.account_tier,
            countrySelected: res.country,
            stateSelected: res.state,
            citySelected: res.city_town,
            selectedGender:res.gender,
            stateCode:res.state_id
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  _getAllAccountClasses = () => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllAccountClasses(token, "id", "ASC")
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({ allAccountClasses: res.allClasses });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
        }
        _this.setState({ loader: false });
      })
      .catch(err => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  _changeAccountTier = (field, value) => {
    this.setState({ selectedTier: value });
  };

  _changeAccountClass = (field, value) => {
    this.setState({ selectedClass: value });
  };

  _isKYCCompleted = e => {
    this.setState({ isKYC: e.target.checked });
  };

  _disabledDate = current => {
    return (
      current &&
      current >
        moment()
          .subtract(18, "years")
          .endOf("day")
    );
  };

  _handleChange = (field, e) => {
    let fields = this.state.fields;
    // if (e.target.value.trim() == "") {
    //   fields[field] = "";
    // } else {
    //   console.log("fields[field]", field, e.target.value);
    //   if (field == "postal_code") {
    //     var reg = /^(?=.*[0-9A-Za-z])[- ()0-9A-Za-z]{3,25}$/;
    //     var bool = reg.test(e.target.value);
    //     console.log("if", bool);
    //     if (bool === true) {
    //     } else {
    //       console.log("else");
    //       if (e.target.value.length < 3 || e.target.value.length > 25)
    //         this.setState({
    //           postalmsg:
    //             "Postal code should have min. 3 and max. 25 characters."
    //         });
    //       else
    //         this.setState({
    //           postalmsg:
    //             "Postal code should only contain alphabets , numbers , hyphen and space ."
    //         });
    //     }
    //     fields[field] = e.target.value;
    //   } else {
    //     fields[field] = e.target.value;
    //   }
    // }
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _updateUser = e => {
    e.preventDefault();
    const { token } = this.props;
    let {
      fields,
      selectedTier,
      selectedClass,
      isKYC,
      countryCode,
      countrySelected,
      stateSelected,
      citySelected,
      dob,
      selectedGender,
      stateCode,
      countryID
    } = this.state;
    let _this = this;

    if (this.validator.allValid() && selectedTier && selectedClass) {
      let formData = {
        user_id: fields["id"],
        first_name: fields["first_name"],
        last_name: fields["last_name"],
        middle_name: fields["middle_name"],
        street_address: fields["street_address"],
        street_address_2: fields["street_address_2"],
        postal_code: fields["postal_code"],
        account_tier: selectedTier,
        account_class: selectedClass,
        country: countrySelected,
        city_town: citySelected,
        state: stateSelected,
        country_code: countryCode,
        state_id:stateCode,
        country_id:countryID,
        kyc_done: isKYC,
        gender: selectedGender,
        dob: moment(dob).format("DD-MM-YYYY")
      };

      this.setState({ loader: true, isDisabled: true });
      ApiUtils.updateUser(token, formData)
        .then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            _this.setState(
              {
                errMsg: true,
                errMessage: res.message,
                errType: "Success"
              },
              () => {
                _this.props.history.push("/dashboard/users");
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.err,
              errType: "error"
            });
          }
          _this.setState({ loader: false });
        })
        .catch(() => {
          _this.setState({
            errType: "error",
            errMsg: true,
            errMessage: "Something went wrong",
            loader: false
          });
        });
    } else {
      this.setState({
        showTierError: selectedTier ? false : true,
        showClassError: selectedClass ? false : true,
        loader: false,
        showDOBErr: dob ? false : true
      });
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  onCountryChange(country, state, city, stateID, countryID, countryCode) {
    
    this.setState({
      countrySelected: country,
      stateSelected: state,
      citySelected: city,
      countryCode,
      countryID,
      stateCode:stateID
    },()=>console.log("State Changed => ",this.state));
    
  }

  _changeDate = (date, dateString) => {
    this.setState({ dob: date ,showDOBErr:false});
  };

  _changeGender = val => {
    this.setState({ selectedGender: val });
  };

  render() {
    const {
      fields,
      allAccountClasses,
      showClassError,
      selectedGender,
      showTierError,
      showDOBErr,
      errMsg,
      errType,
      selectedClass,
      selectedTier,
      countrySelected,
      stateSelected,
      citySelected,
      stateCode,
      dob,
      loader
    } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <div className="isoLayoutContent">
        <div style={{ display: "inline-block", width: "100%" }}>
          <Link to="/dashboard/users">
            <i
              style={{ marginRight: "10px", marginBottom: "10px" }}
              className="fa fa-arrow-left"
              aria-hidden="true"
            ></i>
            <a
              onClick={() => {
                this.props.history.push("/dashboard/users");
              }}
            >
              Back
            </a>
          </Link>
        </div>
        <div>
          <h2>Edit User</h2>
          <br />
        </div>
        <Form onSubmit={this._updateUser}>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>UUID:</span>
              <Input placeholder="UUID" value={fields["UUID"]} disabled />
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>First Name:</span>
              <Input
                placeholder="First Name"
                onChange={this._handleChange.bind(this, "first_name")}
                value={fields["first_name"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "first name",
                  fields["first_name"],
                  "required|max:30",
                  "text-danger"
                )}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Middle Name:</span>
              <Input
                placeholder="Middle Name"
                onChange={this._handleChange.bind(this, "middle_name")}
                value={fields["middle_name"]}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Last Name:</span>
              <Input
                placeholder="Last Name"
                onChange={this._handleChange.bind(this, "last_name")}
                value={fields["last_name"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "last name",
                  fields["last_name"],
                  "required|max:30",
                  "text-danger"
                )}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Email:</span>
              <Input placeholder="Email" value={fields["email"]} disabled />
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col sm={4}>
              <span>Date of Birth:</span>
            </Col>
            <Col>
              <DatePicker
                disabledDate={this._disabledDate}
                defaultValue={moment()
                  .subtract(18, "years")
                  .endOf("day")}
                onChange={this._changeDate}
                value={dob}
              />
              <br />
              {showDOBErr && (
                <span style={{ color: "red" }}>
                  {"The date of birth field is required."}
                </span>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <span>Gender:</span>
            </Col>
            <Col>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                style={{ width: 125 }}
                placeholder="Select a type"
                onChange={this._changeGender}
                value={selectedGender}
              >
                <Option value={"male"}>Male</Option>
                <Option value={"female"}>Female</Option>
              </Select>
              {this.validator.message(
                  "gender",
                  selectedGender,
                  "required",
                  "error-danger"
                )}
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Street Address 1:</span>
              <Input
                placeholder="Street Address 1"
                onChange={this._handleChange.bind(this, "street_address")}
                value={fields["street_address"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "address 1",
                  fields["street_address"],
                  "required",
                  "text-danger"
                )}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col>
              <span>Street Address 2:</span>
              <Input
                placeholder="Street Address 2"
                onChange={this._handleChange.bind(this, "street_address_2")}
                value={fields["street_address_2"]}
              />
            </Col>
          </Row>
              <CountryFields
                countryName={countrySelected}
                stateName={stateSelected}
                cityName={citySelected}
                stateCode={stateCode}
                update={true}
                {...this.props}
                onCountryChange={(
                  country,
                  state,
                  city,
                  stateID,
                  countryID,
                  countryCode
                ) =>
                  this.onCountryChange(
                    country,
                    state,
                    city,
                    stateID,
                    countryID,
                    countryCode
                  )
                }
              />
             <div className='float-clear'>
                {this.validator.message(
                  "Country",
                  countrySelected,
                  "required",
                  "error-danger"
                )}
                {this.validator.message(
                  "City",
                  citySelected,
                  "required",
                  "error-danger"
                )}
                
                {this.validator.message(
                  "State",
                  stateSelected,
                  "required",
                  "error-danger"
                )}
              </div>
          <Row style={{ marginBottom: "15px", paddingTop: "16" }}>
            <Col>
              <span>Postal Code:</span>
              <Input
                placeholder="Postal Code"
                onChange={this._handleChange.bind(this, "postal_code")}
                value={fields["postal_code"]}
              />
              <span style={{ color: "red" }}>
                {this.validator.message(
                  "postal",
                  fields["postal_code"],
                  "required|alpha_num_dash|min:3|max:25",
                  "text-danger"
                )}
                {this.state.postalmsg}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col sm={4}>
              <span>Account Tier:</span>
            </Col>
            <Col>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                style={{ width: 300, marginLeft: "15px" }}
                placeholder="Select an Account Tier"
                onChange={this._changeAccountTier.bind(this, "tier")}
                value={selectedTier}
              >
                <Option value={1}>Tier 1</Option>
                <Option value={2}>Tier 2</Option>
                <Option value={3}>Tier 3</Option>
                <Option value={4}>Tier 4</Option>
              </Select>
              <br />
              {showTierError && (
                <span style={{ color: "red" }}>
                  {"The tier field is required."}
                </span>
              )}
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <Col sm={4}>
              <span>Account Class:</span>
            </Col>
            <Col>
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                style={{ width: 450, marginLeft: "15px" }}
                placeholder="Select an Account Class"
                onChange={this._changeAccountClass.bind(this, "acc_class")}
                value={selectedClass}
              >
                {allAccountClasses &&
                  allAccountClasses.map(account => (
                    <Option
                      value={account.id}
                    >{`${account.id} - ${account.class_name}`}</Option>
                  ))}
              </Select>
              <br />
              {showClassError && (
                <span style={{ color: "red" }}>
                  {"The account class field is required."}
                </span>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                className="user-btn"
                style={{ marginLeft: "0px" }}
              >
                Update
              </Button>
            </Col>
          </Row>
        </Form>
        {loader && <FaldaxLoader />}
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(EditUser);
