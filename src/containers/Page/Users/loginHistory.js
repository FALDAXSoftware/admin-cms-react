import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHistory: []
        }
    }

    componentDidMount = () => {
        const { location, token } = this.props;
        let path = location.pathname.split('/');
        let user_id = path[path.length - 1]
        let _this = this;

        ApiUtils.getUserHistory(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ allHistory: res.data });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        const { allHistory } = this.state;

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
