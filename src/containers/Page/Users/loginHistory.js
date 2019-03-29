import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs } from 'antd';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHistory: [],
            loader: false
        }
    }

    componentDidMount = () => {
        const { token, user_id } = this.props;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.getUserHistory(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ allHistory: res.data, loader: false });
            })
            .catch((err) => {
                _this.setState({ loader: false })
                console.log(err)
            });
    }

    render() {
        const { allHistory, loader } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {historyTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allHistory}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <FaldaxLoader />}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        )
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(LoginHistory);
