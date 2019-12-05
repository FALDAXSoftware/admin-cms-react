import React from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { Tabs } from "antd";
import Referrals from "./referrals";
import ReferralPercentage from "./referralPercentage";
import { isAllowed } from "../../../helpers/accessControl";
const TabPane = Tabs.TabPane;

class Referral extends React.Component {
    render() {
        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {isAllowed("get_referal_list") &&
                            <TabPane tab="Referral" key="ReferralTable">
                                <Referrals></Referrals>
                            </TabPane>
                        }
                        {isAllowed("get_referral_details") &&
                            < TabPane tab="Referral Percentage" key="ReferralPercentage">
                                <ReferralPercentage></ReferralPercentage>
                            </TabPane>
                        }
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper >
        )
    }
}

export default Referral