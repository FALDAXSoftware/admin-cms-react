import React from 'react';
import { Tabs } from 'antd';
import PendingRequests from './pendingTierRequests';
import RejectedRequests from './rejectedTierRequests';
import ApprovedRequests from './approvedTierRequests';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';

const { TabPane } = Tabs;
const { logout } = authAction;

class AllRequests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPendingReq: [],
        }
    }

    componentDidMount = () => {
        this._getAllTierRequests();
    }

    _getAllTierRequests = () => {
        const { token } = this.props;
        const { sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getAllTierRequests(token, sorterCol, sortOrder)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({
                        allPendingReq: res.getUserPendingTierData,
                        allApprovedReq: res.getUserApprovedTierData,
                        allRejectedReq: res.getUserRejectedTierData
                    });
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

    render() {
        const { allPendingReq, allApprovedReq, allRejectedReq } = this.state;
        return (
            <React.Fragment>
                <Tabs className="orders-tab" defaultActiveKey="1" size={'large'}>
                    <TabPane tab="Pending Requests" key="1"><PendingRequests data={allPendingReq} /></TabPane>
                    <TabPane tab="Approved Requests" key="2"><ApprovedRequests data={allApprovedReq} /></TabPane>
                    <TabPane tab="Rejected Requests" key="3"><RejectedRequests data={allRejectedReq} /></TabPane>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(AllRequests);

