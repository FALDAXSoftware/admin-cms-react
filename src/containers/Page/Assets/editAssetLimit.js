import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Divider, notification } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import { isAllowed } from "../../../helpers/accessControl";
const isFloat=(n)=>{
    return Number(n) === n && n % 1 !== 0;
  }
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
                                // {
                                //     required: true,
                                //     message: `Please Input ${title}!`,
                                // },
                                {
                                    pattern: regEx,
                                    message: "Please Enter Valid Positive Number"

                                }

                            ],
                            // initialValue: (parseFloat(record[dataIndex]) > 0)?(parseFloat(record[dataIndex])).toPrecision(8):"0",
                            initialValue: isFloat(record[dataIndex])?parseFloat(record[dataIndex]).toFixed(8):parseFloat(record[dataIndex]),
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
        this.columns = [
            {
                key:"1",
                title: 'Daily Withdraw Crypto',
                dataIndex: 'daily_withdraw_crypto',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"2",
                title: 'Daily Withdraw Fiat',
                dataIndex: 'daily_withdraw_fiat',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"3",
                title: 'Monthly Withdraw Crypto',
                dataIndex: 'monthly_withdraw_crypto',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"4",
                title: 'Monthly Withdraw Fiat',
                dataIndex: 'monthly_withdraw_fiat',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"7",
                title: 'Min Withdrawal Crypto',
                dataIndex: 'min_withdrawl_crypto',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"5",
                title: 'Min Withdrawal Fiat',
                dataIndex: 'min_withdrawl_fiat',
                editable: true,
                render:(data)=><span>{isFloat(data)?parseFloat(data).toFixed(8):parseFloat(data)}</span>
            },
            {
                key:"6",
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
                            <span>{isAllowed("edit_limit") && <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>Edit</a>}</span>
                        );
                },
            },
        ];
        this.state = {
            allAssetLimit: [],
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
        const { token, coin_id } = this.props;
        let _this = this;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.allAssetLimit];
            const index = newData.findIndex(item => key === item.id);

            let formData = {
                id: newData[index].id,
                coin_id: newData[index].coin_id,
                daily_withdraw_crypto: parseFloat(row.daily_withdraw_crypto)>0?parseFloat(row.daily_withdraw_crypto).toFixed(8):parseFloat(row.daily_withdraw_crypto),
                daily_withdraw_fiat: parseFloat(row.daily_withdraw_fiat)>0?parseFloat(row.daily_withdraw_fiat).toFixed(8):parseFloat(row.daily_withdraw_fiat),
                min_withdrawl_crypto: parseFloat(row.min_withdrawl_crypto)>0?parseFloat(row.min_withdrawl_crypto).toFixed(8):parseFloat(row.min_withdrawl_crypto),
                min_withdrawl_fiat:parseFloat(row.min_withdrawl_fiat)>0?parseFloat(row.min_withdrawl_fiat).toFixed(8):parseFloat(row.min_withdrawl_fiat),
                monthly_withdraw_crypto: parseFloat(row.monthly_withdraw_crypto)>0?parseFloat(row.monthly_withdraw_crypto).toFixed(8):parseFloat(row.monthly_withdraw_crypto),
                monthly_withdraw_fiat: parseFloat(row.monthly_withdraw_fiat)>0?parseFloat(row.monthly_withdraw_fiat).toFixed(8):parseFloat(row.monthly_withdraw_fiat),
            }

            _this.setState({ loader: true });
            ApiUtils.updateAssetLimits(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'Success' }, () => {
                            _this._getAllAssetLimit();
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
                        errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                    });
                });


            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ allAssetLimit: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ allAssetLimit: newData, editingKey: '' });
            }
        });
    }

    _getAllAssetLimit = () => {

        const { token, coin_id } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAssetLimits(token, coin_id)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allAssetLimit: res.data });
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
        this._getAllAssetLimit();
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const { allAssetLimit, loader, errMsg, errType } = this.state;
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
                    allAssetLimit.length > 0 ?
                        allAssetLimit.map((asset,index) => {
                            return (
                                <div>
                                    <Divider key={"div"+index} orientation="left">Tier {asset.tier_step}</Divider>
                                    <EditableContext.Provider key={index} value={this.props.form}>
                                        <Table
                                            rowKey="id"
                                            components={components}
                                            bordered
                                            dataSource={[{ ...asset }]}
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

const EditAssetLimit = Form.create()(EditableTable);

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditAssetLimit);
