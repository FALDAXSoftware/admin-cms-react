import React, { Component } from "react";
import {
  Tag,
  notification,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  Radio,
  Switch,
  Button,
  Card,
  Table,
  Select,
  Divider,
  Icon,
  Tooltip
} from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import moment from "moment";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import authAction from "../../../redux/auth/actions";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { DateCell ,OfferDateCell} from "../../../components/tables/helperCells";
const Option = Select.Option;
const { logout } = authAction;
const { RangePicker } = DatePicker;
var self;
const columns_temp = [
  {
    title: "Action",
    dataIndex: "id",
    key: "id",
    render: id => (
      <Tooltip title="edit">
        <Icon
          type="edit"
          style={{ marginLeft: "10px", cursor: "pointer" }}
          onClick={() => AddCampaign.editOffer(id)}
        />
      </Tooltip>
    )
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "No of transactions",
    dataIndex: "no_of_transactions",
    key: "no_of_transactions"
  },
  {
    title: "Total fees allowed",
    dataIndex: "fees_allowed",
    key: "fees_allowed",
    render: fees => <span>{fees} USD</span>
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    render: start_date => start_date?OfferDateCell(start_date):'-'
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    render: end_date => end_date?OfferDateCell(end_date):'-'
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    render: object => (
      <Tag color={object == true ? "geekblue" : "grey"}>
        {object === true ? "Active" : "Inactive"}
      </Tag>
    )
  },
];
const ValidSpan = styled.div`
  color: red;
`;
const CampForm = styled(Form)`
  padding: 20px 0 0 0 !important;
`;
const CampaignCol = styled(Col)`
  margin: 0 0 15px 0;
`;
const CampRow = styled(Row)`
  display: flex !important;
  align-items: center;
`;
const StatusSwitch = styled(Switch)`
  width: 84px;
  text-align: center;
  height: 30px !important;
  line-height: 26px !important;
  &::after {
    width: 26px !important;
    height: 26px !important;
  }
`;
class AddCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      checkvalue: 1,
      checkOfferValue: 1,
      is_active: true,
      fields: {},
      dateErrMsg: "",
      startDate: "",
      endDate: "",
      offerFields: {},
      is_offer_active: true,
      startOfferDate: "",
      endOfferDate: "",
      dateOfferErrMsg: "",
      openOfferCode: false,
      campaign_offers: [],
      campaignId:0,
      filterVal: "",
      userList: [],
      userIdAssigned: "",
      errMsg: false,
      errType: "Success",
      disabledRadio: false,
      isUpdate:false,
      isOfferUpdate:false,
      offerId:0
    };
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onOfferRadioChange = this.onOfferRadioChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onOfferDateChange = this.onOfferDateChange.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
    this.validator = new SimpleReactValidator();
    this.validator1 = new SimpleReactValidator();
    self=this;
  }

  componentDidMount = () => {
    let campaignId=this.props.match.params.id;
    console.log(campaignId);
    if(campaignId){
      this.setState({isUpdate:true,campaignId},()=>this.getCampaignById())
    }
    this.getUserList();

  };

  async getCampaignById(){
    try{
      let {token} =this.props;
      let {fields}=this.state;
      this.setState({loader:true});
      let res=await(await ApiUtils.offers(token).getById(this.state.campaignId)).json();
      if(res.status==200){
        fields["campaign_name"]=res.data.label;
        fields["campaign_desc"]=res.data.description;
        fields["no_of_transactions"]=res.data.no_of_transactions;
        fields["fees_allowed"]=res.data.fees_allowed;
        this.setState({disabledRadio:true,campaign_offers:res.data.campaign_offers,checkvalue:res.data.usage,startDate:res.data.start_date?moment(res.data.start_date):'',endDate:res.data.end_date?moment(res.data.end_date):''});
        this.setState(fields);
      }else if(res.status==401 || res.status==403){
        this.setState({errMsg:true,errType:"error",errMessage:res.message});  
      }
    }catch(error){
      this.setState({errMsg:true,errType:"error",errMessage:"Something went to wrong"});
    }finally{
      this.setState({loader:false})
    }
  }

  static editOffer(id){
      let index=self.state.campaign_offers.findIndex((ele)=>ele.id==id)
      if(index!=-1){
        let {offerFields}=self.state;
        offerFields['offer_name']=self.state.campaign_offers[index].code;
        offerFields['offer_code_description']=self.state.campaign_offers[index].description;
        offerFields['no_of_transactions']=self.state.campaign_offers[index].no_of_transactions;
        offerFields['fees_allowed']=self.state.campaign_offers[index].fees_allowed;
        self.setState({
          openOfferCode:true,
          startOfferDate:moment(self.state.campaign_offers[index].start_date),
          endOfferDate:moment(self.state.campaign_offers[index].end_date),
          is_offer_active:self.state.campaign_offers[index].is_active,
          checkOfferValue:self.state.campaign_offers[index].is_default_values?1:2,
          filterVal: self.state.campaign_offers[index].user_id,
          userIdAssigned: self.state.campaign_offers[index].user_id,
          isOfferUpdate:true,
          offerId:id,
      })
    }
  }

  _resetAddForm = () => {
    const { fields, endDate, startDate } = this.state;
  };

  _resetAddOfferForm = () => {
    const { offerFields, startOfferDate, endOfferDate } = this.state;
    offerFields["offer_name"] = "";
    offerFields["offer_code_description"] = "";
    offerFields["no_of_transactions"] = "";
    offerFields["fees_allowed"] = "";
    this.setState({
      offerFields,
      startOfferDate: "",
      endOfferDate: "",
      dateOfferErrMsg: "",
      checkOfferValue: 1,
      filterVal: ""
    });
    this.validator1.hideMessages();
    this.forceUpdate();
  };
  getUserList() {
    const { token } = this.props;
    ApiUtils.getCampaignUserList(token)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          // console.log(res.data);
          this.setState({
            userList: res.data
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({ errMsg: true, errMessage: res.message });
        }
      })
      .catch(err => {
        this.setState({ loader: false });
      });
  }
  _addCampaign = e => {
    const { token } = this.props;
    const {
      fields,
      campaign_offers,
      startDate,
      endDate,
      is_active,
      checkvalue,
      isUpdate,
      campaignId
    } = this.state;
    e.preventDefault();

    if (this.state.checkvalue === 1) {
      if (this.validator.allValid()) {
        this.setState({
          loader: true
        });
        let formdata = {};
        formdata["label"] = fields["campaign_name"];
        formdata["description"] = fields["campaign_desc"];
        formdata["no_of_transactions"] = fields["no_of_transactions"];
        formdata["fees_allowed"] = fields["fees_allowed"];
        formdata["usage"] = checkvalue;
        formdata["is_active"] = is_active;
        formdata["campaign_offers"]=[];
        if(isUpdate){
          for(let offer of campaign_offers){
            if(offer['campaign_offers_new']){
              delete offer.campaign_offers_new;
              delete offer.id;
              if(!formdata['campaign_offers_new']){
                formdata['campaign_offers_new']=[]
              }
              formdata['campaign_offers_new'].push(offer)
            }else{
              offer.start_date=moment(offer.start_date).format("YYYY-MM-DD");
              offer.end_date=moment(offer.end_date).format("YYYY-MM-DD");
              formdata['campaign_offers'].push(offer)
            }
          }
        }else{
          formdata["campaign_offers"] = campaign_offers.map(ele=>{delete ele.id;return ele});
        }
        (isUpdate? ApiUtils.offers(token).updateCampaign(campaignId,formdata):ApiUtils.createCampaign(token, formdata))
          .then(res => res.json())
          .then(res => {
            if (res.status == 200) {
              console.log("create Campaign", res.data);
              this.openNotificationWithIcon("success", "Success", res.message);
              this.props.history.push("/dashboard/campaign");
            } else if (res.status == 400) {
              this.openNotificationWithIcon(
                "error",
                "Error",
                "Please add atleast 1 offer for the campaign."
              );
            } else if (res.status == 403) {
              this.setState(
                { errMsg: true, errMessage: res.err, errType: "error" },
                () => {
                  this.props.logout();
                }
              );
            } else {
              // this.setState({ errMsg: true, errMessage: res.message });
              this.openNotificationWithIcon("error", "Error", res.message);
            }
            this.setState({
              loader: false
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    if (this.state.checkvalue === 2) {
      if (this.validator.allValid() && this.state.startDate) {
        // alert("success 2");
        this.setState({
          loader: true
        });
        let formdata = {};
        formdata["label"] = fields["campaign_name"];
        formdata["description"] = fields["campaign_desc"];
        formdata["no_of_transactions"] = fields["no_of_transactions"];
        formdata["fees_allowed"] = fields["fees_allowed"];
        formdata["start_date"] = startDate.format("YYYY-MM-DD");
        formdata["end_date"] = endDate.format("YYYY-MM-DD");
        formdata["usage"] = checkvalue;
        formdata["is_active"] = is_active;
        formdata["campaign_offers"]=[];
        if(isUpdate){
          for(let offer of campaign_offers){
            if(offer['campaign_offers_new']){
              delete offer.campaign_offers_new;
              delete offer.id;
              if(!formdata['campaign_offers_new']){
                formdata['campaign_offers_new']=[]
              }
              formdata['campaign_offers_new'].push(offer)
            }else{
              offer.start_date=moment(offer.start_date).format("YYYY-MM-DD");
              offer.end_date=moment(offer.end_date).format("YYYY-MM-DD");
              formdata['campaign_offers'].push(offer)
            }
          }
        }else{
          formdata["campaign_offers"] = campaign_offers;
        }
        (isUpdate? ApiUtils.offers(token).updateCampaign(campaignId,formdata):ApiUtils.createCampaign(token, formdata))
          .then(res => res.json())
          .then(res => {
            if (res.status == 200) {
              console.log("create Multi Campaign", res.data);
              this.openNotificationWithIcon("success", "Success", res.message);
              this.props.history.push("/dashboard/campaign");
            } else if (res.status == 403) {
              this.openNotificationWithIcon("error", "Error", res.message);
              this.props.logout();
            } else if (res.status == 400) {
              this.openNotificationWithIcon(
                "error",
                "Error",
                "Please add atleast 1 offer for the campaign."
              );
            } else {
              // this.setState({ errMsg: true, errMessage: res.message });
              this.openNotificationWithIcon("error", "Error", res.message);
            }
            this.setState({
              loader: false
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      } else {
        this.validator.showMessages();
        this.forceUpdate();
        if (this.state.startDate) {
          this.setState({
            dateErrMsg: ""
          });
        } else {
          this.setState({
            dateErrMsg: "Please enter valid Start date and End date."
          });
        }
      }
    }
  };

  offerIsValid=async(offerCode)=>{
    try {
      this.setState({ loader: true });
      let offerCodeIsValid = await (
        await ApiUtils.offers(this.props.token).checkOfferCode(
          offerCode
        )
      ).json();
      if (offerCodeIsValid.status == 200) {
        return true;
      } else if (offerCodeIsValid.status == 400) {
        this.openNotificationWithIcon("error","Error",offerCodeIsValid.message);
        return false
      } else if (offerCodeIsValid.status == 403) {
        this.openNotificationWithIcon("error", "Error", offerCodeIsValid.message);
        this.props.logout();

      } else {
        this.openNotificationWithIcon("error", "Error", offerCodeIsValid.message);
        return false; 
      }
    } catch(error){
      console.log("Error",error)
      this.openNotificationWithIcon("error", "Error", "Something went to wrong please try again or contact support");
      return false;
    } finally {
      this.setState({ loader: false });
    }
  }

  _addOffer =async e => {
    const {
      offerFields,
      fields,
      startOfferDate,
      endOfferDate,
      startDate,
      endDate,
      is_offer_active,
      checkOfferValue,
      campaign_offers,
      userIdAssigned,
      isOfferUpdate,
      offerId,
      isUpdate
    } = this.state;
    e.preventDefault();
    if (this.state.checkvalue === 1) {
      if (
        this.validator1.allValid() &&
        this.validator.allValid() &&
        startOfferDate
      ) {
        if(!(await this.offerIsValid(offerFields["offer_name"]))){
          return false;
        }
        let formdata = {};
        formdata["code"] = offerFields["offer_name"];
        formdata["description"] = offerFields["offer_code_description"];
        formdata["is_default_values"] = checkOfferValue === 1 ? true : false;
        formdata["no_of_transactions"] =
          checkOfferValue === 1
            ? fields["no_of_transactions"]
            : offerFields["no_of_transactions"];
        formdata["fees_allowed"] =
          checkOfferValue === 1
            ? fields["fees_allowed"]
            : offerFields["fees_allowed"];
        formdata["user_id"] = userIdAssigned;
        formdata["start_date"] = startOfferDate.format("YYYY-MM-DD");
        formdata["end_date"] = endOfferDate.format("YYYY-MM-DD");
        formdata["is_active"] = is_offer_active;
        console.log("Add Offer:", formdata);
        if(isUpdate){
          if(isOfferUpdate){
            let index=campaign_offers.findIndex(ele=>ele.id==offerId)
            if(index!=-1){
              formdata["id"] = offerId;
              campaign_offers[index]=formdata;
            }
            }else{
              formdata["id"]=new Date().getTime();
              formdata["campaign_offers_new"]=true;
              campaign_offers.push(formdata);      
            }
          }else if(isOfferUpdate){
            let index=campaign_offers.findIndex(ele=>ele.id==offerId)
            if(index!=-1){
              formdata["id"] = offerId;
              campaign_offers[index]=formdata;
            }
          }else{
            formdata["id"]=new Date().getTime();
            campaign_offers.push(formdata);
          }
        this.setState({
          campaign_offers:campaign_offers,
          openOfferCode: false,
          disabledRadio: true
        });
        this._resetAddOfferForm();
      } else {
        this.validator1.showMessages();
        this.validator.showMessages();
        this.forceUpdate();
        if (this.state.startOfferDate) {
          this.setState({
            dateOfferErrMsg: ""
          });
        } else {
          this.setState({
            dateOfferErrMsg: "Please enter valid Start date and End date."
          });
        }
      }
    } else if (this.state.checkvalue === 2) {
      if (
        this.validator1.allValid() &&
        this.validator.allValid() &&
        this.state.startDate
      ) {
        if(!(await this.offerIsValid(offerFields["offer_name"]))){
          return false;
        }
        let formdata = {};
        formdata["code"] = offerFields["offer_name"];
        formdata["description"] = offerFields["offer_code_description"];
        formdata["is_default_values"] = checkOfferValue === 1 ? true : false;
        formdata["no_of_transactions"] =
          checkOfferValue === 1
            ? fields["no_of_transactions"]
            : offerFields["no_of_transactions"];
        formdata["fees_allowed"] =
          checkOfferValue === 1
            ? fields["fees_allowed"]
            : offerFields["fees_allowed"];
        // formdata["user_id"] = userIdAssigned;
        formdata["start_date"] = startDate
          ? startDate.format("YYYY-MM-DD")
          : "";
        formdata["end_date"] = endDate ? endDate.format("YYYY-MM-DD") : "";
        formdata["is_active"] = is_offer_active;
        console.log("Add Offer:", formdata);
        if (isUpdate) {
          if (isOfferUpdate) {
            let index = campaign_offers.findIndex(ele => ele.id == offerId);
            if (index != -1) {
              formdata["id"] = offerId;
              campaign_offers[index] = formdata;
            }
          } else {
            formdata["id"] = new Date().getTime();
            formdata["campaign_offers_new"] = true;
            campaign_offers.push(formdata);
          }
        } else if (isOfferUpdate) {
          let index = campaign_offers.findIndex(ele => ele.id == offerId);
          if (index != -1) {
            formdata["id"] = offerId;
            campaign_offers[index] = formdata;
          }
        } else {
          formdata["id"]=new Date().getTime();
          campaign_offers.push(formdata);
        }
        this.setState({
          campaign_offers:campaign_offers,
          openOfferCode: false,
          disabledRadio: true
        });
        this._resetAddOfferForm();
      } else {
        // alert("test2");
        this.validator1.showMessages();
        this.validator.showMessages();
        if (this.state.startDate) {
          this.setState({
            dateErrMsg: ""
          });
        } else {
          this.setState({
            dateErrMsg: "Please enter valid Start date and End date."
          });
        }
        this.forceUpdate();
      }
    } else {
      alert("out of loop");
    }
  };
  _handleChange(field, e) {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  }
  _handleOfferChange(field, e) {
    let offerFields = this.state.offerFields;
    if (e.target.value.trim() == "") {
      offerFields[field] = "";
    } else {
      offerFields[field] = e.target.value;
    }
    this.setState({ offerFields });
  }
  _campaignStatus(e) {
    console.log(e);
    this.setState({
      is_active: e
    });
  }
  _offerStatus(e) {
    console.log(e);
    this.setState({
      is_offer_active: e
    });
  }
  _disabledDate = current => {
    return (
      current <
      moment()
        .subtract(1, "day")
        .endOf("day")
    );
  };
  
  onDateChange(dates, dateStrings) {
    // console.log("From: ", dates[0], ", to: ", dates[1]);
    // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    // this.setState({});
    if (dates[0] === undefined || dates[1] === undefined) {
      this.setState({
        dateErrMsg: "Please enter valid Start date and End date."
      });
    } else {
      this.setState({
        dateErrMsg: "",
        startDate: dates[0],
        endDate: dates[1]
      });
    }
  }
  onOfferDateChange(dates, dateStrings) {
    // console.log("From: ", dates[0], ", to: ", dates[1]);
    // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    // this.setState({});
    if (dates[0] === undefined || dates[1] === undefined) {
      this.setState({
        dateOfferErrMsg: "Please enter valid Start date and End date."
      });
    } else {
      this.setState({
        dateOfferErrMsg: "",
        startOfferDate: dates[0],
        endOfferDate: dates[1]
      });
    }
  }
  onRadioChange = e => {
    this.setState(
      {
        checkvalue: e.target.value,
        startDate: "",
        endDate: "",
        dateErrMsg: "",
        openOfferCode: false
      },
      () => {
        this.validator.hideMessages();
        this.forceUpdate();
      }
    );
  };
  onOfferRadioChange = e => {
    // Remove react validation in case of change radio 
    if(e.target.value==1){
      delete this.validator1.fields["no of transactions"]
      delete this.validator1.fields["total fees allowed"]
    }
    this.setState(
      {
        checkOfferValue: e.target.value,
        dateOfferErrMsg: ""
      },
      () => {
        this.validator1.hideMessages();
        this.forceUpdate();
      }
    );
  };
  _changeUser = val => {
    // console.log("user details", val);
    this.setState({ filterVal: val, userIdAssigned: val });
  };
  openNotificationWithIcon(type, head, desc) {
    notification[type]({
      message: head,
      description: desc
    });
  }
  onSearch(val) {
    console.log("search:", val);
    // this.setState({ filterVal: val });
  }
  getUserText(email, firstname, lastname) {
    return email + " ( " + firstname + " " + lastname + " )";
  }
  render() {
    // console.log("errorMessage value", errMsg);
    // if (errMsg) {
    //   this.openNotificationWithIconError(errType.toLowerCase());
    // }
    const {
      loader,
      fields,
      is_active,
      checkvalue,
      dateErrMsg,
      startDate,
      endDate,
      offerFields,
      checkOfferValue,
      is_offer_active,
      startOfferDate,
      endOfferDate,
      dateOfferErrMsg,
      openOfferCode,
      campaign_offers,
      filterVal,
      userList,
      errMsg,
      isUpdate,
      errType,
      isOfferUpdate
    } = this.state;

    const columns =
      this.state.checkvalue === 1
        ? columns_temp.concat({
            title: "User Id",
            dataIndex: "user_id",
            key: "user_id"
          })
        : columns_temp;
    return (
      <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="/dashboard/campaign">
            <i
              style={{ marginRight: "10px", marginBottom: "10px" }}
              className="fa fa-arrow-left"
              aria-hidden="true"
            ></i>
            <a
              onClick={() => {
                this.props.history.push("/dashboard/campaign");
              }}
            >
              Back
            </a>
          </Link>
          <h2>{isUpdate?'Update':'Add'} Campaign</h2>
          <CampForm onSubmit={this._addCampaign}>
            <Row>
              <CampaignCol>
                <span>Name*:</span>
                <Input
                  placeholder="Name"
                  onChange={this._handleChange.bind(this, "campaign_name")}
                  value={fields["campaign_name"]}
                />
                <ValidSpan>
                  {this.validator.message(
                    "campaign_name",
                    fields["campaign_name"],
                    "required|min:3|max:30",
                    "text-danger-validation"
                  )}
                </ValidSpan>
              </CampaignCol>
              <CampaignCol>
                <span>Description:</span>
                <Input
                  placeholder="Description"
                  onChange={this._handleChange.bind(this, "campaign_desc")}
                  value={fields["campaign_desc"]}
                />
              </CampaignCol>
              <CampaignCol>
                <span>Default Total Number of Transactions:</span>
                <Input
                  placeholder="Number of Transactions"
                  onChange={this._handleChange.bind(this, "no_of_transactions")}
                  value={fields["no_of_transactions"]}
                  disabled={isUpdate}
                />
                <ValidSpan>
                  {this.validator.message(
                    "no of transactions",
                    fields["no_of_transactions"],
                    "required|numeric",
                    "text-danger-validation"
                  )}
                </ValidSpan>
              </CampaignCol>
              <CampaignCol>
                <span>Default Total Fees Allowed:</span>
                <Input
                  placeholder="Total Fees Allowed"
                  onChange={this._handleChange.bind(this, "fees_allowed")}
                  value={fields["fees_allowed"]}
                  disabled={isUpdate}
                />
                <ValidSpan>
                  {this.validator.message(
                    "total fees allowed",
                    fields["fees_allowed"],
                    "required|numeric",
                    "text-danger-validation"
                  )}
                </ValidSpan>
              </CampaignCol>
              <CampaignCol>
                <Radio.Group
                  disabled={this.state.disabledRadio}
                  onChange={this.onRadioChange}
                  value={checkvalue}
                >
                  <Radio value={1}>Single Code Use</Radio>
                  <Radio value={2}>Multiple Code Use</Radio>
                </Radio.Group>
              </CampaignCol>
              {checkvalue === 2 && (
                <CampaignCol>
                  <CampRow>
                    <Col span={6}>
                      <span>Start Date and End Date:</span>
                    </Col>
                    <Col span={18}>
                      <RangePicker
                        ranges={{
                          Today: [moment(), moment()],
                          "This Month": [
                            moment().startOf("month"),
                            moment().endOf("month")
                          ]
                        }}
                        allowClear={false}
                        value={[startDate, endDate]}
                        disabledDate={this._disabledDate}
                        onChange={this.onDateChange}
                      />
                      <ValidSpan>{dateErrMsg}</ValidSpan>
                    </Col>
                  </CampRow>
                </CampaignCol>
              )}
            </Row>

            {/* Offer Code listing start */}
            {campaign_offers.length > 0 && (
              <Row>
                <Divider orientation="left">Offers</Divider>
                <Table bordered dataSource={campaign_offers} columns={columns} pagination={false}/>
              </Row>
            )}
            {/* Offer Code listing end */}
            <Row>
              {!openOfferCode && (
                <CampaignCol>
                  <Button
                    type="primary"
                    className="user-btn"
                    onClick={e => {
                      this.setState({
                        openOfferCode: true,
                        isOfferUpdate:false,
                      });
                    }}
                  >
                    Add Offer Codes
                  </Button>
                </CampaignCol>
              )}
            </Row>
            {/* Add offer code start */}
            {openOfferCode && (
              <Row>
                <Card>
                  <h2>{isOfferUpdate?'Update':'Add'} Offer Codes</h2>
                  <CampForm>
                    <CampaignCol>
                      <span>Offer Code*:</span>
                      <Input
                        placeholder="Offer Code"
                        disabled={isOfferUpdate && isUpdate}
                        onChange={this._handleOfferChange.bind(
                          this,
                          "offer_name"
                        )}
                        value={offerFields["offer_name"]}
                      />
                      <ValidSpan>
                        {this.validator1.message(
                          "offer code",
                          offerFields["offer_name"],
                          "required|min:3|max:30",
                          "text-danger-validation"
                        )}
                      </ValidSpan>
                    </CampaignCol>
                    <CampaignCol>
                      <span>Offer Code Description:</span>
                      <Input
                        placeholder="Offer Code Description"
                        onChange={this._handleOfferChange.bind(
                          this,
                          "offer_code_description"
                        )}
                        value={offerFields["offer_code_description"]}
                      />
                    </CampaignCol>
                    <CampaignCol>
                      <CampRow>
                        <Col span={4}>
                          <span>Offer Code Status:</span>
                        </Col>
                        <Col span={20}>
                          <StatusSwitch
                            checked={is_offer_active}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            size="large"
                            onChange={this._offerStatus.bind(this)}
                          />
                        </Col>
                      </CampRow>
                    </CampaignCol>
                    {checkvalue === 1 && (
                      <CampaignCol>
                        <CampRow>
                          <Col span={6}>
                            <span>Start Date and End Date:</span>
                          </Col>
                          <Col span={18}>
                            <RangePicker
                              disabled={false}
                              ranges={{
                                Today: [moment(), moment()],
                                "This Month": [
                                  moment().startOf("month"),
                                  moment().endOf("month")
                                ]
                              }}
                              allowClear={false}
                              value={[startOfferDate, endOfferDate]}
                              disabledDate={this._disabledDate}
                              onChange={this.onOfferDateChange}
                            />
                            <ValidSpan>{dateOfferErrMsg}</ValidSpan>
                          </Col>
                        </CampRow>
                      </CampaignCol>
                    )}
                    <CampaignCol>
                      <Radio.Group
                        disabled={isOfferUpdate && isUpdate}
                        onChange={this.onOfferRadioChange}
                        value={checkOfferValue}
                      >
                        <Radio value={1}>Use Default Parameters</Radio>
                        <Radio value={2}>Add Parameters</Radio>
                      </Radio.Group>
                    </CampaignCol>
                    {checkOfferValue === 2 && (
                      <div>
                        <CampaignCol>
                          <span>Default Total Number of Transactions:</span>
                          <Input
                            placeholder="Number of Transactions"
                            disabled={isOfferUpdate && isUpdate}
                            onChange={this._handleOfferChange.bind(
                              this,
                              "no_of_transactions"
                            )}
                            value={offerFields["no_of_transactions"]}
                          />
                          <ValidSpan>
                            {this.validator1.message(
                              "no of transactions",
                              offerFields["no_of_transactions"],
                              "required|numeric",
                              "text-danger-validation"
                            )}
                          </ValidSpan>
                        </CampaignCol>
                        <CampaignCol>
                          <span>Default Total Fees Allowed:</span>
                          <Input
                            placeholder="Total Fees Allowed"
                            disabled={isOfferUpdate && isUpdate}
                            onChange={this._handleOfferChange.bind(
                              this,
                              "fees_allowed"
                            )}
                            value={offerFields["fees_allowed"]}
                          />
                          <ValidSpan>
                            {this.validator1.message(
                              "total fees allowed",
                              offerFields["fees_allowed"],
                              "required|numeric",
                              "text-danger-validation"
                            )}
                          </ValidSpan>
                        </CampaignCol>
                      </div>
                    )}
                    {checkvalue === 1 && (
                      <CampRow>
                        <Col span={6}>
                          <span>Select User:</span>
                        </Col>
                        <Col span={10}>
                          <Select
                            disabled={isOfferUpdate && isUpdate}
                            placeholder="Select a user"
                            onSearch={this.onSearch}
                            onChange={this._changeUser}
                            optionFilterProp="children"
                            value={(parseInt(filterVal)||"")}
                            showSearch
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {userList &&
                              userList.map((user, index) => {
                                return (
                                  <Option key={user.id} value={user.id}>
                                    {this.getUserText(
                                      user.email,
                                      user.first_name,
                                      user.last_name
                                    )}
                                  </Option>
                                );
                              })}
                          </Select>
                          <ValidSpan>
                            {this.validator1.message(
                              "user",
                              filterVal,
                              "required",
                              "text-danger-validation"
                            )}
                          </ValidSpan>
                        </Col>
                      </CampRow>
                    )}
                    <CampaignCol>
                      <Button
                        type="primary"
                        // htmlType="submit"
                        className="user-btn"
                        onClick={e => {
                          this._addOffer(e);
                        }}
                      >
                      {isOfferUpdate?'Update':'Add'}
                      </Button>
                      <Button
                        type="primary"
                        className="user-btn"
                        onClick={e => {
                          this.setState(
                            {
                              openOfferCode: false
                            },
                            () => {
                              this._resetAddOfferForm();
                            }
                          );
                        }}
                      >
                        Close
                      </Button>
                    </CampaignCol>
                  </CampForm>
                </Card>
              </Row>
            )}
            {/* Add offer code end */}
            <Row>
              <CampaignCol>
                <Button type="primary" htmlType="submit" className="user-btn">
                  {isUpdate?'Update':'Add'} Campaign
                </Button>
                <Button
                  type="primary"
                  className="user-btn"
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                >
                  Close
                </Button>
              </CampaignCol>
            </Row>
          </CampForm>
        </TableDemoStyle>
        {loader && <FaldaxLoader />}
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(AddCampaign);

export { AddCampaign };
