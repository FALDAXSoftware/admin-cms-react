import React, { Component } from "react";
import { Link } from "react-router-dom";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import { connect } from "react-redux";
import { notification, Row, Col } from "antd";
import FaldaxLoader from "../faldaxLoader";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import moment from "moment";
import styled from "styled-components";

const { logout } = authAction;

const CampaignCol = styled(Col)`
  margin: 0 0 15px 0;
`;
const CampRow = styled(Row)`
  display: flex !important;
  align-items: center;
  margin: 10px 0;
  > div {
    padding: 0;
  }
`;

class ViewCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      campaignDetials: ""
    };
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
  }
  componentDidMount() {
    // console.log("this.props.params", this.props.match.params.id);
    this._getCampaignDetail();
  }
  _getCampaignDetail = () => {
    const { token } = this.props;
    const campaign_id = this.props.match.params.id;
    let _this = this;
    this.setState({
      loader: true
    });
    ApiUtils.getCampaignDetails(token, campaign_id)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          console.log(res.data);
          _this.setState({ campaignDetials: res.data });
        } else if (res.status == 403) {
          _this.props.logout();
        } else {
          //   _this.setState({ errMsg: true, errMessage: res.message });
          _this.openNotificationWithIcon("error", "Error", res.message);
        }
        _this.setState({
          loader: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  openNotificationWithIcon(type, head, desc) {
    notification[type]({
      message: head,
      description: desc
    });
  }
  render() {
    const { loader, campaignDetials } = this.state;
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
          <h2>{campaignDetials.label}</h2>
          <p>{campaignDetials.description}</p>
          <CampRow>
            <Col span={8}>
              <b>Total number of transactions allowed:</b>
            </Col>
            <Col span={16}>{campaignDetials.no_of_transactions}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <b>Total fees allowed:</b>
            </Col>
            <Col span={16}>{campaignDetials.fees_allowed}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <b>Start Date:</b>
            </Col>
            <Col span={16}>
              {moment
                .utc(campaignDetials.start_date)
                .local()
                .format("DD MMM YYYY LTS")}
            </Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <b>End Date:</b>
            </Col>
            <Col span={16}>{moment
                .utc(campaignDetials.end_date)
                .local()
                .format("DD MMM YYYY LTS")}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <b>Campaign Status:</b>
            </Col>
            <Col span={16}>
              {campaignDetials.is_active ? "Active" : "Inactive"}
            </Col>
          </CampRow>
        </TableDemoStyle>
        {loader && <FaldaxLoader />}
      </LayoutWrapper>
    );
  }
}

// export default ViewCampaign;
export default connect(
  state => ({
    token: state.Auth.get("token"),
    user: state.Auth.get("user")
  }),
  { logout }
)(ViewCampaign);
