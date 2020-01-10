import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import authAction from '../../../redux/auth/actions';
import EditAssetDetails from './editAssetDetails';
import EditAssetLimit from './editAssetLimit';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { isAllowed } from "../../../helpers/accessControl";
import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';

const { logout } = authAction;
const { TabPane } = Tabs;

class EditAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let coin_id = path[path.length - 1]

        return (
            <LayoutWrapper>
                {/* <BackButton {...this.props}></BackButton> */}
                <BreadcrumbComponent {...this.props}></BreadcrumbComponent>
                <Tabs  className="full-width">
                    {(isAllowed("update_coins") && isAllowed("get_coin_details"))&& <TabPane tab="Asset Details" key="1"><EditAssetDetails coin_id={coin_id} /></TabPane>}
                    {isAllowed("get_all_limits") && <TabPane tab="Limit Management" key="2"><EditAssetLimit coin_id={coin_id} /></TabPane>}
                </Tabs>
                </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditAsset);
