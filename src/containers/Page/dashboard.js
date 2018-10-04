import React, { Component } from 'react';
import { Row, Col, notification } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import StickerWidget from "../Widgets/sticker/sticker-widget";
import IsoWidgetsWrapper from "../Widgets/widgets-wrapper";
import basicStyle from "../../settings/basicStyle";
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: 0,
            coinCount: 0,
            pagesCount: 0,
            referralCount: 0,
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
                    const { userCount, coinCount } = res;
                    _this.setState({ userCount, coinCount });
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
        const { userCount, coinCount } = this.state;

        return (
            <LayoutWrapper>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={userCount}
                                text={<IntlMessages id="widget.stickerwidget1.user" />}
                                icon="ion-person"
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
                                icon="ion-android-camera"
                                fontColor="#ffffff"
                                bgColor="#42A5F6"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    {/* <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={<IntlMessages id="widget.stickerwidget1.number" />}
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
                                number={<IntlMessages id="widget.stickerwidget1.number" />}
                                text={<IntlMessages id="widget.stickerwidget5.referral" />}
                                icon="ion-android-fastforward"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
                            />
                        </IsoWidgetsWrapper>
                    </Col> */}
                </Row>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Dashboard);
