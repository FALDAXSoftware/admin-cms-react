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
import { OfferDateCell, DateTimeCell} from "../../../components/tables/helperCells";
import { isAllowed } from "../../../helpers/accessControl";
import { TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
const tableColumns = [
  {
    title: "Action",
    key: "action",
    width:100,
    align:"left",
    ellipsis:true,
    render:(object)=>(
      <div>
        {isAllowed("view_campaign_offer_used")&&<Tooltip title="View Details">
          <Icon
            type="info-circle"
            theme="twoTone" 
            className="btn-icon"
            onClick={() =>
              ViewCampaign.viewOfferUsage(object.id,object.code)
            }
          />
        </Tooltip>}
      </div>
    )
  },
  {
    title: "Created On",
    dataIndex: "created_at",
    align:"left",
    ellipsis:true,
    key: "created_at",
    width:150,
    render:(data)=>DateTimeCell(data)
  },
  {
    title: "Code",
    dataIndex: "code",
    align:"left",
    ellipsis:true,
    key: "code",
    width:200,
  },
  {
    title: "Description",
    width:300,
    ellipsis:true,
    dataIndex: "description",
    key: "description",
    render:data=><span><Tooltip title={data} autoAdjustOverflow={true}><p className="text-ellipsis">{data}</p></Tooltip></span>
  },
  {
    title: "No of transactions",
    align:"left",
    ellipsis:true,
    dataIndex: "no_of_transactions",
    key: "no_of_transactions",
    width:150,
    
  },
  {
    title: "Total fees allowed",
    align:"left",
    ellipsis:true,
    dataIndex: "fees_allowed",
    key: "fees_allowed",
    width:150,
    render: fees => <span>{fees} USD</span>
  },
  {
    title: "Usage",
    dataIndex: "offercode_used",
    align:"left",
    ellipsis:true,
    key: "offercode_used",
    width:75
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    align:"left",
    ellipsis:true,
    key: "start_date",
    width:150,
    render: start_date => OfferDateCell(start_date)
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    align:"left",
    ellipsis:true,
    key: "end_date",
    width:150,
    render: end_date => OfferDateCell(end_date)
  },
  {
    title: "User",
    dataIndex: "user_data",
    key: "user_data",
    align:"left",
    ellipsis:true,
    width:200,
    render: data =>
      data.id ? (
        <a target="_blanck" href={`/dashboard/users/${data.id}`}>
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
    align:"left",
    ellipsis:true,
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
    align:"left",
    ellipsis:true,
    key: "end_date",
    width:100,
    render: (end_date) => {
    let [today,exp_date]=[moment().startOf('day'),moment(end_date).startOf('day')]
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
              <span>Created On</span>
            </Col>
            <Col span={16}>{DateTimeCell(campaignDetails.created_at)}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <span>Total number of transactions allowed</span>
            </Col>
            <Col span={16}>{campaignDetails.no_of_transactions}</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <span>Total fees allowed</span>
            </Col>
            <Col span={16}>{campaignDetails.fees_allowed} USD</Col>
          </CampRow>
          <CampRow>
            <Col span={8}>
              <span>Type</span>
            </Col>
            <Col span={16}>{campaignDetails.usage==1?'Single code use':'Multiple code use'}</Col>
          </CampRow>
          {campaignDetails.start_date && <CampRow>
            <Col span={8}>
              <span>Start Date</span>
            </Col>
            <Col span={16}>
              {OfferDateCell(campaignDetails.start_date)}
            </Col>
          </CampRow>}
          {campaignDetails.end_date && <CampRow>
            <Col span={8}>
              <span>End Date</span>
            </Col>
            <Col span={16}>
              {OfferDateCell(campaignDetails.end_date)}
            </Col>
          </CampRow>}
          <CampRow>
            <Col span={8}>
              <span>Campaign Status</span>
            </Col>
            <Col span={16}>
              <Tag className="cursor-default" color={campaignDetails.is_active ?'geekblue' : 'grey'}> {campaignDetails.is_active ? "Active" : "Inactive"}</Tag>
            </Col>
          </CampRow>
          <div className='mg-top-15'>
            <Divider orientation="left">Offers</Divider>
            <TableWrapper bordered scroll={TABLE_SCROLL_HEIGHT} dataSource={campaignDetails.campaign_offers} bordered pagination={false} columns={tableColumns}/>
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
