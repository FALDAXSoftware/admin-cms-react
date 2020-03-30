import React, { Component } from 'react';
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper.js';
import TableDemoStyle from './demo.style';
import fakeData from '../fakeData';
import { tableinfos } from './usersConfig';
import { inActiveUserinfos } from './inActiveUserConfig';
import { assetTableInfos } from './coinsConfig';
import { userReferralInfos } from './userReferralConfig';
import { countryTableInfos } from './countriesConfig';
import { rolesTableInfos } from './rolesConfig';
import { stateTableInfos } from './stateConfig';
import { employeeTableinfos } from './employeeConfig';
import { historyTableInfos } from './loginHistoryConfig';
import { pairsTableInfos } from './pairsConfig';
import { limitTableInfos } from './limitConfig';
import { transactionTableInfos } from './transactionConfig';
import { tradeTableInfos,ownTradeTable } from './tradeConfig';
import { withdrawReqTableInfos } from './withdrawReqConfig';
import { sellOrderTableInfos } from './sellOrderConfig';
import { buyOrderTableInfos } from './buyOrderConfig';
import { jobsTableInfos } from './jobsConfig';
import { jobAppTableInfos } from './jobAppConfig';
import { KYCInfos } from './kycConfig';
import { FeesInfos } from './feesConfig';
import { newsTableInfos } from './newsConfig';
import { referralInfos } from './referralConfig';
import { ticketsTableInfos } from './ticketsConfig';
import { userWithdrawReqTableInfos } from './userWithdrawReqConfig';
import { accountClassTableinfos } from './accountClassConfig';
import { templateTableinfos } from './templateconfig';
import { newsSourceTableInfos } from './newsSourceConfig';
import { jobCategoryTableInfos } from './jobcategoryConfig';
import { ApprovedKYCInfos } from './approvedKYCConfig';
import { whitelistTableInfos } from './whitelistConfig';
import { profileWhitelistTableInfos } from './profileWhitelistConfig';
import { twoFactorReqInfos } from './twoFactorReqConfig';
import { walletTableInfos } from './walletHistoryConfig';
import { dashboardTableinfos } from './walletDashboardConfig';
import { walletFeeTableinfos } from './walletFeeConfig';
import { pendingOrderTableInfos } from './pendingOrderConfig';
import { cancelOrderTableInfos } from './cancelOrderConfig';
import { tierTableInfos } from './tierConfig';
import { tierReqTableInfos } from './tierRequestConfig';
import { tierPendingReqTableInfos } from './pendingTierReqConfig';
import { simplexTableInfos } from './simplexConfig';
import { networkFeeTableInfos } from './networFeeConfig';
import * as TableViews from './tableViews/';
import { tblOffers } from './offersConfig';


const dataList = new fakeData(10);

export default class AntTable extends Component {
  renderTable(tableInfo) {
    let Component;
    switch (tableInfo.value) {
      case 'sortView':
        Component = TableViews.SortView;
        break;
      case 'filterView':
        Component = TableViews.FilterView;
        break;
      case 'editView':
        Component = TableViews.EditView;
        break;
      case 'groupView':
        Component = TableViews.GroupView;
        break;
      case 'customizedView':
        Component = TableViews.CustomizedView;
        break;
      default:
        Component = TableViews.SimpleView;
    }
    return <Component tableInfo={tableInfo} dataList={dataList} />;
  }
  render() {
    return (
      <LayoutContentWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            {tableinfos.map(tableInfo => (
              <TabPane tab={tableInfo.title} key={tableInfo.value}>
                {this.renderTable(tableInfo)}
              </TabPane>
            ))}
          </Tabs>
        </TableDemoStyle>
      </LayoutContentWrapper>
    );
  }
}

export {
  TableViews, tableinfos, dataList, assetTableInfos, referralInfos,
  countryTableInfos, rolesTableInfos, stateTableInfos, employeeTableinfos,
  historyTableInfos, pairsTableInfos, limitTableInfos, transactionTableInfos,
  tradeTableInfos, ownTradeTable,withdrawReqTableInfos, sellOrderTableInfos, buyOrderTableInfos,
  jobsTableInfos, jobAppTableInfos, KYCInfos, FeesInfos,
  newsTableInfos, userReferralInfos, userWithdrawReqTableInfos, ticketsTableInfos,
  accountClassTableinfos, templateTableinfos, newsSourceTableInfos, jobCategoryTableInfos,
  ApprovedKYCInfos, whitelistTableInfos, profileWhitelistTableInfos, twoFactorReqInfos,
  walletTableInfos, dashboardTableinfos, walletFeeTableinfos, pendingOrderTableInfos,
  cancelOrderTableInfos, tierTableInfos, tierReqTableInfos, tierPendingReqTableInfos,
  simplexTableInfos, inActiveUserinfos,networkFeeTableInfos,tblOffers
};
