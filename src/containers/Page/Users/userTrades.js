import React from 'react';
import { Tabs } from 'antd';
import UserTradeHistory from './userTradeHistory';
import UserSimplexHistory from './userSimplexHistory';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";

const { TabPane } = Tabs;

export default function AllTrades(props) {
    return (
      <LayoutWrapper>
        <Tabs
          className="isoTableDisplayTab float-clear"
          defaultActiveKey="1"
        >
          <TabPane tab="Crypto Only" key="1">
            <UserTradeHistory user_id={props.user_id} />
          </TabPane>
          <TabPane tab="Credit Card" key="2">
            <UserSimplexHistory user_id={props.user_id} />
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
}
