import React, { Component } from 'react';
import { Tabs, Pagination, Modal } from 'antd';
import LayoutWrapper from "../../../components/utility/layoutContent";
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";

const TabPane = Tabs.TabPane;

class ReferralUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReferralModal: this.props.showReferralModal,
            allReferral: [],
            allReferralCount: 0,
            userId: this.props.userId
        }
    }

    componentDidMount() {
        this._getAllReferral();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== this.props) {
            return {
                showReferralModal: nextProps.showReferralModal,
                userId: nextProps.userId
            }
        }
        return null;
    }

    _handleReferralPagination = (page) => {

    }

    _getAllReferral = () => {
        const { token } = this.props;
        const { userId } = this.state;

        ApiUtils.getAllReferrals(token, userId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    const { allReferral, allReferralCount } = res.data;
                    this.setState({ allReferral, allReferralCount });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _closeReferralModal = () => {
        this.setState({ showReferralModal: false })
        this.props.closeReferalModal();
    }

    render() {
        const { allReferral, allReferralCount, showReferralModal } = this.state;

        return (
            <Modal
                title="View User"
                visible={showReferralModal}
                onCancel={this._closeReferalModal}
                onOk={this._closeReferralModal}
            >
                <LayoutWrapper>
                    <TableDemoStyle className="isoLayoutContent">
                        <Tabs className="isoTableDisplayTab">
                            {referralInfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allReferral}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        className="ant-users-pagination"
                                        onChange={this._handleReferralPagination.bind(this)}
                                        pageSize={5}
                                        defaultCurrent={1}
                                        total={allReferralCount}
                                    />
                                </TabPane>
                            ))}
                        </Tabs>
                    </TableDemoStyle>
                </LayoutWrapper>
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(ReferralUsers);
