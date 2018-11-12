import React, { Component } from 'react';
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper.js';
import TableDemoStyle from './demo.style';
import fakeData from '../fakeData';
import { tableinfos } from './usersConfig';
import { coinTableInfos } from './coinsConfig';
import { staticPagesInfos } from './staticPagesConfig';
import { referralInfos } from './referralConfig';
import { AnnounceInfos } from './announceConfig';
import { countryTableInfos } from './countriesConfig';
import { rolesTableInfos } from './rolesConfig';
import { stateTableInfos } from './stateConfig';
import { employeeTableinfos } from './employeeConfig';
import { blogsTableInfos } from './blogsConfig';
import { historyTableInfos } from './loginHistoryConfig';
import { pairsTableInfos } from './pairsConfig';
import { limitTableInfos } from './limitConfig';
import { transactionTableInfos } from './transactionConfig';
import { tradeTableInfos } from './tradeConfig';
import { withdrawReqTableInfos } from './withdrawReqConfig';
import { sellOrderTableInfos } from './sellOrderConfig';
import { buyOrderTableInfos } from './buyOrderConfig';
import { coinReqTableInfos } from './coinRequestConfig';
import * as TableViews from './tableViews/';

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
  TableViews, tableinfos, dataList, coinTableInfos, staticPagesInfos, referralInfos,
  AnnounceInfos, countryTableInfos, rolesTableInfos, stateTableInfos, employeeTableinfos,
  blogsTableInfos, historyTableInfos, pairsTableInfos, limitTableInfos, transactionTableInfos,
  tradeTableInfos, withdrawReqTableInfos, sellOrderTableInfos, buyOrderTableInfos,
  coinReqTableInfos
};
