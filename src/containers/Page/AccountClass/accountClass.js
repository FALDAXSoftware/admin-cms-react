import React, { Component } from "react";
import { Button, Tabs, notification, Modal, Input, Icon } from "antd";
import { accountClassTableinfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddAccountClassModal from './addAccountClassModal';
import EditAccountClassModal from './editAccountClass';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from '../../../helpers/accessControl';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class AccountClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      allAccountClasses: [],
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
      showAddClassModal: false,
      showEditAccountClassModal: false,
      showDeleteAccountClassModal: false,
      sorterCol: "id",
      sortOrder: "ASC",
      metabaseUrl:""
    };
    self = this;
    AccountClass.editAccountClass = AccountClass.editAccountClass.bind(this);
    AccountClass.deleteAccountClass = AccountClass.deleteAccountClass.bind(
      this
    );
    this.validator = new SimpleReactValidator();
  }

  static editAccountClass(value, class_name) {
    let accountClassDetails = {
      value,
      class_name
    };
    self.setState({ accountClassDetails, showEditAccountClassModal: true });
  }

  static deleteAccountClass(value, class_name) {
    self.setState({ showDeleteAccountClassModal: true, deleteClassId: value });
  }

  componentDidMount = () => {
    this._getAllAccountClasses();
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllAccountClasses = () => {
    const { token } = this.props;
    const { sorterCol, sortOrder } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllAccountClasses(token, sorterCol, sortOrder)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allAccountClasses: res.allClasses });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
        }
        _this.setState({ loader: false });
      })
      .catch(err => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  _showAddAccClassModal = () => {
    this.setState({ showAddClassModal: true });
  };

  _closeAddClassModal = () => {
    this.setState({ showAddClassModal: false });
  };

  _closeEditClassModal = () => {
    this.setState({ showEditAccountClassModal: false });
  };

  _closeDeleteClassModal = () => {
    const { fields } = this.state;

    fields["otp"] = "";
    this.setState({
      showDeleteAccountClassModal: false,
      fields,
      deleteClassId: ""
    });
    this.validator = new SimpleReactValidator();
  };

  _deleteAccountClass = () => {
    const { token, user } = this.props;
    const { deleteClassId, fields } = this.state;
    let _this = this;

    const formData = {
      admin_id: user.id,
      otp: fields["otp"],
      class_id: deleteClassId
    };

    if (this.validator.allValid()) {
      this.setState({ loader: true });
      ApiUtils.deleteAccountClass(token, formData)
        .then(response => response.json())
        .then(function (res) {
          if (res) {
            if (res.status == 200) {
              _this.setState(
                {
                  showDeleteAccountClassModal: false,
                  errMessage: res.message,
                  errMsg: true,
                  errType: "Success"
                },
                () => {
                  _this._getAllAccountClasses();
                }
              );
            } else if (res.status == 403) {
              _this.setState(
                { errMsg: true, errMessage: res.err, errType: "error" },
                () => {
                  _this.props.logout();
                }
              );
            } else {
              _this.setState({
                errMsg: true,
                errMessage: res.message,
                errType: "error"
              });
            }
          } else {
            _this.setState({ showDeleteAccountClassModal: false });
          }
          this.setState({ loader: false });
        })
        .catch(() => {
          _this.setState({ showDeleteCoinModal: false, loader: false });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  _onChangeFields(field, e) {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  }

  _handleClassTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllAccountClasses();
      }
    );
  };

  async getMetaBaseUrl(){
    try{
      this.setState({loader:true})
      let response= await (await ApiUtils.metabase(this.props.token).getAccountClassMetabase()).json();
      if(response.status==200){
         this.setState({metabaseUrl:response.frameURL})
      }else if(response.statue==400 || response.status==403){

      }
    }catch(error){

    }finally{
      this.setState({loader:false})
    }
  }

  onChangeTabs=(key)=>{
    if(key=="metabase" && this.state.metabaseUrl==""){
      this.getMetaBaseUrl();    
    }
  }

  render() {
    const {
      allAccountClasses,
      errType,
      errMsg,
      loader,
      showAddClassModal,
      accountClassDetails,
      showEditAccountClassModal,
      showDeleteAccountClassModal,
      fields,
      metabaseUrl
    } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width" onChange={this.onChangeTabs}>
          {accountClassTableinfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                {isAllowed("add_account_class") &&

                  <Button
                    type="primary"
                    style={{ marginBottom: "15px", float: "left" }}
                    onClick={this._showAddAccClassModal}
                  >
                    <Icon type="plus" />Add
                </Button>
                }
                {showAddClassModal && (
                  <AddAccountClassModal
                    showAddClassModal={showAddClassModal}
                    closeAddModal={this._closeAddClassModal}
                    getAllAccountClass={this._getAllAccountClasses.bind(
                      this,
                      0
                    )}
                  />
                )}
                {showEditAccountClassModal && (
                  <EditAccountClassModal
                    fields={accountClassDetails}
                    showEditAccountClassModal={showEditAccountClassModal}
                    closeEditClassModal={this._closeEditClassModal}
                    getAllAccountClass={this._getAllAccountClasses.bind(
                      this,
                      1
                    )}
                  />
                )}

                {loader && <FaldaxLoader />}
                <div className="float-clear">
                  <TableWrapper
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={allAccountClasses}
                    className="isoCustomizedTable"
                    onChange={this._handleClassTableChange}
                  />
                  {showDeleteAccountClassModal && (
                    <Modal
                      title="Delete Account Class"
                      visible={showDeleteAccountClassModal}
                      onCancel={this._closeDeleteClassModal}
                      footer={[
                        <Button onClick={this._closeDeleteClassModal}>
                          Cancel
                        </Button>,
                        this.props.is_twofactor ? (
                          <Button onClick={this._deleteAccountClass}>
                            Yes
                          </Button>
                        ) : (
                            ""
                          )
                      ]}
                    >
                      {this.props.user.is_twofactor ? (
                        <div>
                          <span>Enter your two-factor code here:</span>
                          <div style={{ marginTop: "20px" }}>
                            <Input
                              style={{ width: "200px" }}
                              value={fields["otp"]}
                              onChange={this._onChangeFields.bind(this, "otp")}
                            />
                          </div>
                          <span className="field-error">
                            {this.validator.message(
                              "OTP",
                              fields["otp"],
                              "required|numeric"
                            )}
                          </span>
                          <Button
                            type="primary"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            onClick={this._deleteAccountClass}
                          >
                            Delete Account Class
                          </Button>
                        </div>
                      ) : (
                          <div>
                            <span>
                              Enable two factor authentication to remove the
                              account class.
                          </span>
                            <br />
                            <Button
                              type="primary"
                              onClick={() => {
                                this.props.history.push(
                                  "/dashboard/edit-profile"
                                );
                              }}
                            >
                              Enable Now
                          </Button>
                          </div>
                        )}
                    </Modal>
                  )}
                </div>
              </TableDemoStyle>
            </TabPane>
          ))}
          <TabPane tab="Report" key="metabase">
              <TableDemoStyle className="isoLayoutContent">
                {metabaseUrl &&
                <div class="full-width">
                  <iframe
                    className="metabase-iframe"
                    src={metabaseUrl}
                    frameborder="0"
                    width="100%"
                    allowtransparency
                ></iframe>
                </div>
                }
              </TableDemoStyle>
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token"),
    user: state.Auth.get("user")
  }),
  { logout }
)(AccountClass);

export { AccountClass, accountClassTableinfos };
