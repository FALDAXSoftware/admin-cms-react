import React, { Component } from 'react';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import { BackButton } from '../../Shared/backBttton';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import Metabase from './metabase';
import { isAllowed } from '../../../helpers/accessControl';
import Transaction from "./transactionHistory"


class KycTabs extends Component {
    state = {  }    
    render() { 
        return (
          <LayoutWrapper>
            <BackButton {...this.props} />
            <Tabs className="full-width">
             {isAllowed("get_all_transactions") &&<TabPane tab="Transaction" key="1">
                <Transaction/>
              </TabPane>
            
            }
                {isAllowed("metabase_transaction_history_report") && <TabPane tab="Report" key="5">
                <Metabase />
              </TabPane>}
            </Tabs>
          </LayoutWrapper>
        );
    }
}
 
export default withRouter(KycTabs);