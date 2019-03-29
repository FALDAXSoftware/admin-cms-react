import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import { FeesInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditFeesModal from "./editFeesModal";
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;
var self;

class Fees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allFeesData: [],
            showEditFeesModal: false,
            feesDetails: [],
            notifyMsg: '',
            notify: false,
            errType: '',
            loader: false,
        }
        self = this;
        Fees.editFees = Fees.editFees.bind(this);
    }

    static editFees(value, trade_volume, maker_fee, taker_fee) {
        let feesDetails = {
            value, trade_volume, maker_fee, taker_fee
        }
        self.setState({ feesDetails, showEditFeesModal: true });
    }

    componentDidMount = () => {
        this._getAllFeesData();
    }

    _getAllFeesData = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getFeesData(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allFeesData: res.data });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _closeEditFeesModal = () => {
        this.setState({ showEditFeesModal: false });
    }

    render() {
        const { allFeesData, notify, errType, loader, feesDetails, showEditFeesModal } = this.state;

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {FeesInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
                                {showEditFeesModal && <EditFeesModal
                                    fields={feesDetails}
                                    getAllFees={this._getAllFeesData}
                                    showEditFeesModal={showEditFeesModal}
                                    closeEditFeesModal={this._closeEditFeesModal}
                                />
                                }
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allFeesData}
                                    className="isoCustomizedTable"
                                />
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
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(Fees);

export { Fees }
