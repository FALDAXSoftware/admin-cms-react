import React from 'react';
import { Tabs } from 'antd';
import BuyOrders from '../Orders/buyOrders';
import SellOrders from '../Orders/sellOrders';
import PendingOrders from '../Orders/pendingOrders';
import CancelOrders from '../Orders/cancelOrders';

const { TabPane } = Tabs;

export default function AllOrders(props) {
    return (
        <React.Fragment>
            <Tabs className="orders-tab" defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                <TabPane tab="Sell Orders" key="1"><SellOrders user_id={props.user_id} /></TabPane>
                <TabPane tab="Buy Orders" key="2"><BuyOrders user_id={props.user_id} /></TabPane>
                <TabPane tab="Pending Orders" key="3"><PendingOrders user_id={props.user_id} /></TabPane>
                <TabPane tab="Cancelled Orders" key="4"><CancelOrders user_id={props.user_id} /></TabPane>
            </Tabs>
        </React.Fragment>
    )
}
