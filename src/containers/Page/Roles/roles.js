import React, { Component } from 'react';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { Tabs } from 'antd';
import { TabPane } from '../../../components/uielements/tabs';
import {  withRouter} from "react-router-dom";
import  ViewRoles  from './viewRoles';
import RolesMetabase from './rolesMetabase';
import { isAllowed } from '../../../helpers/accessControl';
import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
class RolesTab extends Component {
    state = {  }    
    render() { 
        return (
        <LayoutWrapper>
                {/* <BackButton {...this.props}/> */}
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="full-width">
                    {isAllowed("get_role")&&<TabPane tab="Roles" key="1"><ViewRoles/></TabPane>}
                    {isAllowed("metabase_roles_report")&&<TabPane tab="Report" key="2"><RolesMetabase/></TabPane>}
                </Tabs>
        </LayoutWrapper>
        );
    }
}
 
export default withRouter(RolesTab);