import React, { Component } from 'react';
import { Row, Col, notification, Card, Progress } from 'antd';
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import StickerWidget from "../Widgets/sticker/sticker-widget";
import IsoWidgetsWrapper from "../Widgets/widgets-wrapper";
import basicStyle from "../../settings/basicStyle";
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Pie, Doughnut } from 'react-chartjs-2';
import ContentHolder from '../../components/utility/contentHolder';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import CountCard from '../Widgets/card/count-widget';
import { Link } from 'react-router-dom';
import authAction from '../../redux/auth/actions';
import { DatePicker } from 'antd';
import moment from 'moment';

const { logout } = authAction;
const { RangePicker } = DatePicker;

const CardWrapper = styled(Card)`
    & .ant-card-body{
        min-height: 219px;
    }
`

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .isoChartControl {
    display: flex;
    align-items: center;
    margin-left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : 'auto')};
    margin-right: ${props =>
        props['data-rtl'] === 'rtl' ? 'auto' : 'inherit'};
    margin-bottom: 20px;

    span {
      font-size: 13px;
      color: ${palette('text', 1)};
      font-weight: 400;
      margin-right: ${props =>
        props['data-rtl'] === 'rtl' ? 'inherit' : '15px'};
      margin-left: ${props =>
        props['data-rtl'] === 'rtl' ? '15px' : 'inherit'};
    }

    button {
      border: 1px solid ${palette('border', 0)};
      padding: 0 10px;
      border-radius: 0;
      position: relative;

      span {
        margin: 0;
      }

      &:last-child {
        margin-left: ${props =>
        props['data-rtl'] === 'rtl' ? 'inherit' : '-1px'};
        margin-right: ${props =>
        props['data-rtl'] === 'rtl' ? '-1px' : 'inherit'};
      }

      &:hover {
        color: ${palette('primary', 0)};
        border-color: ${palette('primary', 0)};
        z-index: 1;

        span {
          color: ${palette('primary', 0)};
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
            errMessage: '',
            startDate: '',
            endDate: '',
            rangeDate: []
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: 'Error',
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    componentDidMount() {
        this._getAllCount();
    }

    _getAllCount = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllCount(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    if (res.status == 200) {
                        const {
                            activeUsers, inactiveUsers, activeCoins, InactiveCoins, activePairs,
                            InactivePairs, legalCountries, illegalCountries,
                            neutralCountries, employeeCount, jobsCount,
                            withdrawReqCount, kyc_disapproved, kyc_approved,
                            total_kyc, kyc_pending
                        } = res;
                        _this.setState({
                            activeUsers, inactiveUsers, activeCoins, InactiveCoins, activePairs,
                            InactivePairs, legalCountries,
                            illegalCountries, neutralCountries, employeeCount,
                            jobsCount, withdrawReqCount,
                            kyc_disapproved, kyc_approved, total_kyc, kyc_pending
                        });
                    } else if (res.status == 403) {
                        _this.props.logout();
                    } else {
                        _this.setState({ errMsg: true, message: res.message });
                    }
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    isabledRangeTime = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => this.range(0, 60).splice(4, 20),
                disabledMinutes: () => this.range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => this.range(0, 60).splice(20, 4),
            disabledMinutes: () => this.range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    }

    _changeDate = (date, dateString) => {
        this.setState({
            rangeDate: date,
            startDate: moment(date[0]).toISOString(),
            endDate: moment(date[1]).toISOString()
        })
    }

    render() {
        const { rowStyle, colStyle } = basicStyle;
        const { activeUsers, inactiveUsers, activeCoins, InactiveCoins, activePairs,
            InactivePairs, legalCountries, illegalCountries,
            neutralCountries, employeeCount, jobsCount, withdrawReqCount,
            kyc_approved, kyc_disapproved, total_kyc, kyc_pending, rangeDate
        } = this.state;

        const data = {
            labels: ['Legal', 'Illegal', 'Neutral'],
            datasets: [{
                data: [legalCountries, illegalCountries, neutralCountries],
                backgroundColor: ['#62d0c5', '#f6776e', '#b6cbfa'],
                hoverBackgroundColor: ['#62d0c5', '#f6776e', '#b6cbfa']
            }]
        };

        const transactionData = {
            labels: ['Total Last 7 days', 'Grand Total Last 7 days', 'Average Per day', 'Total Last 30 days'],
            datasets: [{
                data: [legalCountries, illegalCountries, neutralCountries, neutralCountries],
                backgroundColor: ['#B04387', '#EDED16', '#D2601F', '#B95671'],
                hoverBackgroundColor: ['#B04387', '#EDED16', '#D2601F', '#B95671']
            }]
        };

        const tradeData = {
            labels: ['Total Last 7 days', 'Grand Total Last 7 days', 'Average Per day', 'Total Last 30 days'],
            datasets: [{
                data: [legalCountries, illegalCountries, neutralCountries, neutralCountries],
                backgroundColor: ['#B04387', '#EDED16', '#D2601F', '#B95671'],
                hoverBackgroundColor: ['#B04387', '#EDED16', '#D2601F', '#B95671']
            }]
        }

        const kycData = {
            labels: ['Total Outstanding', 'Total Approved', 'Total Disapproved'],
            datasets: [{
                data: [kyc_pending, kyc_approved, kyc_disapproved],
                backgroundColor: ['#E929DD', '#D2601F', '#B95671'],
                hoverBackgroundColor: ['#E929DD', '#D2601F', '#B95671']
            }]
        }

        return (
            <LayoutWrapper>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col md={12} xs={24} style={colStyle}>
                        <CardWrapper title="Country" >
                            <ChartWrapper>
                                <ContentHolder>
                                    <Pie data={data} />
                                </ContentHolder>
                            </ChartWrapper>
                        </CardWrapper>
                    </Col>

                    <Col md={12} xs={24} style={colStyle}>
                        <CardWrapper title="KYC">
                            <ChartWrapper>
                                <ContentHolder>
                                    <b>Grand Total:</b> {total_kyc}
                                    <a style={{ float: 'right' }} href="https://edna.identitymind.com/merchantedna/" target="_blank">View all KYC</a>
                                    <RangePicker
                                        value={rangeDate}
                                        disabledTime={this.disabledRangeTime}
                                        onChange={this._changeDate}
                                        format="YYYY-MM-DD"
                                        style={{ marginLeft: '15px' }}
                                    />
                                    <Pie data={kycData} />
                                </ContentHolder>
                            </ChartWrapper>
                        </CardWrapper>
                    </Col>
                </Row>

                {/* <Row style={rowStyle} gutter={0} justify="start">
                    <Col md={12} xs={24} style={colStyle}>
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
                    </Col>

                    {/* <Col md={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <span><b>Trade History:</b></span>
                            <ChartWrapper>
                                <ContentHolder>
                                    <Pie data={tradeData} />
                                </ContentHolder>
                            </ChartWrapper>
                        </IsoWidgetsWrapper>
                    </Col> */}
                {/* </Row>  */}

                <Row style={rowStyle} gutter={0} justify="start" >
                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/users'>
                            <CountCard number={activeUsers}
                                headColor={'#6455b9'}
                                number2={inactiveUsers}
                                bgColor={'#8478cc'}
                                title={'Users'}
                                text={'Active Users'}
                                text2={'Inactive Users'}
                                icon="fa fa-users"
                                fontColor="#ffffff" />
                        </Link></Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/assets'>
                            <CountCard number={activeCoins}
                                headColor={'#EB4278'}
                                number2={InactiveCoins}
                                bgColor={'#F96E9B'}
                                title={'Assets'}
                                text={'Active Assets'}
                                text2={'Inactive Assets'}
                                icon="fa fa-coins"
                                fontColor="#ffffff" />
                        </Link>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/pairs'>
                            <CountCard number={activePairs}
                                headColor={'#0F67BA'}
                                number2={InactivePairs}
                                bgColor={'#3B95EA'}
                                title={'Pairs'}
                                text={'Active Pairs'}
                                text2={'Inactive Pairs'}
                                icon="fa fa-coins"
                                fontColor="#ffffff" />
                        </Link>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/employee'>
                            <IsoWidgetsWrapper>
                                <StickerWidget
                                    number={employeeCount}
                                    text={'Active Employees'}
                                    icon="fas fa-user-tie"
                                    fontColor="#ffffff"
                                    bgColor="#E74C3C"
                                />
                            </IsoWidgetsWrapper>
                        </Link>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/jobs'>
                            <IsoWidgetsWrapper>
                                <StickerWidget
                                    number={jobsCount}
                                    text={'Total Open Jobs'}
                                    icon="fas fa-suitcase-rolling"
                                    fontColor="#ffffff"
                                    bgColor="#F1C40F"
                                />
                            </IsoWidgetsWrapper>
                        </Link>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <Link to='/dashboard/withdraw-requests'>
                            <IsoWidgetsWrapper>
                                <StickerWidget
                                    number={withdrawReqCount}
                                    text={'Last 7 Days Withdraw Requests'}
                                    icon="fas fa-hand-holding-usd"
                                    fontColor="#ffffff"
                                    bgColor="#A569BD"
                                />
                            </IsoWidgetsWrapper>
                        </Link>
                    </Col>
                </Row >
            </LayoutWrapper >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Dashboard);
