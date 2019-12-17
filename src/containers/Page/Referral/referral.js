import React from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { Tabs } from "antd";
import Referrals from "./referrals";
import ReferralPercentage from "./referralPercentage";
import { isAllowed } from "../../../helpers/accessControl";
import ReferralMetabase from "./referalMetabase";
const TabPane = Tabs.TabPane;
class Referral extends React.Component {
  render() {
    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          {isAllowed("get_referal_list") &&
            <TabPane tab="Referral" key="ReferralTable">
              <TableDemoStyle className="isoLayoutContent">
                <Referrals></Referrals>
              </TableDemoStyle>
            </TabPane>
          }
          {isAllowed("get_referral_details") &&
            < TabPane tab="Referral Percentage" key="ReferralPercentage">
              <TableDemoStyle className="isoLayoutContent">
                <ReferralPercentage></ReferralPercentage>
              </TableDemoStyle>
            </TabPane>
          }
           {isAllowed("metabase_referal_report") &&
           < TabPane tab="Report" key="metabase">
              <TableDemoStyle className="isoLayoutContent">
                <ReferralMetabase></ReferralMetabase>
              </TableDemoStyle>
            </TabPane>}
        </Tabs>
      </LayoutWrapper >
    )
  }
}

export default Referral
