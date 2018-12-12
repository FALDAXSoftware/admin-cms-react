import React, { Component } from 'react';
import { Row, Col, notification, Card } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
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
            userCount: 0,
            coinCount: 0,
            pagesCount: 0,
            referralCount: 0,
            pairCount: 0,
            legalCountries: 0,
            illegalCountries: 0,
            neutralCountries: 0,
            blogsCount: 0,
            employeeCount: 0,
            jobsCount: 0,
            coinReqCount: 0,
            subscriberCount: 0,
            withdrawReqCount: 0,
            lastSevenInquiry: 0,
            lastThirtyInquiry: 0,
            errMsg: false,
            errMessage: ''
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
                    const {
                        userCount, coinCount, pairCount, legalCountries, illegalCountries,
                        neutralCountries, blogsCount, employeeCount, jobsCount,
                        coinReqCount, subscriberCount, withdrawReqCount, lastSevenInquiry, lastThirtyInquiry
                    } = res;
                    _this.setState({
                        userCount, coinCount, pairCount, legalCountries,
                        illegalCountries, neutralCountries, blogsCount, employeeCount,
                        jobsCount, coinReqCount, subscriberCount, withdrawReqCount,
                        lastSevenInquiry, lastThirtyInquiry

                    });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    render() {
        const { rowStyle, colStyle } = basicStyle;
        const { userCount, coinCount, pairCount, legalCountries, illegalCountries,
            neutralCountries, blogsCount, employeeCount, jobsCount, coinReqCount,
            subscriberCount, withdrawReqCount, lastSevenInquiry, lastThirtyInquiry
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
            labels: ['Grand Total', 'Total Outstanding', 'Total Approved', 'Total Disapproved'],
            datasets: [{
                data: [legalCountries, illegalCountries, neutralCountries, neutralCountries],
                backgroundColor: ['#57ED16', '#E929DD', '#D2601F', '#B95671'],
                hoverBackgroundColor: ['#57ED16', '#E929DD', '#D2601F', '#B95671']
            }]
        }

        return (
            <LayoutWrapper>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col md={12} xs={24} style={colStyle}>
                        <Card title="Country">
                            <ChartWrapper>
                                <ContentHolder>
                                    <Pie data={data} />
                                </ContentHolder>
                            </ChartWrapper>
                        </Card>
                    </Col>

                    <Col md={12} xs={24} style={colStyle}>
                        <Card title="KYC">
                            <ChartWrapper>
                                <ContentHolder>
                                    <Doughnut data={kycData} />
                                </ContentHolder>
                            </ChartWrapper>
                        </Card>
                    </Col>
                </Row>

                {/*<Row style={rowStyle} gutter={0} justify="start">
                    <Col md={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <span><b>KYC:</b></span>
                            <ChartWrapper>
                                <ContentHolder>
                                    <Doughnut data={kycData} />
                                </ContentHolder>
                            </ChartWrapper>
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col md={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <span><b>Trade History:</b></span>
                            <ChartWrapper>
                                <ContentHolder>
                                    <Pie data={tradeData} />
                                </ContentHolder>
                            </ChartWrapper>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row> */}

                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={userCount}
                                text={<IntlMessages id="widget.stickerwidget1.user" />}
                                icon="fa fa-users"
                                fontColor="#ffffff"
                                bgColor="#7266BA"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={coinCount}
                                text={<IntlMessages id="widget.stickerwidget2.coins" />}
                                icon="fa fa-coins"
                                fontColor="#ffffff"
                                bgColor="#42A5F6"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={pairCount}
                                text={<IntlMessages id="widget.stickerwidget3.staticPages" />}
                                icon="ion-document"
                                fontColor="#ffffff"
                                bgColor="#7ED320"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={blogsCount}
                                text={'Total Blogs'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={employeeCount}
                                text={'Total Employees'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={jobsCount}
                                text={'Total Jobs'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={coinReqCount}
                                text={'Total Coin Requests'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={subscriberCount}
                                text={'Total Subscribers'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={withdrawReqCount}
                                text={'Total Withdraw Requests'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={lastSevenInquiry}
                                text={'Last Seven Days Inquiry'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={lastThirtyInquiry}
                                text={'Last Thirty Days Inquiry'}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
            </LayoutWrapper >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Dashboard);
