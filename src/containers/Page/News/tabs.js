import React, { Component } from 'react';
import { Tabs } from 'antd';
import {  withRouter} from "react-router-dom";
// import { BackButton } from '../../Shared/backBttton';
import News from './news';
import { TabPane } from '../../../components/uielements/tabs';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import Metabase from "./metabase";
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class Wallets extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                {/* <BackButton {...this.props}/>    */}
                <BreadcrumbComponent {...this.props} />
                <Tabs className="full-width">
                  {isAllowed('get_all_news')&& <TabPane tab="News" key="1"><News/></TabPane>}
                  {isAllowed('metabase_news_report')&& <TabPane tab="Report" key="2"><Metabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(Wallets);