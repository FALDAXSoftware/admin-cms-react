import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Divider } from 'antd';
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

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
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
            allAssetLimit: [],
            editingKey: ''
        };
    }

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
            console.log('row', index, newData)
            const { daily_withdraw_crypto, daily_withdraw_fiat, min_withdrawl_crypto, min_withdrawl_fiat } = newData;

            let formData = {
                id: newData.id,
                daily_withdraw_crypto,
                daily_withdraw_fiat,
                min_withdrawl_crypto,
                min_withdrawl_fiat
            }

            // _this.setState({ loader: true });
            // ApiUtils.updateAssetLimits(token, formData)
            //     .then((response) => response.json())
            //     .then(function (res) {
            //         if (res.status == 200) {
            //             _this.setState({ allAssetLimit: res.data });
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
                console.log('if')
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ allAssetLimit: newData, editingKey: '' });
            } else {
                console.log('else')
                newData.push(row);
                this.setState({ allAssetLimit: newData, editingKey: '' });
            }
        });
    }

    componentDidMount = () => {
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

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const { allAssetLimit, loader } = this.state;
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
                    allAssetLimit && allAssetLimit.map((asset) => {
                        return (
                            <div>
                                <Divider orientation="left">Tier {asset.tier_step}</Divider>
                                <EditableContext.Provider value={this.props.form}>
                                    <Table
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
                    })
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
