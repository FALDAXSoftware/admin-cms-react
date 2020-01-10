import React, { Component } from 'react';
import { Tabs } from 'antd';
import EmployeeOverview from './employeeOverview';
import EmployeeWhitelist from './employeeWhitelist';
import { Link } from 'react-router-dom';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { isAllowed } from '../../../helpers/accessControl';
import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';

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
                <LayoutWrapper>
                {/* <BackButton {...this.props}/> */}
                <BreadcrumbComponent {...this.props}/>
                <Tabs   className="full-width">
                    {isAllowed("get_employee_details") &&<TabPane tab="Overview" key="1"><EmployeeOverview emp_id={emp_id} /></TabPane>}
                    <TabPane tab="IP Whitelist" key="2"><EmployeeWhitelist emp_id={emp_id} /></TabPane>
                    {/* <TabPane tab="Logs & Activities" key="2">Content of tab 3</TabPane> */}
                </Tabs>
                </LayoutWrapper>
        );
    }
}

export default EmployeeProfile;
