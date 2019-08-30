import React, { Component } from 'react';
import { notification, Input, Tabs } from 'antd';
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import LayoutContentWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { assetTableInfos } from "../../Tables/antTables";

const { logout } = authAction;
const Search = Input.Search;
const TabPane = Tabs.TabPane;

class BatchBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allBatches: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
        }
    }

    componentDidMount = () => {
        this._getAllBatches();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllBatches = () => {
        const { token } = this.props;
        const { searchBatch } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllWallets(token, searchBatch)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allBatches: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
            this._getAllBatches();
        })
    }

    _searchBatchData = (val) => {
        this.setState({ searchBatch: val }, () => {
            this._getAllBatches();
        });
    }

    _changeRow = (e) => {
        e.preventDefault();
    }

    render() {
        const { allBatches, errType, errMsg, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <LayoutContentWrapper>
                    <TableDemoStyle className="isoLayoutContent">
                        <Tabs className="isoTableDisplayTab">
                            <div style={{ "display": "inline-block", "width": "100%" }}>
                                <Search
                                    placeholder="Search assets"
                                    onSearch={(value) => this._searchBatchData(value)}
                                    style={{ "float": "right", "width": "250px" }}
                                    enterButton
                                />
                            </div>
                            {assetTableInfos.map(tableInfo => (
                                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                    <div className="isoTableDisplayTab">
                                        {loader && <FaldaxLoader />}

                                        <TableWrapper
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: () => { this._changeRow.bind(this) },
                                                };
                                            }}
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allBatches}
                                            onChange={this.handleTableChange}
                                            className="isoCustomizedTable"
                                        />
                                    </div>
                                </TabPane>
                            ))}
                        </Tabs>
                    </TableDemoStyle>
                </LayoutContentWrapper>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(BatchBalance);
