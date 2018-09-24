import React, { Component } from 'react';
import { Row, Col } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';
import { dataList } from "../Tables/antTables";
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import StickerWidget from "../Widgets/sticker/sticker-widget";
import IsoWidgetsWrapper from "../Widgets/widgets-wrapper";
import basicStyle from "../../settings/basicStyle";
import ApiUtils from '../../helpers/apiUtills';
import clone from "clone";

const tableDataList = clone(dataList);
tableDataList.size = 5;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            allUserCount: 0,
            coinsCount: 0,
            pagesCount: 0,
            referralCount: 0
        }
    }

    componentDidMount() {
        //  this._getAllCount();
    }

    _getAllCount = () => {
        const { isLoggedIn } = this.props;

        ApiUtils.getAllCount(isLoggedIn)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status === "SUCCESS") {
                    const { allUserCount, coinsCount, pagesCount, referralCount } = res.data;
                    this.setState({ allUserCount, coinsCount, pagesCount, referralCount });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    render() {
        const { rowStyle, colStyle } = basicStyle;
        const { allUserCount } = this.state;

        return (
            <LayoutWrapper>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <StickerWidget
                                number={allUserCount}
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
                                number={<IntlMessages id="widget.stickerwidget1.number" />}
                                text={<IntlMessages id="widget.stickerwidget2.coins" />}
                                icon="ion-android-camera"
                                fontColor="#ffffff"
                                bgColor="#42A5F6"
                            />
                        </IsoWidgetsWrapper>
                    </Col>

                    <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
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
                                text={<IntlMessages id="widget.stickerwidget4.emailTemplates" />}
                                icon="ion-android-mail"
                                fontColor="#ffffff"
                                bgColor="#F75D81"
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
                    </Col>
                </Row>
            </LayoutWrapper>
        );
    }
}

export default Dashboard;
