import React, { Component } from "react";
import {
  TradeRow,
  HeadRowWallet,
  WalletCard,
  CreateWalletRow,
  LabelRow,
  TradeHeadRow,
} from "../../App/tradeStyle";
import { Col, Card, Button, Row } from "antd";

class TradeWallets extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Card style={{ marginBottom: "13px" }}>
        <TradeHeadRow gutter={16}>
          <Col span={12}>
            <label>Wallets</label>
          </Col>
        </TradeHeadRow>
        <TradeRow gutter={16}>
          <Col span={8}>
            <WalletCard>
              <HeadRowWallet>
                <img src="https://s3.us-east-2.amazonaws.com/production-static-asset/coin/bitcoin.png" />
                <span>TBTC</span>
              </HeadRowWallet>
              <HeadRowWallet>
                <LabelRow>
                  <label>Address:</label>
                  <span>-</span>
                </LabelRow>
                <LabelRow>
                  <label>Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Placed Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Total Balance:</label>
                  <span>0</span>
                </LabelRow>
              </HeadRowWallet>
              <CreateWalletRow>
                <Button type="primary">Create Wallet</Button>
              </CreateWalletRow>
            </WalletCard>
          </Col>
          <Col span={8}>
            <WalletCard>
              <HeadRowWallet>
                <img src="https://s3.us-east-2.amazonaws.com/production-static-asset/coin/bitcoin.png" />
                <span>TBTC</span>
              </HeadRowWallet>
              <HeadRowWallet>
                <LabelRow>
                  <label>Address:</label>
                  <span>-</span>
                </LabelRow>
                <LabelRow>
                  <label>Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Placed Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Total Balance:</label>
                  <span>0</span>
                </LabelRow>
              </HeadRowWallet>
              <CreateWalletRow>
                <Button type="primary">Create Wallet</Button>
              </CreateWalletRow>
            </WalletCard>
          </Col>
          <Col span={8}>
            <WalletCard>
              <HeadRowWallet>
                <img src="https://s3.us-east-2.amazonaws.com/production-static-asset/coin/bitcoin.png" />
                <span>TBTC</span>
              </HeadRowWallet>
              <HeadRowWallet>
                <LabelRow>
                  <label>Address:</label>
                  <span>-</span>
                </LabelRow>
                <LabelRow>
                  <label>Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Placed Balance:</label>
                  <span>0</span>
                </LabelRow>
                <LabelRow>
                  <label>Total Balance:</label>
                  <span>0</span>
                </LabelRow>
              </HeadRowWallet>
              <CreateWalletRow>
                <Button type="primary">Create Wallet</Button>
              </CreateWalletRow>
            </WalletCard>
          </Col>
        </TradeRow>
      </Card>
    );
  }
}
export default TradeWallets;
