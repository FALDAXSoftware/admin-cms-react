import React, { Component } from 'react';
import { Tabs } from 'antd';
import LoginHistory from './loginHistory';
import PersonalDetails from './personalDetails';
import AllOrders from './allOrders';
import Referral from './userReferral';
import UserTradeHistory from './userTradeHistory';
import UserTransactionHistory from './userTransactionHistory';
import ReferredUsers from './referralUsersModal';
import UserWithdrawRequest from './userWithdrawRequest';
import UserKYCDetails from './userKYC';
import { Link } from 'react-router-dom';
import UserTickets from './userTickets';
import UserLimit from './userLimit';

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
                    <TabPane tab="Orders" key="3"><AllOrders user_id={user_id} /></TabPane>
                    <TabPane tab="Login History" key="4"><LoginHistory user_id={user_id} /></TabPane>
                    <TabPane tab="Trade History" key="5"><UserTradeHistory user_id={user_id} /></TabPane>
                    <TabPane tab="Referral" key="6"><Referral user_id={user_id} /></TabPane>
                    <TabPane tab="Referred Users" key="7"><ReferredUsers user_id={user_id} /></TabPane>
                    <TabPane tab="Transaction History" key="8"><UserTransactionHistory user_id={user_id} /></TabPane>
                    <TabPane tab="Withdraw Requests" key="9"><UserWithdrawRequest user_id={user_id} /></TabPane>
                    <TabPane tab="Tickets" key="10"><UserTickets user_id={user_id} /></TabPane>
                    <TabPane tab="Limit Management" key="11"><UserLimit user_id={user_id} /></TabPane>
                </Tabs>
            </div>
        );
    }
}

export default ViewUser;
