import React, { Component } from 'react';
import { Button, Tabs, notification, Icon, Spin } from 'antd';
import { rolesTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddRoleModal from './addRoleModal';

const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var self;

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRoles: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddRoleModal: false
        }
        self = this;
    }

    componentDidMount = () => {
        this._getAllRoles();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllRoles = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getAllRoles(token)
            .then((response) => response.json())
            .then(function (res) {
                console.log('>>>>res', res)
                if (res) {
                    _this.setState({ allRoles: res.roles });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(err => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    _showAddRoleModal = () => {
        this.setState({ showAddRoleModal: true });
    }

    _closeAddRoleModal = () => {
        this.setState({ showAddRoleModal: false });
    }

    render() {
        const { allRoles, errType, errMsg, loader, showAddRoleModal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {rolesTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddRoleModal}>Add Role</Button>
                                    <AddRoleModal
                                        showAddRoleModal={showAddRoleModal}
                                        closeAddModal={this._closeAddRoleModal}
                                        getAllRoles={this._getAllRoles.bind(this, 0)}
                                    />
                                </div>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allRoles}
                                        className="isoCustomizedTable"
                                    />
                                    {loader && <Spin indicator={loaderIcon} />}
                                </div>
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
        token: state.Auth.get('token')
    }))(Roles);

export { Roles, rolesTableInfos };

