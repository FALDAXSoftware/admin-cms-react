import React, { Component } from 'react';
import ApiUtils from '../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Button, notification, Modal, Pagination, Switch } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../redux/auth/actions';
import { profileWhitelistTableInfos } from "../Tables/antTables";
import TableDemoStyle from '../Tables/antTables/demo.style';
import TableWrapper from "../Tables/antTables/antTable.style";
import AddProfileIPModal from './addProfileIPModal';
import FaldaxLoader from './faldaxLoader';
import styled from 'styled-components';
import AddProfilePermanentIPModal from './addProfilePermanentIPModal';

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

class ProfileWhitelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IPCount: 0,
      page: 1,
      limit: 5,
      allIPAddresses: "",
      showDeleteIPModal: false,
      showAddProfileIPModal: false
    };
    self = this;
    this.validator = new SimpleReactValidator();
    ProfileWhitelist.deleteProfileWhitelistIP = ProfileWhitelist.deleteProfileWhitelistIP.bind(
      this
    );
  }

  componentDidMount = () => {
    this._getAllWhitelistIP();
    this._getAdminDetails();
    this.setState({ isWhitelistEnabled: this.props.user.is_whitelist_ip });
  };

  _getAllWhitelistIP = () => {
    const { token, user } = this.props;
    const { page, limit } = this.state;
    let _this = this;

    ApiUtils.getAllWhitelistIP(token, user.id, page, limit)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({ allIPAddresses: res.data, IPCount: res.total });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  _getAdminDetails = () => {
    const { token, user, login } = this.props;
    let _this = this;

    ApiUtils.getAdminDetails(token, user.id)
      .then(response => response.json())
      .then(function(res) {
        if (res) {
          login({ user: res.data });
          _this.setState({
            isWhitelistEnabled: res.data.is_whitelist_ip
          });
        }
      })
      .catch(() => {
        _this.setState({ loader: false });
      });
  };

  static deleteProfileWhitelistIP(value) {
    self.setState({ deleteIP: value, showDeleteIPModal: true });
  }

  _deleteWhitelistIP = () => {
    const { token } = this.props;
    const { deleteIP } = this.state;

    self.setState({ loader: true });
    ApiUtils.deleteProfileWhitelistIP(token, deleteIP)
      .then(response => response.json())
      .then(function(res) {
        if (res) {
          if (res.status == 200) {
            self.setState({
              deleteIP: "",
              errType: "Success",
              errMsg: true,
              errMessage: res.message
            });
            self._closeDeleteIPModal();
            self._getAllWhitelistIP();
          } else if (res.status == 403) {
            self.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                self.props.logout();
              }
            );
          } else {
            self.setState({
              errMsg: true,
              errMessage: res.message,
              errType: "error"
            });
          }
          self.setState({ loader: false });
        } else {
          self.setState({
            errMsg: true,
            errMessage: res.message,
            loader: false
          });
        }
      })
      .catch(() => {
        self.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _onChangeFields(field, e) {
    if (e.target.value.trim() == "") {
      this.setState({ [field]: "" });
    } else {
      this.setState({ [field]: e.target.value });
    }
  }

  _showAddProfileIPModal = () => {
    this.setState({ showAddProfileIPModal: true });
  };

  _closeDeleteIPModal = () => {
    this.setState({ showDeleteIPModal: false });
  };

  _closeAddIPModal = () => {
    this.setState({ showAddProfileIPModal: false });
  };

  _closeAddPermanentIPModal = async() => {
    this.setState({
      showAddProfilePermanentIPModal: false,
      isWhitelistEnabled: true
    });
  };

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
        .then(response => response.json())
        .then(res => {
          if (res.status == 200) {
            _this.validator = new SimpleReactValidator();
            _this.setState({
              loader: false,
              errMsg: true,
              errType: res.err ? "Error" : "Success",
              errMessage: res.err ? res.err : res.message
            });
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              loader: false,
              errMsg: true,
              errType: "Error",
              errMessage: res.message
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
  };

  _handleProfileIPPagination = page => {
    this.setState({ page }, () => {
      this._getAllWhitelistIP();
    });
  };

  enableWhitelistIp=async(checked) =>{
    try {
      console.log(checked);
      const { token, user } = this.props;
      let formData = {
        status: checked,
        user_id: user.id
      };
      this.setState({loader:true});
      let res = await (
        await ApiUtils.enableProfileWhitelist(token, formData)
      ).json();
      if (res.status == 200) {
        this.setState({
          showAddProfilePermanentIPModal: checked ? true : false,
          isWhitelistEnabled: !checked ? false : true,
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
      console.log("Error in profileWhitelist", error);
      this.setState({
        errMsg: true,
        errMessage: "Some thing went to wrong",
        errType: "error"
      });
    }
  }

  onClickOpenPermanentIpModal = async (checked) => {
    try {
      console.log("checked call");
      const {allIPAddresses } = this.state;
     
      if (checked) {
        if (allIPAddresses && allIPAddresses.length > 0) {
          await this.enableWhitelistIp(true);
          this.setState({
            showAddProfilePermanentIPModal: false,
            isWhitelistEnabled: true
          });
        } else {
          this.setState({
            showAddProfilePermanentIPModal: true,
            isWhitelistEnabled: false
          });
        }
      } else {
        await this.enableWhitelistIp(false);
        this.setState({
          showAddProfilePermanentIPModal: false,
          isWhitelistEnabled: false
        });
      }
    } catch (error) {
      console.log("Error in whitelist",error);
    }
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllWhitelistIP();
    });
  };

  render() {
    const {
      allIPAddresses,
      errMsg,
      errType,
      loader,
      showDeleteIPModal,
      limit,
      showAddProfileIPModal,
      page,
      IPCount,
      isWhitelistEnabled,
      showAddProfilePermanentIPModal
    } = this.state;
    let pageSizeOptions = ["5", "10", "20"];
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <TableDemoStyle className="isoLayoutContent">
        <span>Whitelist:</span>
        <StatusSwitch
          checked={isWhitelistEnabled}
          onChange={this.onClickOpenPermanentIpModal}
        />
        {showAddProfilePermanentIPModal && (
          <AddProfilePermanentIPModal
            showAddProfilePermanentIPModal={showAddProfilePermanentIPModal}
            closeAddPermanentModal={this._closeAddPermanentIPModal}
            getAllWhitelistIP={this._getAllWhitelistIP.bind(this)}
            enableWhitelistIp={this.enableWhitelistIp}
          />
        )}
        {isWhitelistEnabled &&
          !showAddProfilePermanentIPModal &&
          profileWhitelistTableInfos.map(tableInfo => (
            <div
              tab={tableInfo.title}
              key={tableInfo.value}
              style={{ marginTop: "20px" }}
            >
              <div style={{ display: "inline-block", width: "100%" }}>
                <Button
                  type="primary"
                  style={{ marginBottom: "15px" }}
                  onClick={this._showAddProfileIPModal}
                >
                  Add IP Address
                </Button>
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
              {IPCount > 0 ? (
                <Pagination
                  style={{ marginTop: "15px" }}
                  className="ant-users-pagination"
                  onChange={this._handleProfileIPPagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={IPCount}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                ""
              )}
              {showDeleteIPModal && (
                <Modal
                  title="Delete IP"
                  visible={showDeleteIPModal}
                  onCancel={this._closeDeleteIPModal}
                  footer={[
                    <Button onClick={this._closeDeleteIPModal}>No</Button>,
                    <Button onClick={this._deleteWhitelistIP}>Yes</Button>
                  ]}
                >
                  Are you sure you want to remove this IP Address ?
                </Modal>
              )}
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
