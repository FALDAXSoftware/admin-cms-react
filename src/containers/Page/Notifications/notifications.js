import React from 'react';
import { Table, Input, Form, Popconfirm, InputNumber, Button, Checkbox, notification, Divider } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from '../../../helpers/accessControl';
import { messages } from '../../../helpers/messages'
import styled from 'styled-components';

const SaveBtn = styled(Button)`
    float: right;
    margin: 10px !important;
`
const regEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;

const EditableContext = React.createContext();
const { logout } = authAction;

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  pattern: regEx,
                  message: "Please Enter Valid Positive Number"
                },
              ],
              initialValue: (parseFloat(record[dataIndex]) || undefined),
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      fields: {},
      editingKey: ""
    };
    this.columns = [
      {
        title: "Asset",
        dataIndex: "coin"
      },
      {
        title: "First Limit",
        dataIndex: "fist_limit",
        editable: true
      },
      {
        title: "Second Limit",
        dataIndex: "second_limit",
        editable: true
      },
      {
        title: "Third Limit",
        dataIndex: "third_limit",
        editable: true
      },
      {
        title: "Email Notification",
        dataIndex: "is_email_notification",
        render: (text, record) => {
          return this.state.dataSource.length >= 1 ? (
            <Checkbox
              key={record.coin_id}
              checked={record.is_email_notification}
              onChange={this._checkEmail.bind(this, record)}
              disabled={(this.state.editingKey != record.coin_id)}
            >
              Email{text}
            </Checkbox>
          ) : null;
        }
      },
      {
        title: "SMS Notification",
        dataIndex: "is_sms_notification",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Checkbox
              key={record.coin_id}
              checked={record.is_sms_notification}
              onChange={this._checkSMS.bind(this, record)}
              disabled={(this.state.editingKey != record.coin_id)}
            >
              SMS
            </Checkbox>
          ) : null
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.coin_id)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.coin_id)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : 
              isAllowed("add_admin_thresholds") &&(<a
                disabled={editingKey !== ""}
                onClick={() => this.edit(record.coin_id)}
              >
                Edit
            </a>)
          
        }
      }
    ];
    this.validator = new SimpleReactValidator();
  }
  isEditing = record => record.coin_id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  isValidRow = (data) => {

    let { fist_limit, second_limit, third_limit } = data;
    if (fist_limit && second_limit && third_limit) {
      if (parseFloat(fist_limit) > parseFloat(second_limit)) {
        if (parseFloat(second_limit) > parseFloat(third_limit)) {
          return true;
        } else {
          this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.second_gt_third_limit })
          return false;
        }
      } else {
        this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.first_gt_second_limit })
      }
    } else if (fist_limit && second_limit) {
      if (parseFloat(fist_limit) > parseFloat(second_limit)) {
        return true;
      } else {
        this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.first_gt_second_limit })
        return false;
      }
    } else if (fist_limit && third_limit) {
      this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.second_required })
      return false;
    } else if (second_limit && third_limit) {
      this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.first_required })
      return false;
    } else if (second_limit) {
      this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.first_required })
      return false
    } else if (third_limit) {
      this.setState({ errMsg: true, errType: 'error', errMessage: messages.notification.thresh_hold.first_second_required })
      return false;
    } else {
      return true;
    }
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (!this.isValidRow(row)) {
        return
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => key === item.coin_id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ dataSource: newData, editingKey: "" },()=>this._saveAll());
      } else {
        newData.push(row);
        this.setState({ dataSource: newData, editingKey: "" });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  _checkEmail = (e, data) => {
    this.state.dataSource.map(value => {
      if (value.coin_id == e.coin_id) {
        let tempObj = value;
        Object.assign(tempObj, { is_email_notification: data.target.checked });
        this.setState({ is_email_notification: data.target.checked });
      }
    });
  };

  _checkSMS = (e, data) => {
    this.state.dataSource.map(value => {
      if (value.coin_id == e.coin_id) {
        let tempObj = value;
        Object.assign(tempObj, { is_sms_notification: data.target.checked });
        this.setState({ is_sms_notification: data.target.checked });
      }
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  componentDidMount = () => {
    if (isAllowed("get_admin_thresholds_contacts"))  this._getAdminContactDetails();
    if (isAllowed("get_admin_thresholds")) this._getAllNotificationValues();
  };

  _getAllNotificationValues = () => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAdminThresholds(token)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ dataSource: res.data });
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
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _getAdminContactDetails = () => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAdminContactDetails(token)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ fields: res.data.value });
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
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _storeContactDetails = () => {
    const { token } = this.props;
    let { fields } = this.state;

    if (this.validator.allValid()) {
      this.setState({ loader: true });
      let formData = {
        email: fields["email"],
        phone: fields["phone"]
      };

      ApiUtils.storeContactDetails(token, formData)
        .then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            this.setState({
              errType: "Success",
              errMsg: true,
              errMessage: res.message,
              loader: false
            });
          } else if (res.status == 403) {
            this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                this.props.logout();
              }
            );
          } else {
            this.setState({
              errMsg: true,
              errMessage: res.err,
              loader: false,
              errType: "error",
              isDisabled: false
            });
          }
        })
        .catch(() => {
          this.setState({
            errType: "error",
            errMsg: true,
            errMessage: "Something went wrong",
            loader: false
          });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  _handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target.value.trim() == "") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({ fields });
  };

  _saveAll = () => {
    const { token } = this.props;

    this.setState({ loader: true });
    ApiUtils.saveAllNotification(token, this.state.dataSource)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          this.setState({
            errType: "Success",
            errMsg: true,
            errMessage: res.message,
            loader: false
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errMsg: true,
            errMessage: res.err,
            loader: false,
            errType: "error",
            isDisabled: false
          });
        }
      })
      .catch(() => {
        this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Something went wrong",
          loader: false
        });
      });
  };

  render() {
    const { dataSource, loader, fields, errMsg, errType } = this.state;
    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        {isAllowed("get_admin_thresholds_contacts") &&
          <div>

            <Divider orientation="left">Contact Information</Divider>
            <div className="isoLayoutContent" style={{ marginTop: "10px" }}>
              <span>
                <b>Email Address</b>
              </span>
              <Input
                placeholder="Email Address"
                style={{ marginBottom: "15px", display: "inherit" }}
                onChange={this._handleChange.bind(this, "email")}
                value={fields["email"]}
              />
              <span className="field-error">
                {this.validator.message(
                  "Email Address",
                  fields["email"],
                  "required"
                )}
              </span>

              <span>
                <b>Phone Number</b>
              </span>
              <Input
                placeholder="Phone Number"
                style={{ marginBottom: "15px", display: "inherit" }}
                onChange={this._handleChange.bind(this, "phone")}
                value={fields["phone"]}
              />
              <span className="field-error">
                {this.validator.message(
                  "Phone Number",
                  fields["phone"],
                  "required"
                )}
              </span>
             {isAllowed("add_admin_thresholds_contacts") && <Button
                onClick={this._storeContactDetails}
                htmlType="submit"
                type="primary"
              >Submit</Button>}
            </div>
          </div>
        }
        {isAllowed("get_admin_thresholds") &&

          <div>
            <Divider orientation="left">Notification Thresholds</Divider>
            <EditableContext.Provider value={this.props.form}>
              <Table
                className="isoLayoutContent"
                components={components}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
            </EditableContext.Provider>
          </div>
        }

        {loader && <FaldaxLoader />}
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get('token')
  }), { logout })(Form.create()(EditableTable));
