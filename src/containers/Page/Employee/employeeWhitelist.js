import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Button, notification, Modal, Pagination, Switch } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';
import { whitelistTableInfos } from "../../Tables/antTables";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import AddIPModal from './addIPModal';
import FaldaxLoader from '../faldaxLoader';
import AddPermanentIPModal from './addPermanentIPModal';
import styled from 'styled-components';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;
var self;

const StatusSwitch = styled(Switch)`
width: 67px;
text-align: center;
height: 30px !important;
line-height: 26px !important;
margin-left: 11px !important;
&::after{
    width: 26px !important;
    height: 26px !important;
}
`

class EmployeeWhitelist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            limit: 20,
            EmpIPCount: 0,
            allIPAddresses: '',
            showDeleteIPModal: false,
            showAddIPModal: false,
            showAddPermanentIPModal: false,
        }
        self = this;
        this.validator = new SimpleReactValidator();
        EmployeeWhitelist.deleteWhitelistIP = EmployeeWhitelist.deleteWhitelistIP.bind(this)
    }

    componentDidMount = () => {
        this._getAllWhitelistIP();
        this._getEmployeeDetails();
    }

    _getAllWhitelistIP = () => {
        const { token, emp_id } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        ApiUtils.getAllUserWhitelistIP(token, emp_id, page, limit)
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
                console.error(err)
            });
    }

    _getEmployeeDetails = () => {
        const { token, emp_id } = this.props;
        let _this = this;

        ApiUtils.getEmployeeDetails(token, emp_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ isWhitelist: res.data.is_whitelist_ip });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {

                }
            })
            .catch((err) => {
                console.error(err)
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
                    errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.', loader: false
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

    _closeAddPermanentIPModal = () => {
        this.setState({ showAddPermanentIPModal: false, isWhitelist: true });
    }

    _handleIPPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllWhitelistIP();
        });
    }

    onClickOpenPermanentIpModal = async (checked) => {
        try {
          const {allIPAddresses } = this.state;
         
          if (checked) {
            if (allIPAddresses && allIPAddresses.length > 0) {
              await this.enableWhitelistIp(true);
              this.setState({
                showAddPermanentIPModal: false,
                isWhitelist: true
              });
            } else {
              this.setState({
                showAddPermanentIPModal: true,
                isWhitelist: false
              });
            }
          } else {
            await this.enableWhitelistIp(false);
            this.setState({
              showAddPermanentIPModal: false,
              isWhitelist: false
            });
          }
        } catch (error) {
          console.error("Error in whitelist",error);
        }
      };
    
      enableWhitelistIp=async(checked) =>{
        try {
          const { token} = this.props;
          let formData = {
            status: checked,
            user_id: this.props.emp_id
          };
          this.setState({loader:true});
          let res = await (
            await ApiUtils.enableWhitelist(token, formData)
          ).json();
          if (res.status == 200) {
            this.setState({
              showAddPermanentIPModal: checked ? true : false,
              isWhitelist: !checked ? false : true,
              errMsg: true,
              errType: "success",
              errMessage: res.message,
              loader:false
            });
          } else if (res.status == 403) {
            this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" ,loader:false},
              () => {
                this.props.logout();
              }
            );
          } else {
            this.setState({
              errMsg: true,
              errMessage: res.message,
              errType: "error",
              loader:false
            });
          }
        } catch (error) {
          this.setState({
            errMsg: true,
            errMessage: "Some thing went to wrong",
            errType: "error"
          });
        }
      }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getAllWhitelistIP();
            this._getEmployeeDetails();
        });
    }

    render() {
        const { allIPAddresses, errMsg, errType, loader, showDeleteIPModal, showAddIPModal,
            EmpIPCount, page, isWhitelist, showAddPermanentIPModal, limit } = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
                <TableDemoStyle className="isoLayoutContent">
                    <span>Whitelist:</span>
                    <Switch className="whitelist-btn" disabled={!isAllowed("update_employee")} checkedChildren="Enabled" unCheckedChildren="Disabled" checked={isWhitelist} onChange={this.onClickOpenPermanentIpModal} />
                    {showAddPermanentIPModal && <AddPermanentIPModal
                        emp_id={this.props.emp_id}
                        showAddPermanentIPModal={showAddPermanentIPModal}
                        closeAddModal={this._closeAddPermanentIPModal}
                        getAllWhitelistIP={this._getAllWhitelistIP.bind(this)}
                        enableWhitelistIp={this.enableWhitelistIp} />}
                    {isWhitelist && !showAddPermanentIPModal &&
                        <div style={{ marginTop: '20px' }}>
                            {
                                whitelistTableInfos.map(tableInfo => (
                                    <div>
                                        <div style={{ "display": "inline-block", "width": "100%" }}>
                                            <Button type="primary" style={{ "marginBottom": "15px" }} disabled={!isAllowed("update_employee")} onClick={this._showAddIPModal}>Add IP Address</Button>
                                        </div>
                                        <AddIPModal
                                            emp_id={this.props.emp_id}
                                            showAddIPModal={showAddIPModal}
                                            closeAddModal={this._closeAddIPModal}
                                            getAllWhitelistIP={this._getAllWhitelistIP.bind(this)}
                                        />
                                        {loader && <FaldaxLoader />}
                                        < TableWrapper
                                            rowKey="id"
                                            {...this.state}
                                            columns={tableInfo.columns}
                                            pagination={false}
                                            dataSource={allIPAddresses}
                                            className="isoCustomizedTable"
                                        />
                                        {
                                            EmpIPCount > 0 && <Pagination
                                                style={{ marginTop: '15px' }}
                                                className="ant-users-pagination"
                                                onChange={this._handleIPPagination.bind(this)}
                                                pageSize={limit}
                                                current={page}
                                                total={EmpIPCount}
                                                showSizeChanger
                                                onShowSizeChange={this._changePaginationSize}
                                                pageSizeOptions={pageSizeOptions}
                                            />
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
                                ))
                            }
                        </div>
                    }
                </TableDemoStyle>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(EmployeeWhitelist);
