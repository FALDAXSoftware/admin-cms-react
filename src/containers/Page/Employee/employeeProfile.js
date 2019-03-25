import React, { Component } from 'react';
import { Tabs } from 'antd';
import EmployeeOverview from './employeeOverview';

const { TabPane } = Tabs;

class EmployeeProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let emp_id = path[path.length - 1]

        return (
            <Tabs defaultActiveKey="1" size={'large'}>
                <TabPane tab="Overview" key="1"><EmployeeOverview emp_id={emp_id} /></TabPane>
                {/* <TabPane tab="Logs & Activities" key="2">Content of tab 3</TabPane> */}
            </Tabs>
        );
    }
}

export default EmployeeProfile;
