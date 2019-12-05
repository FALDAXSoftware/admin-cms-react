import React from 'react';
import { Table, Input, Form, Button, Checkbox, notification, Divider } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import styled from 'styled-components';
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from '../../../helpers/accessControl';

const SaveBtn = styled(Button)`
    float: right;
    margin: 10px !important;
`

const EditableContext = React.createContext();
const { logout } = authAction;

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = (e, data) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            fields: {}
        }
        this.columns = [
            {
                title: 'Asset',
                dataIndex: 'coin',
            },
            {
                title: 'First Limit',
                dataIndex: 'fist_limit',
                editable: true,
            },
            {
                title: 'Second Limit',
                dataIndex: 'second_limit',
                editable: true,
            },
            {
                title: 'Third Limit',
                dataIndex: 'third_limit',
                editable: true,
            },
            {
                title: 'Email Notification',
                dataIndex: 'is_email_notification',
                render: (text, record) => {
                    return (
                        this.state.dataSource.length >= 1 ?
                            <Checkbox key={record.coin_id} checked={record.is_email_notification} onChange={this._checkEmail.bind(this, record)}>Email{text}</Checkbox>
                            : null
                    )
                }
            },
            {
                title: 'SMS Notification',
                dataIndex: 'is_sms_notification',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Checkbox key={record.coin_id} checked={record.is_sms_notification} onChange={this._checkSMS.bind(this, record)}>SMS</Checkbox>
                    ) : null,
            },
        ];
        this.validator = new SimpleReactValidator();
    }

    _checkEmail = (e, data) => {
        this.state.dataSource.map((value) => {
            if (value.coin_id == e.coin_id) {
                let tempObj = value;
                Object.assign(tempObj, { is_email_notification: data.target.checked })
                this.setState({ is_email_notification: data.target.checked })
            }
        })
    }

    _checkSMS = (e, data) => {
        this.state.dataSource.map((value) => {
            if (value.coin_id == e.coin_id) {
                let tempObj = value;
                Object.assign(tempObj, { is_sms_notification: data.target.checked })
                this.setState({ is_sms_notification: data.target.checked })
            }
        })
    }

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };

    componentDidMount = () => {
        this._getAllNotificationValues();
        this._getAdminContactDetails();
    }

    _getAllNotificationValues = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAdminThresholds(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ dataSource: res.data });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _getAdminContactDetails = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAdminContactDetails(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ fields: res.data.value });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIcon = (type) => {
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
                email: fields['email'],
                phone: fields['phone']
            };

            ApiUtils.storeContactDetails(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errType: 'Success', errMsg: true, errMessage: res.message,
                            loader: false
                        })
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({
                            errMsg: true, errMessage: res.err, loader: false, errType: 'error', isDisabled: false
                        });
                    }
                })
                .catch(() => {
                    this.setState({
                        errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                        loader: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _saveAll = () => {
        const { token } = this.props;

        this.setState({ loader: true });
        ApiUtils.saveAllNotification(token, this.state.dataSource)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        errType: 'Success', errMsg: true, errMessage: res.message,
                        loader: false
                    })
                } else if (res.status == 403) {
                    this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        this.props.logout();
                    });
                } else {
                    this.setState({
                        errMsg: true, errMessage: res.err, loader: false, errType: 'error', isDisabled: false
                    });
                }
            })
            .catch(() => {
                this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                    loader: false
                });
            });
    }

    render() {
        const { dataSource, loader, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <div>
                {isAllowed("get_admin_thresholds_contacts") &&
                    <div>
                        <Divider orientation="left">Contact Information</Divider>
                        <div className="isoLayoutContent" style={{ "marginTop": "10px" }}>
                            <span>
                                <b>Email Address</b>
                            </span>
                            <Input
                                placeholder="Email Address"
                                style={{ "marginBottom": "15px", "display": "inherit" }}
                                onChange={this._handleChange.bind(this, 'email')}
                                value={fields['email']}
                            />
                            <span className="field-error">
                                {this.validator.message('Email Address', fields['email'], 'required')}
                            </span>

                            <span>
                                <b>Phone Number</b>
                            </span>
                            <Input
                                placeholder="Phone Number"
                                style={{ "marginBottom": "15px", "display": "inherit" }}
                                onChange={this._handleChange.bind(this, 'phone')}
                                value={fields['phone']}
                            />
                            <span className="field-error">
                                {this.validator.message('Phone Number', fields['phone'], 'required')}
                            </span>
                            {isAllowed("add_admin_thresholds_contacts") &&
                                <Button onClick={this._storeContactDetails} htmlType="submit" type="primary">Submit</Button>
                            }
                        </div>
                    </div>
                }

                {isAllowed("get_admin_thresholds") &&
                    <div>
                        <Divider orientation="left">Notification Thresholds</Divider>
                        {/* <Tooltip title="Click this button and it will store all values."> */}
                        {isAllowed("add_admin_thresholds") &&
                            <SaveBtn className="save-all-btn" htmlType="submit" type="primary" onClick={this._saveAll}>Save ALL</SaveBtn>
                        }
                        {/* </Tooltip> */}
                        <Table
                            className="isoLayoutContent"
                            components={components}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                        />
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
    }), { logout })(EditableTable);
