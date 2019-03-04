import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { historyTableInfos } from '../../Tables/antTables';
import TableWrapper from "../../Tables/antTables/antTable.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { Tabs, Breadcrumb } from 'antd';

const TabPane = Tabs.TabPane;

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHistory: [],
            user_name: ""
        }
    }

    componentDidMount = () => {
        const { location, token, user_id } = this.props;
        let _this = this;

        ApiUtils.getUserHistory(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ allHistory: res.data, user_name: res.user_name.full_name });
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
