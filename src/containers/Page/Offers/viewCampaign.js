import React, { Component } from "react";
import { Link } from "react-router-dom";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import { connect } from "react-redux";
import { notification, Row, Icon,Col ,Table,Divider,Tag,Tooltip} from "antd";
import Loader from "../faldaxLoader";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import moment from "moment";
import styled from "styled-components";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { OfferDateCell} from "../../../components/tables/helperCells";
const tableColumns = [
  {
    title: "Action",
    key: "action",
    width:75,
    render:(object)=>(
      <div>
        <Tooltip title="View Details">
          <Icon
            type="info-circle"
            theme="twoTone" 
            className="btn-icon"
            onClick={() =>
              ViewCampaign.viewOfferUsage(object.id,object.code)
            }
          />
        </Tooltip>
      </div>
    )
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    width:100,
  },
  {
    title: "Description",
    width:200,
    dataIndex: "description",
    key: "description"
  },
  {
    title: "No of transactions",
    dataIndex: "no_of_transactions",
    key: "no_of_transactions",
    width:100,
    
  },
  {
    title: "Total fees allowed",
    dataIndex: "fees_allowed",
    key: "fees_allowed",
    width:100,
    render: fees => <span>{fees} USD</span>
  },
  {
    title: "Usage",
    dataIndex: "offercode_used",
    key: "offercode_used",
    width:75
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    width:100,
    render: start_date => OfferDateCell(start_date)
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    width:100,
    render: end_date => OfferDateCell(end_date)
  },
  {
    title: "User",
    dataIndex: "user_data",
    key: "user_data",
    width:100,
    render: data =>
      data.id ? (
        <a href={`/dashboard/users/${data.id}`}>
          {data.first_name + " " + data.last_name}
        </a>
      ) : (
        "-"
      )
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    width:100,
    render: status => (
      <Tag
        className="cursor-default"
        color={status == true ? "geekblue" : "grey"}
        key={status}
      >
        {status == true ? "Active" : "Inactive"}
      </Tag>
    )
  },
  {
    title: "Expired",
    dataIndex: "end_date",
    key: "end_date",
    width:100,
    render: (end_date) => {
    let [today,exp_date]=[moment().startOf('day'),moment(end_date).startOf('day')]
    console.log(exp_date.diff(today, "days"))
    return <div>{(exp_date.diff(today, "days"))>-1?'':
    <span className="error-danger"><Icon type="info-circle" className="error-danger"/> Expired</span>}
    </div>;
    }
  }
];

const { logout } = authAction;

const CampaignCol = styled(Col)`
  margin: 0 0 15px 0;
`;

const detailHead=styled.span`
  font-weight:500;
  font-size:15px;
`;

const CampRow = styled(Row)`
  display: flex !important;
  align-items: center;
  margin: 10px 0;
  > div {
    padding: 0;
  }
`;
var self;

class ViewCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      campaignDetails: ""
    };
    this.loader = {
      show: () => this.setState({ loader: true }),
      hide: () => this.setState({ loader: false })
    };
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
    self=this;
  }
  componentDidMount() {
    this.getCampaignDetail();
  }
  getCampaignDetail = async () => {
    const { token } = this.props;
    const campaign_id = this.props.match.params.id;
    this.loader.show();
    try {
      let res = await (
        await ApiUtils.offers(token).getById(campaign_id)
      ).json();
      if (res.status == 200) {
        this.setState({ campaignDetails: res.data });
      } else if (res.status == 403) {
        this.props.logout();
      } else {
        this.openNotificationWithIcon("error", "Error", res.message);
      }
    } catch (error) {
    } finally {
      this.loader.hide();
    }
  };

  openNotificationWithIcon(type, head, desc) {
    notification[type]({
      message: head,
      description: desc
    });
  }

  static viewOfferUsage(offerId,offerName){
    console.log(self.props)
    self.props.history.push({pathname:`/dashboard/campaign/offer-usage/${offerId}`, state: JSON.stringify({ detail: self.state.campaignDetails.label,name:offerName})})
  }

  getOfferNameById(id){
     let index=this.props.campaignDetails.campaign_offers.findIndex(ele=>ele.id==id);
     if(index>-1){
       return this.props.campaignDetails.campaign_offers[index]
     }
  }

  render() {
    const { loader, campaignDetails } = this.state;
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
          <h2>{campaignDetails.label}</h2>
          <p>{campaignDetails.description}</p>
          <CampRow>
            <Col span={8}>
              <detailHead>Total number of transactions allowed</detailHead>
            </Col>
            <Col span={16}>{campaignDetails.no_of_transactions}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <detailHead>Total fees allowed</detailHead>
            </Col>
            <Col span={16}>{campaignDetails.fees_allowed} USD</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <detailHead>Type</detailHead>
            </Col>
            <Col span={16}>{campaignDetails.usage==1?'Single code use':'Multiple code use'}</Col>
          </CampRow>
          {campaignDetails.start_date && <CampRow>
            <Col span={8}>
              <detailHead>Start Date</detailHead>
            </Col>
            <Col span={16}>
              {OfferDateCell(campaignDetails.start_date)}
            </Col>
          </CampRow>}
          {campaignDetails.end_date && <CampRow>
            <Col span={8}>
              <detailHead>End Date</detailHead>
            </Col>
            <Col span={16}>
              {OfferDateCell(campaignDetails.end_date)}
            </Col>
          </CampRow>}
          <CampRow>
            <Col span={8}>
              <detailHead>Campaign Status</detailHead>
            </Col>
            <Col span={16}>
              <Tag className="cursor-default" color={campaignDetails.is_active ?'geekblue' : 'grey'}> {campaignDetails.is_active ? "Active" : "Inactive"}</Tag>
            </Col>
          </CampRow>
          <div className='mg-top-15'>
            <Divider orientation="left">Offers</Divider>
            <TableWrapper dataSource={campaignDetails.campaign_offers} bordered pagination={false} columns={tableColumns}/>
          </div>
        </TableDemoStyle>
        {loader && <Loader />}
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
