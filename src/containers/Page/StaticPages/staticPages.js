import React, { Component } from 'react';
import { Tabs } from 'antd';
import { staticPagesInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;

class StaticPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStaticPages: [],
        }
    }

    componentDidMount = () => {
        //  this._getAllStaticPages();
    }

    _getAllStaticPages = () => {
        const { token } = this.props;

        ApiUtils.getStaticPages(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    this.setState({ allStaticPages: res.data });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    render() {
        const { allStaticPages } = this.state;

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {staticPagesInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allStaticPages}
                                    className="isoCustomizedTable"
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(StaticPages);
