import React, { Component } from 'react';
import { Tabs, notification } from 'antd';
import { tierTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import AllRequests from './tierRequests';
import { isAllowed } from '../../../helpers/accessControl';

const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Tiers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTiers: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            tierDetails: [],
            sorterCol: '',
            sortOrder: ''
        }
        self = this;
        Tiers.editTier = Tiers.editTier.bind(this);
    }

    static editTier(value) {
        self.props.history.push('/dashboard/account-tier/' + value)
    }

    componentDidMount = () => {
        if (isAllowed("get_tier_details")) {
            this._getAllTiers();
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllTiers = () => {
        const { token } = this.props;
        const { sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllTiers(token, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allTiers: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _closeEditPairModal = () => {
        this.setState({ showEditPairModal: false })
    }

    render() {
        const { allTiers, errType, errMsg, loader } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                {loader && <FaldaxLoader />}
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {isAllowed("get_tier_details") &&
                            <TabPane tab={tierTableInfos[0].title} key={tierTableInfos[0].value}>
                                <TableWrapper
                                    {...this.state}
                                    columns={tierTableInfos[0].columns}
                                    pagination={false}
                                    dataSource={allTiers}
                                    className="isoCustomizedTable"
                                    onChange={this._handlePairsChange}
                                />
                            </TabPane>
                        }
                        {isAllowed("user_tier_request") &&
                            <TabPane tab="Tier Requests" key="2"><AllRequests /></TabPane>
                        }
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Tiers);

export { Tiers, tierTableInfos };
