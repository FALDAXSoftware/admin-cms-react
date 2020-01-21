import React, { Component } from 'react';
import { Tabs } from 'antd';
import LoginHistory from './loginHistory';
import PersonalDetails from './personalDetails';
import Referral from './userReferral';
import AllTrades from './userTrades';
import UserTransactionHistory from './userTransactionHistory';
import ReferredUsers from './referralUsersModal';
import UserWithdrawRequest from './userWithdrawRequest';
import UserKYCDetails from './userKYC';
import UserTickets from './userTickets';
import UserLimit from './userLimit';
import AccountSummary from './accountSummary';
import UserWallets from './userWallets';
import { isAllowed } from '../../../helpers/accessControl';
// import { BackButton } from '../../Shared/backBttton';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import {connect} from "react-redux"
import actions from "../../../redux/users/actions"
const {removeUserDetails}=actions;

const { TabPane } = Tabs;

class ViewUser extends Component {

    constructor(props){
        super(props)
    }

    componentWillUnmount(){
        this.props.removeUserDetails();
    }

    render() {
        const { location } = this.props;
        let path = location.pathname.split('/');
        let user_id = path[path.length - 1]

        return (
            <LayoutWrapper>
                {/* <BackButton {...this.props}></BackButton> */}
                <BreadcrumbComponent {...this.props}/>
                <Tabs className="full-width">
                    {isAllowed("get_user_details") &&

                        <TabPane tab="Personal Details" key="1"><PersonalDetails user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_kyc_detail") &&

                        <TabPane tab="Customer ID Verification" key="2"><UserKYCDetails user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_user_wallet_addresses") &&

                        <TabPane tab="Wallets" key="3"><UserWallets user_id={user_id} /></TabPane>
                    }
                    {/* {(isAllowed("get_all_sell_orders") || isAllowed("get_all_buy_orders") || isAllowed("get_all_pending_orders") || isAllowed("get_all_cancelled_orders")) &&
                        <TabPane tab="Orders" key="4"><AllOrders user_id={user_id} /></TabPane>
                    } */}
                    {isAllowed("get_user_login_history") &&
                        <TabPane tab="Login History" key="5"><LoginHistory user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_all_trade") &&
                        <TabPane tab="History" key="6"><AllTrades user_id={user_id} /></TabPane>
                    }
                    {(isAllowed("update_user_referal") && isAllowed("get_user_details")) &&
                        <TabPane tab="Referral" key="7"><Referral user_id={user_id} /></TabPane>
                    }
                    {isAllowed("referred_users") &&
                        <TabPane tab="Referred Users" key="8"><ReferredUsers user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_user_transactions") &&
                        <TabPane tab="Transaction History" key="9"><UserTransactionHistory user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_all_withdraw_request") &&
                        <TabPane tab="Withdrawal Request" key="10"><UserWithdrawRequest user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_user_ticket") &&
                        <TabPane tab="Tickets" key="11"><UserTickets user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_user_limits") &&
                        <TabPane tab="Limit Management" key="12"><UserLimit user_id={user_id} /></TabPane>
                    }
                    {isAllowed("get_delete_account_summary") &&
                        (this.props.location.state && this.props.location.state.is_active) &&<TabPane tab="Deactivated Account Summary" key="13"><AccountSummary user_id={user_id} /></TabPane>
                    }
                </Tabs>
            </LayoutWrapper>
        );
    }
}

export default connect(undefined,{removeUserDetails})(ViewUser);
