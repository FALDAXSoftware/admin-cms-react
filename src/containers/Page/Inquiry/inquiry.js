import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin, Modal, Button } from 'antd';
import { inquiryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewInquiryModal from './viewInquiry';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class Inquiry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allInquiries: [],
            allInquiryCount: 0,
            searchInquiry: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            inquiryDetails: [],
            showViewInquiryModal: false,
            showDeleteInquiryModal: false,
            deleteInquiryId: ''
        }
        self = this;
        Inquiry.viewInquiry = Inquiry.viewInquiry.bind(this);
        Inquiry.deleteInquiry = Inquiry.deleteInquiry.bind(this);
    }

    componentDidMount = () => {
        this._getAllInquiries();
    }

    static viewInquiry(value, first_name, last_name, email, message, created_at) {
        let inquiryDetails = {
            value, first_name, last_name, email, message, created_at
        }
        self.setState({ inquiryDetails, showViewInquiryModal: true })
    }

    static deleteInquiry(value) {
        self.setState({ showDeleteInquiryModal: true, deleteInquiryId: value });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllInquiries = () => {
        const { token } = this.props;
        const { limit, searchInquiry, page } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllInquiries(page, limit, token, searchInquiry)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        allInquiries: res.data, allInquiryCount: res.inquiryCount, searchInquiry: ''
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchInquiry: '' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    searchInquiry: '', errType: 'error', loader: false
                });
            });
    }

    _deleteInquiry = () => {
        const { token } = this.props;
        const { deleteInquiryId } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.deleteInquiry(token, deleteInquiryId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteInquiryId: '', errMsg: true, errMessage: res.message, errType: 'Success'
                    });
                    _this._closeDeleteInquiryModal();
                    _this._getAllInquiries();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _searchInquiry = (val) => {
        this.setState({ searchInquiry: val, page: 1 }, () => {
            this._getAllInquiries();
        });
    }

    _handleInquiryPagination = (page) => {
        this._getAllInquiries(page);
        this.setState({ page })
    }

    _closeViewInquiryModal = () => {
        this.setState({ showViewInquiryModal: false })
    }

    _closeDeleteInquiryModal = () => {
        this.setState({ showDeleteInquiryModal: false });
    }

    render() {
        const { allInquiries, allInquiryCount, errType, loader, errMsg,
            page, inquiryDetails, showViewInquiryModal, showDeleteInquiryModal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {inquiryTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search inquiries"
                                        onSearch={(value) => this._searchInquiry(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <ViewInquiryModal
                                        inquiryDetails={inquiryDetails}
                                        showViewInquiryModal={showViewInquiryModal}
                                        closeViewInquiryModal={this._closeViewInquiryModal}
                                    />
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allInquiries}
                                        className="isoCustomizedTable"
                                    />
                                    {allInquiryCount.length > 0 ? <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleInquiryPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allInquiryCount}
                                    /> : ''}
                                    {showDeleteInquiryModal &&
                                        <Modal
                                            title="Delete Inquiry"
                                            onCancel={this._closeDeleteInquiryModal}
                                            visible={showDeleteInquiryModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteInquiryModal}>No</Button>,
                                                <Button onClick={this._deleteInquiry}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this inquiry ?
                                    </Modal>
                                    }
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Inquiry);

export { Inquiry, inquiryTableInfos };
