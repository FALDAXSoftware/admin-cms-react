import React from 'react';
import { Tabs } from 'antd';
import BuyOrders from '../Orders/buyOrders';
import SellOrders from '../Orders/sellOrders';
import PendingOrders from '../Orders/pendingOrders';
import CancelOrders from '../Orders/cancelOrders';
import { isAllowed } from '../../../helpers/accessControl';

const { TabPane } = Tabs;

export default function AllOrders(props) {
    return (
        <React.Fragment>
             <Tabs className="full-width">
                {isAllowed("get_all_sell_orders") &&
                    <TabPane tab="Sell Orders" key="1"><SellOrders user_id={props.user_id} /></TabPane>
                }
                {isAllowed("get_all_buy_orders") &&
                    <TabPane tab="Buy Orders" key="2"><BuyOrders user_id={props.user_id} /></TabPane>
                }
                {isAllowed("get_all_pending_orders") &&
                    <TabPane tab="Pending Orders" key="3"><PendingOrders user_id={props.user_id} /></TabPane>
                }
                {isAllowed("get_all_cancelled_orders") &&
                    <TabPane tab="Cancelled Orders" key="4"><CancelOrders user_id={props.user_id} /></TabPane>
                }
                </Tabs>
        </React.Fragment>
    )
}
