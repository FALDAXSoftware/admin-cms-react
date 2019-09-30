import React from 'react';
import { Tabs } from 'antd';
import UserTradeHistory from './userTradeHistory';
import UserSimplexHistory from './userSimplexHistory';

const { TabPane } = Tabs;

export default function AllTrades(props) {
    return (
        <React.Fragment>
            <Tabs className="orders-tab" defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                <TabPane tab="Trade Histoy" key="1"><UserTradeHistory user_id={props.user_id} /></TabPane>
                <TabPane tab="Simplex Histoy" key="2"><UserSimplexHistory user_id={props.user_id} /></TabPane>
            </Tabs>
        </React.Fragment>
    )
}
