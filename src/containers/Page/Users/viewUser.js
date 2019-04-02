import React, { Component } from 'react';
import { Tabs } from 'antd';
import LoginHistory from './loginHistory';
import PersonalDetails from './personalDetails';
import BuyOrders from '../Orders/buyOrders';
import SellOrders from '../Orders/sellOrders';
import Referral from './userReferral';
import UserTradeHistory from './userTradeHistory';
import UserTransactionHistory from './userTransactionHistory';
import ReferredUsers from './referralUsersModal';
import UserWithdrawRequest from './userWithdrawRequest';
import UserKYCDetails from './userKYC';

const { TabPane } = Tabs;

class ViewUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let user_id = path[path.length - 1]

        return (
            <Tabs defaultActiveKey="1" size={'large'}>
                <TabPane tab="Personal Details" key="1"><PersonalDetails user_id={user_id} /></TabPane>
                <TabPane tab="KYC" key="2"><UserKYCDetails user_id={user_id} /></TabPane>
                <TabPane tab="Sell Orders" key="3"><SellOrders user_id={user_id} /></TabPane>
                <TabPane tab="Buy Orders" key="4"><BuyOrders user_id={user_id} /></TabPane>
                <TabPane tab="Login History" key="5"><LoginHistory user_id={user_id} /></TabPane>
                <TabPane tab="Trade History" key="6"><UserTradeHistory user_id={user_id} /></TabPane>
                <TabPane tab="Referral" key="7"><Referral user_id={user_id} /></TabPane>
                <TabPane tab="Referred Users" key="8"><ReferredUsers user_id={user_id} /></TabPane>
                <TabPane tab="Transaction History" key="9"><UserTransactionHistory user_id={user_id} /></TabPane>
                <TabPane tab="Withdraw Requests" key="10"><UserWithdrawRequest user_id={user_id} /></TabPane>
            </Tabs>
        );
    }
}

export default ViewUser;
