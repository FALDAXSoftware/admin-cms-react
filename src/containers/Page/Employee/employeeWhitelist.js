import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Button, notification, Tabs, Modal, Pagination } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import { whitelistTableInfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import AddIPModal from './addIPModal';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class EmployeeWhitelist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            limit: 10,
            EmpIPCount: 0,
            allIPAddresses: '',
            showDeleteIPModal: false,
            showAddIPModal: false
        }
        self = this;
        this.validator = new SimpleReactValidator();
        EmployeeWhitelist.deleteWhitelistIP = EmployeeWhitelist.deleteWhitelistIP.bind(this)
    }

    componentDidMount = () => {
        this._getAllWhitelistIP()
    }

    _getAllWhitelistIP = () => {
        const { token, emp_id } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        ApiUtils.getAllWhitelistIP(token, emp_id, page, limit)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allIPAddresses: res.data, EmpIPCount: res.total });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {

                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    static deleteWhitelistIP(value) {
        self.setState({ deleteIP: value, showDeleteIPModal: true, })
    }

    _deleteWhitelistIP = () => {
        const { token } = this.props;
        const { deleteIP } = this.state;

        self.setState({ loader: true });
        ApiUtils.deleteEmpWhitelistIP(token, deleteIP)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    if (res.status == 200) {
                        self.setState({
                            deleteIP: '', errType: 'Success', errMsg: true, errMessage: res.message
                        });
                        self._closeDeleteIPModal();
                        self._getAllWhitelistIP();
                    } else if (res.status == 403) {
                        self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            self.props.logout();
                        });
                    } else {
                        self.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    }
                    self.setState({ loader: false });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, loader: false });
                }
            })
            .catch(() => {
                self.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _onChangeFields(field, e) {
        if (e.target.value.trim() == "") {
            this.setState({ [field]: '' });
        } else {
            this.setState({ [field]: e.target.value });
        }
    }

    _showAddIPModal = () => {
        this.setState({ showAddIPModal: true });
    }

    _closeDeleteIPModal = () => {
        this.setState({ showDeleteIPModal: false });
    }

    _closeAddIPModal = () => {
        this.setState({ showAddIPModal: false });
    }

    _handleIPPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllWhitelistIP();
        });
    }

    render() {
        const { allIPAddresses, errMsg, errType, loader, showDeleteIPModal, showAddIPModal,
            EmpIPCount, page } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {whitelistTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._showAddIPModal}>Add IP Address</Button>
                                </div>
                                <AddIPModal
                                    emp_id={this.props.emp_id}
                                    showAddIPModal={showAddIPModal}
                                    closeAddModal={this._closeAddIPModal}
                                    getAllWhitelistIP={this._getAllWhitelistIP.bind(this, 1)}
                                />
                                {loader && <FaldaxLoader />}
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allIPAddresses}
                                    className="isoCustomizedTable"
                                />
                                {EmpIPCount > 0 && <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleIPPagination.bind(this)}
                                    pageSize={5}
                                    current={page}
                                    total={EmpIPCount}
                                />}
                                {
                                    showDeleteIPModal &&
                                    <Modal
                                        title="Delete IP"
                                        visible={showDeleteIPModal}
                                        onCancel={this._closeDeleteIPModal}
                                        footer={[
                                            <Button onClick={this._closeDeleteIPModal}>No</Button>,
                                            <Button onClick={this._deleteWhitelistIP}>Yes</Button>,
                                        ]}
                                    >
                                        Are you sure you want to remove this IP Address ?
                                    </Modal>
                                }
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper >
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(EmployeeWhitelist);
