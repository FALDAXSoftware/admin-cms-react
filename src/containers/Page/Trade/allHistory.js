import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TradeHistory from './tradeHistory';
import SimplexHistory from './simplexHistory';

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
                {/* <TableDemoStyle className="isoLayoutContent"> */}
                    <Tabs className="isoTableDisplayTab full-width">
                        <TabPane tab="Crypto Only" key="1"><TradeHistory /></TabPane>
                        <TabPane tab="Credit Card" key="2"><SimplexHistory /></TabPane>
                    </Tabs>
                {/* </TableDemoStyle> */}
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
    }))(AllHistory);
