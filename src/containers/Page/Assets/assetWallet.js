import React, { Component } from 'react';
import { Tabs } from 'antd';
// import { BackButton } from '../../Shared/backBttton';
import WalletOverview from './walletOverview';
import AssetWalletHistory from './assetWalletHistory';
import { LayoutContentWrapper } from '../../../components/utility/layoutWrapper.style';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';

const { TabPane } = Tabs;

class AssetWallet extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { location } = this.props;
    let path = location.pathname.split('/');
    let asset_id = path[path.length - 1]

    return (
      <LayoutContentWrapper>
        {/* <BackButton {...this.props}></BackButton> */}
        <BreadcrumbComponent {...this.props} />
        <Tabs className="full-width">
          {/* <TabPane tab="Wallet" key="1">
                  <WalletOverview asset_id={asset_id} />
                </TabPane> */}
          {/* <TabPane tab="History" key="2">
                  <AssetWalletHistory asset_id={asset_id} />
                </TabPane> */}
        </Tabs>
      </LayoutContentWrapper>
    );
  }
}

export default AssetWallet;
