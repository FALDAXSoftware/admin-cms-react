import React, { Component } from 'react';
import { Tabs } from 'antd';
import SummaryBatch from './summaryBatch';
import PurchaseBatch from './purchaseBatch';

const { TabPane } = Tabs;

class BatchDetails extends Component {
    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let batch_id = path[path.length - 1]

        return (
            <div>
                <Tabs defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                    <TabPane tab="Summary" key="1"><SummaryBatch batch_id={batch_id} /></TabPane>
                    <TabPane tab="Purchases" key="2"><PurchaseBatch batch_id={batch_id} /></TabPane>
                    {/* <TabPane tab="Auto Withdrawals" key="3">Auto Withdrawals</TabPane>
                    <TabPane tab="Manual Withdrawals" key="4">Manual Withdrawals</TabPane> */}
                </Tabs>
            </div>
        );
    }
}

export default BatchDetails;
