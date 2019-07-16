import React, { Component } from 'react';
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Button, notification, Modal, Pagination } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../redux/auth/actions';
import { profileWhitelistTableInfos } from "../Tables/antTables";
import TableDemoStyle from '../Tables/antTables/demo.style';
import TableWrapper from "../Tables/antTables/antTable.style";
import AddProfileIPModal from './addProfileIPModal';
import FaldaxLoader from './faldaxLoader';

const { logout } = authAction;
var self;

class ProfileWhitelist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IPCount: 0,
            page: 1,
            limit: 5,
            allIPAddresses: '',
            showDeleteIPModal: false,
            showAddProfileIPModal: false
        }
        self = this;
        this.validator = new SimpleReactValidator();
        ProfileWhitelist.deleteProfileWhitelistIP = ProfileWhitelist.deleteProfileWhitelistIP.bind(this)
    }

    componentDidMount = () => {
        this._getAllWhitelistIP();
    }

    _getAllWhitelistIP = () => {
        const { token, user } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        ApiUtils.getAllWhitelistIP(token, user.id, page, limit)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allIPAddresses: res.data, IPCount: res.total });
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

    static deleteProfileWhitelistIP(value) {
        self.setState({ deleteIP: value, showDeleteIPModal: true, })
    }

    _deleteWhitelistIP = () => {
        const { token } = this.props;
        const { deleteIP } = this.state;

        self.setState({ loader: true });
        ApiUtils.deleteProfileWhitelistIP(token, deleteIP)
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

    _showAddProfileIPModal = () => {
        this.setState({ showAddProfileIPModal: true });
    }

    _closeDeleteIPModal = () => {
        this.setState({ showDeleteIPModal: false });
    }

    _closeAddIPModal = () => {
        this.setState({ showAddProfileIPModal: false });
    }

    _updateIPs = () => {
        const { token, user, emp_id } = this.props;
        let { ipAddress } = this.state;
        let _this = this;

        if (this.validator.allValid()) {
            _this.setState({ loader: true });

            let formData = {
                admin_id: emp_id,
                email: user.email,
                ip: ipAddress
            };

            ApiUtils.addWhitelistIP(token, formData)
                .then((response) => response.json())
                .then((res) => {
                    if (res.status == 200) {
                        _this.validator = new SimpleReactValidator();
                        _this.setState({
                            loader: false, errMsg: true, errType: res.err ? 'Error' : 'Success',
                            errMessage: res.err ? res.err : res.message
                        });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({
                            loader: false, errMsg: true, errType: 'Error', errMessage: res.message
                        });
                    }
                })
                .catch(err => {
                    _this.setState({ loader: false, errMsg: true });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _handleProfileIPPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllWhitelistIP();
        });
    }

    render() {
        const {
            allIPAddresses, errMsg, errType, loader, showDeleteIPModal,
            showAddProfileIPModal, page, IPCount
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <TableDemoStyle className="isoLayoutContent">
                {profileWhitelistTableInfos.map(tableInfo => (
                    <div tab={tableInfo.title} key={tableInfo.value}>
                        <div style={{ "display": "inline-block", "width": "100%" }}>
                            <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._showAddProfileIPModal}>Add IP Address</Button>
                        </div>
                        <AddProfileIPModal
                            showAddProfileIPModal={showAddProfileIPModal}
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
                        {
                            IPCount > 0 ?
                                <Pagination
                                    style={{ marginTop: '15px' }}
                                    className="ant-users-pagination"
                                    onChange={this._handleProfileIPPagination.bind(this)}
                                    pageSize={5}
                                    current={page}
                                    total={IPCount}
                                /> : ''
                        }
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
                    </div>
                ))}
            </TableDemoStyle>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(ProfileWhitelist);
