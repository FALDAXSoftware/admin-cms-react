import React, { Component } from 'react';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import WalletOverview from './walletOverview';
import AssetWalletHistory from './assetWalletHistory';
import { LayoutContentWrapper } from '../../../components/utility/layoutWrapper.style';

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
          <div>
            <div
              style={{
                display: "inline-block",
                width: "100%",
                marginLeft: "20px"
              }}
            >
              <Link to="/dashboard/assets">
                <i
                  style={{ margin: "15px" }}
                  className="fa fa-arrow-left"
                  aria-hidden="true"
                ></i>
                <a
                  onClick={() => {
                    this.props.history.push("/dashboard/assets");
                  }}
                >
                  Back
                </a>
              </Link>
            </div>
            <LayoutContentWrapper>
              <Tabs defaultActiveKey="1" size={"large"} className="full-width">
                <TabPane tab="Wallet" key="1">
                  <WalletOverview asset_id={asset_id} />
                </TabPane>
                <TabPane tab="History" key="2">
                  <AssetWalletHistory asset_id={asset_id} />
                </TabPane>
              </Tabs>
            </LayoutContentWrapper>
          </div>
        );
    }
}

export default AssetWallet;
