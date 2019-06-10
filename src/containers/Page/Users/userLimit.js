import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, notification } from 'antd';
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

class EditableUserLimitTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Asset',
                dataIndex: 'coin',
            },
            {
                title: 'Daily Withdraw Crypto',
                dataIndex: 'daily_withdraw_crypto',
                editable: true,
            },
            {
                title: 'Daily Withdraw Fiat',
                dataIndex: 'daily_withdraw_fiat',
                editable: true,
            },
            {
                title: 'Monthly Withdraw Crypto',
                dataIndex: 'monthly_withdraw_crypto',
                editable: true,
            },
            {
                title: 'Monthly Withdraw Fiat',
                dataIndex: 'monthly_withdraw_fiat',
                editable: true,
            },
            {
                title: 'Min Withdrawl Crypto',
                dataIndex: 'min_withdrawl_crypto',
                editable: true,
            },
            {
                title: 'Min Withdrawl Fiat',
                dataIndex: 'min_withdrawl_fiat',
                editable: true,
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
            userAllLimits: [],
            editingKey: ''
        };
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
        const { token, user_id } = this.props;
        let _this = this;
        form.validateFields((error, row) => {
            const newData = [...this.state.userAllLimits];
            const index = newData.findIndex(item => key === item.id);
            console.log('newData', newData)

            let formData = {
                id: newData[index].id,
                coin_id: newData[index].coin_id,
                user_id: user_id,
                daily_withdraw_crypto: parseInt(row.daily_withdraw_crypto),
                daily_withdraw_fiat: parseInt(row.daily_withdraw_fiat),
                min_withdrawl_crypto: parseInt(row.min_withdrawl_crypto),
                min_withdrawl_fiat: parseInt(row.min_withdrawl_fiat),
                monthly_withdraw_crypto: parseInt(row.monthly_withdraw_crypto),
                monthly_withdraw_fiat: parseInt(row.monthly_withdraw_fiat)
            }

            // _this.setState({ loader: true });
            // ApiUtils.updateUserLimits(token, formData)
            //     .then((response) => response.json())
            //     .then(function (res) {
            //         if (res.status == 200) {
            //             _this.setState({ errMsg: true, errMessage: res.message, errType: 'Success' }, () => {
            //                 _this._getUserLimit();
            //             });
            //         } else if (res.status == 403) {
            //             _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
            //                 _this.props.logout();
            //             });
            //         } else {
            //             _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
            //         }
            //         _this.setState({ loader: false });
            //     })
            //     .catch(() => {
            //         _this.setState({
            //             errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
            //         });
            //     });

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ userAllLimits: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ userAllLimits: newData, editingKey: '' });
            }
        });
    }

    _getUserLimit = () => {
        const { token, user_id } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getUserLimits(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ userAllLimits: res.data });
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

    componentDidMount = () => {
        this._getUserLimit();
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const { userAllLimits, loader, errMsg, errType } = this.state;
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
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        components={components}
                        bordered
                        dataSource={userAllLimits}
                        columns={columns}
                        rowClassName="editable-row"
                        pagination={false}
                    />
                </EditableContext.Provider>
                {loader && <FaldaxLoader />}
            </div>
        );
    }
}

const UserLimit = Form.create()(EditableUserLimitTable);

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserLimit);
