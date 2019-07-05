import React, { Component } from 'react';
import { Tabs } from 'antd';
import EmployeeOverview from './employeeOverview';
import EmployeeWhitelist from './employeeWhitelist';
import { Link } from 'react-router-dom';

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
            <div>
                <div style={{ "display": "inline-block", "width": "100%", marginLeft: '20px' }}>
                    <Link to="/dashboard/employee">
                        <i style={{ margin: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/employee') }}>Back</a>
                    </Link>
                </div>
                <Tabs defaultActiveKey="1" size={'large'} >
                    <TabPane tab="Overview" key="1"><EmployeeOverview emp_id={emp_id} /></TabPane>
                    <TabPane tab="IP Whitelist" key="2"><EmployeeWhitelist emp_id={emp_id} /></TabPane>
                    {/* <TabPane tab="Logs & Activities" key="2">Content of tab 3</TabPane> */}
                </Tabs>
            </div>
        );
    }
}

export default EmployeeProfile;
