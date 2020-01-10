import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import Metabase from './tradeMatabase'
import TradeHistory from './tradeHistory';
import SimplexHistory from './simplexHistory';
import { isAllowed } from "../../../helpers/accessControl";
import { BackButton } from '../../Shared/backBttton.js';
import { BreadcrumbComponent } from '../../Shared/breadcrumb.js';

const TabPane = Tabs.TabPane;

class AllHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <LayoutWrapper>
                {/* <BackButton {...this.props}/> */}
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="isoTableDisplayTab full-width">
                    <TabPane tab="Crypto Only" key="1"><TradeHistory /></TabPane>
                    <TabPane tab="Credit Card" key="2"><SimplexHistory /></TabPane>
                    {isAllowed("metabase_history_report") && <TabPane tab="Report" key="3"><Metabase /></TabPane>}
                </Tabs>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
    }))(AllHistory);
