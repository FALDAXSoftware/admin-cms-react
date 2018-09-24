import React, { Component } from 'react';
import { Tabs } from 'antd';
import { coinTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";

const TabPane = Tabs.TabPane;

class EmailTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCoins: [],
        }
    }

    componentDidMount = () => {
        //  this._getAllCoins();
    }

    _getAllCoins = () => {
        const { isLoggedIn } = this.props;

        ApiUtils.getAllCount(isLoggedIn)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status === "SUCCESS") {
                    const { allCoins } = res.data;
                    this.setState({ allCoins });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    render() {
        const { allCoins } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {coinTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                </div>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCoins}
                                        className="isoCustomizedTable"
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default EmailTemplates;
