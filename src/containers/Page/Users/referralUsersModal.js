import React, { Component } from 'react';
import { Tabs, Pagination, Modal } from 'antd';
import { connect } from 'react-redux';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { referralInfos } from "../../Tables/antTables";

const TabPane = Tabs.TabPane;

class ReferralUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReferralModal: this.props.showReferralModal,
            allReferral: this.props.allReferral,
            allReferralCount: this.props.allReferralCount,
            userId: this.props.userId
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== this.props) {
            return {
                allReferral: nextProps.allReferral,
                allReferralCount: nextProps.allReferralCount,
                showReferralModal: nextProps.showReferralModal,
                userId: nextProps.userId
            }
        }
        return null;
    }

    _handleReferralPagination = (page) => {
        this.props.getAllReferredUsers(page - 1, this.state.userId);
    }

    _closeReferralModal = () => {
        this.setState({ showReferralModal: false })
        this.props.closeReferalModal();
    }

    render() {
        const { allReferral, allReferralCount, showReferralModal } = this.state;

        return (
            <Modal
                title="View Referred Users"
                visible={showReferralModal}
                onCancel={this._closeReferralModal}
                onOk={this._closeReferralModal}
            >
                {
                    allReferralCount > 0 ?
                        <Tabs className="isoTableDisplayTab">
                            {
                                referralInfos.map(tableInfo => (
                                    <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                        <TableWrapper
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allReferral}
                                            className="isoCustomizedTable"
                                        />
                                        <Pagination
                                            style={{ marginTop: '15px' }}
                                            className="ant-users-pagination"
                                            onChange={this._handleReferralPagination.bind(this)}
                                            pageSize={10}
                                            defaultCurrent={1}
                                            total={allReferralCount}
                                        />
                                    </TabPane>
                                ))
                            }
                        </Tabs>
                        : 'No Data'
                }
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(ReferralUsers);
