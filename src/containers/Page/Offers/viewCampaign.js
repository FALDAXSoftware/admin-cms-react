import React, { Component } from "react";
import { Link } from "react-router-dom";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import { connect } from "react-redux";
import { notification, Row, Col ,Table,Divider,Tag} from "antd";
import Loader from "../faldaxLoader";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import moment from "moment";
import styled from "styled-components";
import { DateCell ,HistoryDateCell} from "../../../components/tables/helperCells";
const tableColumns=[
  {
    title:"Code",
    dataIndex: 'code',
    key: 'code',
  },
  {
    title:"Description",
    dataIndex: 'description',
    key: 'description',
  },
  {
    title:"No of transactions",
    dataIndex: 'no_of_transactions',
    key: 'no_of_transactions',
  },
  {
    title:"Total fees allowed",
    dataIndex: 'fees_allowed',
    key: 'fees_allowed',
    render:(fees)=><span>{fees} USD</span>
  },
  {
    title:"Start Date",
    dataIndex: 'start_date',
    key: 'start_date',
    render:(start_date)=>HistoryDateCell(start_date)
  },
  {
    title:"End Date",
    dataIndex: 'end_date',
    key: 'end_date',
    render:(end_date)=>HistoryDateCell(end_date)
  },
  {
    title:"Code Used",
    dataIndex: 'offercode_used',
    key: 'offercode_used'
  },
  {
    title:"User id",
    dataIndex: 'user_id',
    key: 'user_id',
  },
  {
    title:"Status",
    dataIndex: 'is_active',
    key: 'is_active',
    render:(status)=>(
      <span>
            <Tag color={status==true? 'geekblue' : 'grey'} key={status}>
            {status==true? 'Active' : 'DeActive'}
            </Tag>
      </span>
    )
  },
]

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
              {HistoryDateCell(campaignDetails.start_date)}
            </Col>
          </CampRow>}
          {campaignDetails.end_date && <CampRow>
            <Col span={8}>
              <detailHead>End Date</detailHead>
            </Col>
            <Col span={16}>
              {HistoryDateCell(campaignDetails.end_date)}
            </Col>
          </CampRow>}
          <CampRow>
            <Col span={8}>
              <detailHead>Campaign Status</detailHead>
            </Col>
            <Col span={16}>
              <Tag color={campaignDetails.is_active ?'geekblue' : 'grey'}> {campaignDetails.is_active ? "Active" : "Inactive"}</Tag>
            </Col>
          </CampRow>
          <div className='mg-top-15'>
            <Divider orientation="left">Offers</Divider>
            <Table dataSource={campaignDetails.campaign_offers} bordered pagination={false} columns={tableColumns}/>
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
