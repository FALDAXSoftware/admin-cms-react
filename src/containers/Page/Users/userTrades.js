import React from 'react';
import { Tabs } from 'antd';
import UserTradeHistory from './userTradeHistory';
import UserSimplexHistory from './userSimplexHistory';
import UserOwnTradeHistory from './userOwnTradeHistory'
// import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';

const { TabPane } = Tabs;

export default function AllTrades(props) {
  return (
    // <LayoutWrapper>
    <TableDemoStyle className="isoLayoutContent sub-tab-tabledemo">
      <Tabs
        className="isoTableDisplayTab float-clear"
        defaultActiveKey="2"
      >
        {/* <TabPane tab="Crypto Only" key="1">
              <UserTradeHistory user_id={props.user_id} />
            </TabPane> */}
        <TabPane tab="Credit Card" key="2">
          <UserSimplexHistory user_id={props.user_id} />
        </TabPane>
        <TabPane tab="Trade" key="3">
          <UserOwnTradeHistory user_id={props.user_id} />
        </TabPane>
      </Tabs>
    </TableDemoStyle>
    // </LayoutWrapper>
  );
}
