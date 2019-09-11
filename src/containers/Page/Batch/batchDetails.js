import React, { Component } from 'react';
import { Tabs } from 'antd';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import SummaryBatch from './summaryBatch';
import PurchaseBatch from './purchaseBatch';
import authAction from '../../../redux/auth/actions';
import { Link } from 'react-router-dom';

const { logout } = authAction;
const { TabPane } = Tabs;

class BatchDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchDetails: []
        }
    }

    componentDidMount = () => {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let batch_id = path[path.length - 1]
        this._getBatchDetails(batch_id);
    }

    _getBatchDetails = (batch_id) => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getBatchDetails(token, batch_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ batchDetails: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    render() {
        const { batchDetails } = this.state;

        return (
            <div>
                <div style={{ "display": "inline-block", "width": "100%", marginLeft: '20px' }}>
                    <Link to="/dashboard/batch-and-balance">
                        <i style={{ margin: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/batch-and-balance') }}>Back</a>
                    </Link>
                </div>
                <Tabs defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                    <TabPane tab="Summary" key="1"><SummaryBatch batchDetails={batchDetails} /></TabPane>
                    <TabPane tab="Purchases" key="2"><PurchaseBatch batchDetails={batchDetails} /></TabPane>
                    {/* <TabPane tab="Auto Withdrawals" key="3">Auto Withdrawals</TabPane>
                    <TabPane tab="Manual Withdrawals" key="4">Manual Withdrawals</TabPane> */}
                </Tabs>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(BatchDetails);
