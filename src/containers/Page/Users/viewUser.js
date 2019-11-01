import React, { Component } from 'react';
import { Tabs } from 'antd';
import LoginHistory from './loginHistory';
import PersonalDetails from './personalDetails';
import AllOrders from './allOrders';
import Referral from './userReferral';
import AllTrades from './userTrades';
import UserTransactionHistory from './userTransactionHistory';
import ReferredUsers from './referralUsersModal';
import UserWithdrawRequest from './userWithdrawRequest';
import UserKYCDetails from './userKYC';
import { Link } from 'react-router-dom';
import UserTickets from './userTickets';
import UserLimit from './userLimit';
import AccountSummary from './accountSummary';
import UserWallets from './userWallets';

const { TabPane } = Tabs;

class ViewUser extends Component {
    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let user_id = path[path.length - 1]

        return (
            <div>
                <div style={{ "display": "inline-block", "width": "100%", marginLeft: '20px' }}>
                    <Link to="/dashboard/users">
                        <i style={{ margin: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/users') }}>Back</a>
                    </Link>
                </div>
                <Tabs defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                    <TabPane tab="Personal Details" key="1"><PersonalDetails user_id={user_id} /></TabPane>
                    <TabPane tab="KYC" key="2"><UserKYCDetails user_id={user_id} /></TabPane>
                    <TabPane tab="Wallets" key="3"><UserWallets user_id={user_id} /></TabPane>
                    <TabPane tab="Orders" key="4"><AllOrders user_id={user_id} /></TabPane>
                    <TabPane tab="Login History" key="5"><LoginHistory user_id={user_id} /></TabPane>
                    <TabPane tab="Trade History" key="6"><AllTrades user_id={user_id} /></TabPane>
                    <TabPane tab="Referral" key="7"><Referral user_id={user_id} /></TabPane>
                    <TabPane tab="Referred Users" key="8"><ReferredUsers user_id={user_id} /></TabPane>
                    <TabPane tab="Transaction History" key="9"><UserTransactionHistory user_id={user_id} /></TabPane>
                    <TabPane tab="Withdraw Requests" key="10"><UserWithdrawRequest user_id={user_id} /></TabPane>
                    <TabPane tab="Tickets" key="11"><UserTickets user_id={user_id} /></TabPane>
                    <TabPane tab="Limit Management" key="12"><UserLimit user_id={user_id} /></TabPane>
                    <TabPane tab="Deactivated Account Summary" key="13"><AccountSummary user_id={user_id} /></TabPane>
                </Tabs>
            </div>
        );
    }
}

export default ViewUser;
