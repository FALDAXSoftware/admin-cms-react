import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { inquiryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

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
            loader: false
        }
    }

    componentDidMount = () => {
        this._getAllInquiries();
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

    _searchInquiry = (val) => {
        this.setState({ searchInquiry: val, page: 1 }, () => {
            this._getAllInquiries();
        });
    }

    _handleInquiryPagination = (page) => {
        this._getAllInquiries(page);
        this.setState({ page })
    }

    render() {
        const { allInquiries, allInquiryCount, errType, loader, errMsg, page } = this.state;

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
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allInquiries}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleInquiryPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={allInquiryCount}
                                    />
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
