import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import authAction from '../../../redux/auth/actions';
import { Link } from 'react-router-dom';
import EditAssetDetails from './editAssetDetails';
import EditAssetLimit from './editAssetLimit';

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
            <div>
                <div style={{ "display": "inline-block", "width": "100%", marginLeft: '20px' }}>
                    <Link to="/dashboard/users">
                        <i style={{ margin: '15px' }} class="fa fa-arrow-left" aria-hidden="true"></i>
                        <a onClick={() => { this.props.history.push('/dashboard/assets') }}>Back</a>
                    </Link>
                </div>
                <Tabs defaultActiveKey="1" size={'large'} style={{ marginTop: '20px' }}>
                    <TabPane tab="Asset Details" key="1"><EditAssetDetails coin_id={coin_id} /></TabPane>
                    {/* <TabPane tab="Limit Management" key="2"><EditAssetLimit coin_id={coin_id} /></TabPane> */}
                </Tabs>
            </div >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditAsset);
