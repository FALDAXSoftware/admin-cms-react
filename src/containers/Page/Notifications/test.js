import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Divider, notification, Checkbox } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;
const EditableContext = React.createContext();

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
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
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

class EditableNotificationTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Asset',
                dataIndex: 'coin',
            },
            {
                title: 'Limit',
                dataIndex: 'limit',
                editable: true,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                render: (text, record) => {
                    return (
                        <span>
                            <Checkbox
                                checked={this.state.is_email_notification}
                                onChange={this._changeCheckbox}
                            >
                                Email Notification
                            </Checkbox>
                            <Checkbox
                                checked={this.state.is_sms_notification}
                                onChange={this._changeCheckbox}
                            >
                                SMS Notification
                            </Checkbox>
                        </span>
                    );
                },
            },
            {
                title: 'Actions',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        href="javascript:;"
                                        onClick={() => this.save(form, record.id)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Save
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                            <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                                Edit
                    </a>
                        );
                },
            },
        ];
        this.state = {
            allNotifications: [],
            editingKey: ''
        };
    }

    _changeCheckbox(checked) {
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    isEditing = record => record.id === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save = (form, key) => {
        const { token } = this.props;
        let _this = this;
        form.validateFields((error, row) => {
            // if (error) {
            //     return;
            // }
            const newData = [...this.state.allNotifications];
            const index = newData.findIndex(item => key === item.id);

            let formData = {
                id: newData[index].id,
                limit: parseInt(row.limit),
                coin_id: newData[index].coin_id
            }

            _this.setState({ loader: true });
            ApiUtils.updateAssetLimits(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'Success' }, () => {
                            _this._getAllNotificationValues();
                        });
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
                        errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                    });
                });


            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ allNotifications: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ allNotifications: newData, editingKey: '' });
            }
        });
    }

    _getAllNotificationValues = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAdminThresholds(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allNotifications: res.data });
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
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllNotificationValues();
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const { allNotifications, loader, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }
        const components = {
            body: {
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
                    inputType: col.dataIndex === 'number',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <div className="isoLayoutContent">
                {
                    allNotifications.length > 0 ?
                        allNotifications.map((notifications) => {
                            return (
                                <div>
                                    <Divider orientation="left">{notifications.coin}</Divider>
                                    <EditableContext.Provider value={this.props.form}>
                                        <Table
                                            components={components}
                                            bordered
                                            dataSource={[{ ...notifications }]}
                                            columns={columns}
                                            rowClassName="editable-row"
                                            pagination={false}
                                        />
                                    </EditableContext.Provider>
                                </div>
                            )
                        }) : 'NO DATA FOUND'
                }
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

const Notifications = Form.create()(EditableNotificationTable);

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(Notifications);
