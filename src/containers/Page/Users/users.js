import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import ActiveUsers from './activeUsers';
import InActiveUsers from './inActiveUsers';

const { TabPane } = Tabs;

class Users extends Component {
    render() {
        return (
            <div className="isoLayoutContent">
                <div style={{ float: 'right', backgroundColor: 'white', marginRight: '20px' }}>
                    <Button icon="plus" onClick={() => this.props.history.push('/dashboard/users/add-user')} type="primary">Add User</Button>
                </div>
                <Tabs defaultActiveKey="1" size={'large'}>
                    <TabPane tab="Active Users" key="1"><ActiveUsers /></TabPane>
                    <TabPane tab="In-Active Users" key="2"><InActiveUsers /></TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Users;
