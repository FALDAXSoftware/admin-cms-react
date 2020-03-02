import React, { Component } from "react";
import { Row, Col, notification, Card, Divider } from "antd";
// import LayoutWrapper from "../../../components/utility/layoutWrapper.js"
import basicStyle from "../../../settings/basicStyle";
import ApiUtils from "../../../helpers/apiUtills";
import { connect } from "react-redux";
import { Pie } from "react-chartjs-2";
import ContentHolder from "../../../components/utility/contentHolder";
import styled from "styled-components";
import { palette } from "styled-theme";
import CountCard from "../../Widgets/card/count-widget";
import { Link } from "react-router-dom";
import authAction from "../../../redux/auth/actions";
import { DatePicker } from "antd";
import moment from "moment";
import FaldaxLoader from "../faldaxLoader";
import CardView from "../cardView";
import FeeChart from "../feeChart";
import TransactionMapChart from "../transactionMapChart";

const { logout } = authAction;
const { RangePicker } = DatePicker;

const CardWrapper = styled(Card)`
  width: 100%;
  & .ant-card-body {
    min-height: 219px;
  }
`;
const ChartWrapper = styled.div`
  height: 219px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .isoChartControl {
    display: flex;
    align-items: center;
    margin-left: ${props => (props["data-rtl"] === "rtl" ? "inherit" : "auto")};
    margin-right: ${props =>
    props["data-rtl"] === "rtl" ? "auto" : "inherit"};
    margin-bottom: 20px;

    span {
      font-size: 13px;
      color: ${palette("text", 1)};
      font-weight: 400;
      margin-right: ${props =>
    props["data-rtl"] === "rtl" ? "inherit" : "15px"};
      margin-left: ${props =>
    props["data-rtl"] === "rtl" ? "15px" : "inherit"};
    }

    button {
      border: 1px solid ${palette("border", 0)};
      padding: 0 10px;
      border-radius: 0;
      position: relative;

      span {
        margin: 0;
      }

      &:last-child {
        margin-left: ${props =>
    props["data-rtl"] === "rtl" ? "inherit" : "-1px"};
        margin-right: ${props =>
    props["data-rtl"] === "rtl" ? "-1px" : "inherit"};
      }

      &:hover {
        color: ${palette("primary", 0)};
        border-color: ${palette("primary", 0)};
        z-index: 1;

        span {
          color: ${palette("primary", 0)};
        }
      }
    }
  }
`;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUsers: 0,
      inactiveUsers: 0,
      deletedUsers: 0,
      activeCoins: 0,
      InactiveCoins: 0,
      referralCount: 0,
      activePairs: 0,
      InactivePairs: 0,
      legalCountries: 0,
      illegalCountries: 0,
      neutralCountries: 0,
      employeeCount: 0,
      jobsCount: 0,
      withdrawReqCount: 0,
      kyc_disapproved: 0,
      kyc_approved: 0,
      total_kyc: 0,
      kyc_pending: 0,
      errMsg: false,
      errMessage: "",
      startDate: "",
      endDate: "",
      rangeDate: [],
      loader: false,
    };
  }

  openNotificationWithIconError = type => {
    notification[type]({
      message: "Error",
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  componentDidMount() { 
      this._getAllCount();
  }

  _getAllCount = () => {
    const { token } = this.props;
    const { startDate, endDate } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllCount(token, startDate, endDate)
      .then(response => response.json())
      .then(function (res) {
        if (res) {
          if (res.status == 200) {
            let feesLabels = [];
            let faldaxFees = [];
            let residualFees = [];
            let transactionSymbols = [];
            let transactionCount = [];
            res.walletFeesTransactionValue &&
              res.walletFeesTransactionValue.forEach((value)=> {
                feesLabels.push(value.coin_code.toUpperCase());
                faldaxFees.push(value.faldax_fee);
                residualFees.push(value.residual_amount);
              });
            res.transactionValue &&
              res.transactionValue.forEach(function (value, key) {
                transactionSymbols.push(value.symbol);
                transactionCount.push(value.count);
              });
            const {
              activeUsers,
              inactiveUsers,
              activeCoins,
              InactiveCoins,
              activePairs,
              InactivePairs,
              legalCountries,
              illegalCountries,
              PartialCountries,
              neutralCountries,
              activeEmployeeCount,
              jobsCount,
              inactiveEmployeeCount,
              withdrawReqCount,
              kyc_disapproved,
              kyc_approved,
              total_kyc,
              kyc_pending,
              withdrawReqCountValue,
              deletedUsers,
              userSignUpCountValue
            } = res;
            _this.setState({
              activeUsers,
              inactiveUsers,
              activeCoins,
              InactiveCoins,
              activePairs,
              InactivePairs,
              legalCountries,
              PartialCountries,
              illegalCountries,
              neutralCountries,
              activeEmployeeCount,
              deletedUsers,
              inactiveEmployeeCount,
              jobsCount,
              withdrawReqCount,
              kyc_disapproved,
              kyc_approved,
              total_kyc,
              kyc_pending,
              loader: false,
              withdrawReqCountValue,
              userSignUpCountValue,
              feesLabels,
              faldaxFees,
              residualFees,
              transactionSymbols,
              transactionCount
            });
          } else if (res.status == 403 || res.status == 401) {
            _this.setState({
              errMsg: true,
              message: res.err,
              loader: false
            },()=>_this.props.logout());
            
          } else {
            _this.setState({
              errMsg: true,
              message: res.message,
              loader: false
            });
          }
        } else {
          _this.setState({ errMsg: true, message: res.message, loader: false });
        }
      })
      .catch(err => {
        console.error("error occured", err);
      });
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  isabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  };

  _changeDate = (date, dateString) => {
    this.setState(
      {
        rangeDate: date,
        startDate:
          date.length > 0
            ? moment(date[0])
              .startOf("d")
              .toISOString()
            : "",
        endDate:
          date.length > 0
            ? moment(date[1])
              .endOf("d")
              .toISOString()
            : ""
      },
      () => {
        this._getAllCount();
      }
    );
  };

  render() {
    const { rowStyle } = basicStyle;
    const {
      activeUsers,
      inactiveUsers,
      activeCoins,
      InactiveCoins,
      // activePairs,
      // InactivePairs,
      legalCountries,
      illegalCountries,
      PartialCountries,
      neutralCountries,
      activeEmployeeCount,
      inactiveEmployeeCount,
      jobsCount,
      withdrawReqCount,
      kyc_approved,
      kyc_disapproved,
      total_kyc,
      kyc_pending,
      rangeDate,
      loader,
      withdrawReqCountValue,
      userSignUpCountValue,
      feesLabels,
      faldaxFees,
      residualFees,
      deletedUsers,
      transactionSymbols,
      transactionCount,
    } = this.state;

    const data = {
      labels: ["Legal", "Illegal", "Neutral", "Partial Services"],
      datasets: [
        {
          data: [
            legalCountries,
            illegalCountries,
            neutralCountries,
            PartialCountries
          ],
          backgroundColor: ["#00a9fa", "#f6776e", "#00a9fb", "#FCD26E"],
          hoverBackgroundColor: ["#00a9fa", "#f6776e", "#00a9fb", "#FCD26E"]
        }
      ]
    };

    // const transactionData = {
    //   labels: [
    //     "Total Last 7 days",
    //     "Grand Total Last 7 days",
    //     "Average Per day",
    //     "Total Last 30 days"
    //   ],
    //   datasets: [
    //     {
    //       data: [
    //         legalCountries,
    //         illegalCountries,
    //         neutralCountries,
    //         neutralCountries
    //       ],
    //       backgroundColor: ["#B04387", "#EDED16", "#D2601F", "#B95671"],
    //       hoverBackgroundColor: ["#B04387", "#EDED16", "#D2601F", "#B95671"]
    //     }
    //   ]
    // };

    // const tradeData = {
    //   labels: [
    //     "Total Last 7 days",
    //     "Grand Total Last 7 days",
    //     "Average Per day",
    //     "Total Last 30 days"
    //   ],
    //   datasets: [
    //     {
    //       data: [
    //         legalCountries,
    //         illegalCountries,
    //         neutralCountries,
    //         neutralCountries
    //       ],
    //       backgroundColor: ["#B04387", "#EDED16", "#D2601F", "#B95671"],
    //       hoverBackgroundColor: ["#B04387", "#EDED16", "#D2601F", "#B95671"]
    //     }
    //   ]
    // };

    const kycData = {
      labels: ["Total IDs under review", "Total IDs approved", "Total IDs declined"],
      datasets: [
        {
          data: [kyc_pending, kyc_approved, kyc_disapproved],
          backgroundColor: ["#E929DD", "#D2601F", "#B95671"],
          hoverBackgroundColor: ["#E929DD", "#D2601F", "#B95671"]
        }
      ]
    };

    return (
      <>
        {loader && <FaldaxLoader />}
        {/* <BreadcrumbComponent {...this.props}/> */}
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={12} xs={24}>
            <CardWrapper title="Country">
              <ChartWrapper>
                <ContentHolder>
                  <Pie data={data} />
                </ContentHolder>
              </ChartWrapper>
            </CardWrapper>
          </Col>

          <Col md={12} xs={24}>
            <CardWrapper title="Customer ID Verifications">
              <ChartWrapper>
                <RangePicker
                  value={rangeDate}
                  disabledTime={this.disabledRangeTime}
                  onChange={this._changeDate}
                  format="YYYY-MM-DD"
                  style={{ marginBottom: "15px" }}
                />
                <Row style={{ width: "100%" }}>
                  <Col span={12}>
                    <b>Total IDs: {total_kyc}</b>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <a
                      href="https://edna.identitymind.com/merchantedna/"
                      target="_blank"
                    >
                      View all Applications
                    </a>
                  </Col>
                </Row>
                <ContentHolder>
                  {total_kyc > 0 ? <Pie data={kycData} /> : "NO DATA FOUND"}
                </ContentHolder>
              </ChartWrapper>
            </CardWrapper>
          </Col>
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          {/* <Col md={12} xs={24} >
                        <Card title="KYC">
                            <span>Grand Total</span>
                            <Progress percent={30} size="small" format={percent => `${percent}`} />
                            <span>Total Outstanding</span>
                            <Progress percent={40} size="small" format={percent => `${percent}`} />
                            <span>Total Approved</span>
                            <Progress percent={kyc_approved} size="small" format={percent => `${percent}`} />
                            <span>Total Dis-Approved</span>
                            <Progress percent={kyc_disapproved} size="small" format={percent => `${percent}`} />
                        </Card>
                    </Col> */}

          <Col md={12} xs={24}>
            <CardWrapper>
              <span>
                <b>Fees collected in last 30 days</b>
              </span>
              <ChartWrapper>
                <FeeChart
                  feesLabels={feesLabels}
                  faldaxFees={faldaxFees}
                  residualFees={residualFees}
                />
              </ChartWrapper>
            </CardWrapper>
          </Col>

          <Col md={12} xs={24}>
            <CardWrapper>
              <span>
                <b>Transactions</b>
              </span>
              <ChartWrapper>
                <TransactionMapChart
                  transactionSymbols={transactionSymbols}
                  transactionCount={transactionCount}
                />
              </ChartWrapper>
            </CardWrapper>
          </Col>
        </Row>

        {/* <Row style={rowStyle} gutter={0} justify="start">
                    <Col md={12} xs={24} >
                        <IsoWidgetsWrapper>
                            <span><b>Transactions</b></span>
                            <ChartWrapper>
                                <TransactionMapChart transactionSymbols={transactionSymbols}
                                    transactionCount={transactionCount} />
                            </ChartWrapper>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row> */}
        <Divider />
        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/users">
              <CountCard
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title={"Users"}
                data={[
                  { name: "Active Users", count: activeUsers },
                  { name: "Suspended Users", count: inactiveUsers },
                  { name: "Deactivated Users", count: deletedUsers }
                ]}
                icon="fa fa-users"
                fontColor="#2d3446"
                {...this.props}
              />
            </Link>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/assets">
              <CountCard
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                data={[
                  { name: "Active Assets", count: activeCoins },
                  { name: "Inactive Assets", count: InactiveCoins }
                ]}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title={"Assets"}
                icon="fa fa-coins"
                fontColor="#ffffff"
              />
            </Link>
          </Col>

          {/* <Col lg={6} md={12} sm={12} xs={24} >
                    <Link target="_blank" to="/dashboard/pairs">
                      <CountCard
                        data={[{name:"Active Pair",count:activePairs},{name:"Inactive Pair",count:InactivePairs}]}
                        headcolor={"#1f2431"}
                        bgcolor={"#fff"}
                        style={{
                          boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                        }}
                        title={"Pairs"}
                        icon="fa fa-coins"
                        fontColor="#ffffff"
                      />
                    </Link>
                  </Col> */}

          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/employee">
              <CountCard
                data={[
                  { name: "Active Employee", count: activeEmployeeCount },
                  { name: "Inactive Employee", count: inactiveEmployeeCount }
                ]}
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title={"Employees"}
                icon="fas fa-user-tie"
                fontColor="#ffffff"
              />
            </Link>
          </Col>

          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/jobs">
              <CardView
                cardText={"Active Job Applications"}
                cardTitle={"Job Applications"}
                icon={"fa fa-suitcase-rolling"}
                countNumber={jobsCount}
              />
            </Link>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/kyc">
              <CountCard
                data={[
                  { name: "Approved Customer ID", count: kyc_approved },
                  { name: "Disapproved Customer ID", count: kyc_disapproved }
                ]}
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title="Customer ID Verification"
                icon="fa fa-id-card"
                fontColor="#ffffff"
              />
            </Link>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/withdraw-requests">
              <CountCard
                data={[
                  {
                    name: "Last 7 Days Withdrawal Request",
                    count: withdrawReqCount
                  },
                  {
                    name: "Pending Withdrawal Request",
                    count: withdrawReqCountValue
                  }
                ]}
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title="Withdrawal Request"
                icon="fas fa-hand-holding-usd"
                fontColor="#ffffff"
              />
            </Link>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/users">
              <CardView
                cardText={"Signed up Users"}
                cardTitle={"24 hours Signed up Users"}
                icon={"fa fa-users"}
                countNumber={userSignUpCountValue}
              />
            </Link>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Link target="_blank" to="/dashboard/countries">
              <CountCard
                data={[
                  { name: "Legal Countries", count: legalCountries },
                  { name: "Illegal Countries", count: illegalCountries },
                  { name: "Neutral Countries", count: neutralCountries },
                  { name: "Partial Countries", count: PartialCountries }
                ]}
                headcolor={"#1f2431"}
                bgcolor={"#fff"}
                style={{
                  boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);"
                }}
                title="Countries"
                icon="fa fa-flag"
                fontColor="#ffffff"
              />
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(Dashboard);
