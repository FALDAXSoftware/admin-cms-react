import React, { Component } from 'react';
import { Tabs, notification, Icon, Spin } from 'antd';
import { feesTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var self;

class Fees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allFees: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            feesDetails: []
        }
        self = this;
        Fees.deleteFee = Fees.deleteFee.bind(this);
        Fees.editFees = Fees.editFees.bind(this);
        Fees.feeStatus = Fees.feeStatus.bind(this);
    }

    static editFees(value, name, maker_fee, taker_fee, created_at, is_active) {
        let feesDetails = {
            value, name, maker_fee, taker_fee, created_at, is_active
        }
        // self.setState({ feesDetails, showViewUserModal: true });
    }

    static deleteFee(value) {
        // self._getAllReferredUsers(value, 0)
    }

    static feeStatus(value, name, maker_fee, taker_fee, created_at, is_active) {
        const { token } = this.props;

        let formData = {
            id: value,
            name,
            is_active: !is_active
        };

        ApiUtils.activateUser(token, formData)
            .then((res) => res.json())
            .then(() => {
                //self._getAllUsers(0);
                self.setState({ page: 1 })
            })
            .catch(() => {
                self.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    componentDidMount = () => {
        this._getAllFees();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllFees = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllBlogs(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allFees: res.data });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    render() {
        const { allFees, errType, errMsg } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {feesTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allFees}
                                        className="isoCustomizedTable"
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
    }))(Fees);

export { Fees, feesTableInfos };
