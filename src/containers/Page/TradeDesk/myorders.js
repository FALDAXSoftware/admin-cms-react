import React, { Component } from 'react';
import { Card, Col, Tabs, Select } from 'antd';
import { TradeHeadRow } from '../../App/tradeStyle';
import Pendingorders from './pendingorders';
import Completedorders from './completedorders';
import Cancelledorders from './cancelledorders';
const Option = Select.Option
const TabPane = Tabs.TabPane
class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "2",
            time: "1",
            orderTradeData: []
        }
    }
    componentDidMount() {
        this.props.io.on("users-completed-flag", (data) => {
            this.orderSocket(this.state.time, this.state.status);
        });
        this.props.io.on("users-all-trade-data", (data) => {
            console.log("-----------", data);

            this.updateMyOrder(data)
        });
        this.orderSocket(this.state.time, this.state.status);
    }
    orderSocket = (month, filter_type) => {
        this.props.io.emit("trade_users_history_event", {
            month: month,
            flag: filter_type,
            pair: `${this.props.pair}`,
        });
    }
    statusChange = (key) => {
        this.setState({ status: key, orderTradeData: [] });
        this.orderSocket(this.state.time, key);
    }
    updateMyOrder = (response) => {
        this.setState({ orderTradeData: response });
    }
    chnageTime = (value) => {
        this.setState({
            time: value
        }, () => {
            this.orderSocket(this.state.time, this.state.status);
        })
    }
    render() {
        return (
            <>
                <Card>
                    <TradeHeadRow type="flex" justify="space-between">
                        <Col span={12}>
                            <label>My Orders</label>
                        </Col>
                    </TradeHeadRow>
                    <Tabs
                        activeKey={this.state.status}
                        onChange={this.statusChange}
                        tabBarExtraContent={(
                            <Select
                                value={this.state.time}
                                onChange={this.chnageTime}>
                                <Option value="1">
                                    1 Month
                                </Option>
                                <Option value="3">
                                    3 Months
                                </Option>
                                <Option value="6">
                                    6 Months
                                </Option>
                                <Option value="12">
                                    12 Months
                                </Option>
                            </Select>
                        )}>
                        <TabPane tab="Pending" key="2">
                            <Pendingorders data={this.state.orderTradeData} />
                        </TabPane>
                        <TabPane tab="Completed" key="1">
                            <Completedorders data={this.state.orderTradeData} />
                        </TabPane>
                        <TabPane tab="Canceled" key="3">
                            <Cancelledorders data={this.state.orderTradeData} />
                        </TabPane>
                    </Tabs>
                </Card>
            </>
        );
    }
}

export default MyOrders;