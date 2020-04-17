import React, { Component } from 'react';
import { Card, Col, Tabs } from 'antd';
import { TradeHeadRow } from '../../App/tradeStyle';
import Pendingorders from './pendingorders';
import Completedorders from './completedorders';
import Cancelledorders from './cancelledorders';

const TabPane = Tabs.TabPane
class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <>
                <Card>
                    <TradeHeadRow type="flex" justify="space-between">
                        <Col span={12}>
                            <label>My Orders</label>
                        </Col>
                    </TradeHeadRow>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="Pending" key="1">
                            <Pendingorders />
                        </TabPane>
                        <TabPane tab="Completed" key="2">
                            <Completedorders />
                        </TabPane>
                        <TabPane tab="Canceled" key="3">
                            <Cancelledorders />
                        </TabPane>
                    </Tabs>
                </Card>
            </>
        );
    }
}

export default MyOrders;