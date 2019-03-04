import React, { Component } from 'react';
import { Tabs } from 'antd';
import LoginHistory from './loginHistory';
import PersonalDetails from './personalDetails';
import BuyOrders from '../Orders/buyOrders';
import SellOrders from '../Orders/sellOrders';
import Referral from './referral';
import UserTradeHistory from './userTradeHistory';
import UserTransactionHistory from './userTransactionHistory';

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
                <TabPane tab="Login History" key="2"><LoginHistory user_id={user_id} /></TabPane>
                <TabPane tab="Referral" key="3"><Referral user_id={user_id} /></TabPane>
                <TabPane tab="Buy Orders" key="4"><BuyOrders user_id={user_id} /></TabPane>
                <TabPane tab="Sell Orders" key="5"><SellOrders user_id={user_id} /></TabPane>
                <TabPane tab="KYC" key="6">Content of tab 3</TabPane>
                <TabPane tab="Trade History" key="7"><UserTradeHistory user_id={user_id} /></TabPane>
                <TabPane tab="Transaction History" key="8"><UserTransactionHistory user_id={user_id} /></TabPane>
                <TabPane tab="Withdraw Requests" key="9">Content of tab 3</TabPane>
            </Tabs>
        );
    }
}

export default ViewUser;
