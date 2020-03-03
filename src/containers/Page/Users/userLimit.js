import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, notification } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import { isAllowed } from '../../../helpers/accessControl';
// import createNotification from '../../../components/notification';
import { messages } from '../../../helpers/messages';

const { logout } = authAction;
const EditableContext = React.createContext();
const regEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
class EditableCell extends React.Component {

    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        // console.log('>>>getFieldDecorator', getFieldDecorator)
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
        // console.log('>>>', record)
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                // {
                                //     required: true,
                                //     message: `Please Input ${title}!`,
                                // },
                                {
                                    pattern: regEx,
                                    message: "Please Enter Valid Positive Number"

                                }
                            ],
                            initialValue: typeof record[dataIndex]=="number" ?parseFloat(record[dataIndex]):undefined,
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
                                        onClick={() => this.save(form, record.key)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Save
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                           <>{isAllowed("update_user_limit") && <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                                Edit
                           </a>}</>
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

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    validateMinCryptoLimit=(rowData,key)=>{
        let {userAllLimits}=this.state;
        let data=userAllLimits.find(ele=>ele.key==key)
        if(rowData.daily_withdraw_crypto && (!rowData.monthly_withdraw_crypto) && (parseFloat(rowData.daily_withdraw_crypto) < parseFloat(data.min_limit))){
            this.setState({ errMsg: true, errMessage: messages.notification.limit_Management.min_daily_withdraw_crypto+" "+data.min_limit, errType: 'Error' });
            return false;
        }if(rowData.daily_withdraw_crypto && rowData.monthly_withdraw_crypto && (parseFloat(rowData.monthly_withdraw_crypto) <= parseFloat(rowData.daily_withdraw_crypto))){
            this.setState({ errMsg: true, errMessage: messages.notification.limit_Management.min_monthly_max_daily_withdraw_crypto, errType: 'Error' });
            return false;
        }if((!rowData.daily_withdraw_crypto) && rowData.monthly_withdraw_crypto && parseFloat(rowData.monthly_withdraw_crypto) < parseFloat(data.min_limit)){
            this.setState({ errMsg: true, errMessage: messages.notification.limit_Management.min_daily_withdraw_crypto+" "+data.min_limit, errType: 'Error' });
            return false;
        }if(rowData.daily_withdraw_crypto && rowData.min_withdrawl_crypto && parseFloat(rowData.min_withdrawl_crypto)>parseFloat(rowData.daily_withdraw_crypto)){
            this.setState({ errMsg: true, errMessage: messages.notification.limit_Management.min_daily_withdraw_crypto_lte_daily_withdraw_crypto, errType: 'Error' });
            return false;
        }
        if((!rowData.daily_withdraw_crypto) && rowData.monthly_withdraw_crypto && rowData.min_withdrawl_crypto && parseFloat(rowData.min_withdrawl_crypto)>parseFloat(rowData.monthly_withdraw_crypto)){
            this.setState({ errMsg: true, errMessage: messages.notification.limit_Management.min_withdraw_crypto_lte_monthly_withdraw_crypto, errType: 'Error' });
            return false;
        }
        return true;
    }

    save = (form, key) => {
        const { token, user_id } = this.props;
        let _this = this;
        form.validateFields((error, row) => {
            let isValid=this.validateMinCryptoLimit(row,key);
            if(!isValid){
                return false;
            }
            // console.log('error', error, row)
            if (error) {
                return;
            }
            const newData = [...this.state.userAllLimits];
            const index = newData.findIndex(item => key === item.key);

            let formData = {
                // id: newData[index].id,
                coin_id: newData[index].coin_table_id,
                user_id: user_id,
                daily_withdraw_crypto: parseFloat(row.daily_withdraw_crypto),
                daily_withdraw_fiat: parseFloat(row.daily_withdraw_fiat),
                min_withdrawl_crypto: parseFloat(row.min_withdrawl_crypto),
                min_withdrawl_fiat: parseFloat(row.min_withdrawl_fiat),
                monthly_withdraw_crypto: parseFloat(row.monthly_withdraw_crypto),
                monthly_withdraw_fiat: parseFloat(row.monthly_withdraw_fiat)
            }

            _this.setState({ loader: true });
            ApiUtils.updateUserLimits(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'Success' }, () => {
                            _this._getUserLimit();
                        });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'Error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'Error' });
                    }
                    _this.setState({ loader: false });
                })
                .catch(() => {
                    _this.setState({
                        errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'Error', loader: false
                    });
                });

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
                    let data = [];
                    for (let index = 0; index < res.data.length; index++) {
                        let element = res.data[index];
                        data.push({
                            key: parseInt(index + 1).toString(),
                            ...element
                        })
                    }
                    _this.setState({ userAllLimits: data });

                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'Error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'Error' });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'Error', loader: false
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
            <div className="isoLayoutContent scroll-table">
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
