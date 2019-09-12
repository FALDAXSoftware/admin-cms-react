import React from 'react';
import { Table, Input, Form, Button, Checkbox, notification, Pagination, Row } from 'antd';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import moment from "moment";
import ColWithPadding from '../common.style';
import { Link } from 'react-router-dom';
import { buffers } from 'redux-saga';

const EditableContext = React.createContext();
const { logout } = authAction;
const Search = Input.Search;

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

class BatchBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allBatches: [],
            fields: {},
            page: 1,
            limit: 50,
            batchCount: 0,
            transactionID: ''
        }
        this.columns = [
            {
                title: 'Batch',
                dataIndex: 'batch_number',
                render: (text, record) =>
                    this.state.allBatches.length >= 1 ? (
                        <Button onClick={() => { this.props.history.push(`/dashboard/batch-and-balance/${record.batch_number}`) }}>{record.batch_number}</Button>
                    ) : null,
            },
            {
                title: 'Transactions',
                dataIndex: 'transaction_start',
                render: (text, record) =>
                    this.state.allBatches.length >= 1 ? (
                        <span>{record.transaction_start} - {record.transaction_end}</span>
                    ) : null,
            },
            {
                title: 'Batch Date',
                dataIndex: 'batch_date',
                render: (text, record) => (<span>{moment.utc(record.batch_date).local().format("DD MMM YYYY HH:mm:ss")}</span>)
            },
            {
                title: 'Purchases',
                dataIndex: 'is_purchased',
                render: (text, record) =>
                    this.state.allBatches.length >= 1 ? (
                        <Checkbox key={record.id} checked={record.is_purchased} onChange={this._checkBatch.bind(this, 'is_purchased', record)}>Purchase</Checkbox>
                    ) : null,
            },
            {
                title: 'Withdrawals',
                dataIndex: 'is_withdrawled',
                render: (text, record) =>
                    this.state.allBatches.length >= 1 ? (
                        <Checkbox key={record.id} checked={record.is_withdrawled} onChange={this._checkBatch.bind(this, 'is_withdrawled', record)}>Withdrawals</Checkbox>
                    ) : null,
            },
            {
                title: 'Manual Withdrawals',
                dataIndex: 'is_manual_withdrawled',
                render: (text, record) =>
                    this.state.allBatches.length >= 1 ? (
                        <Checkbox key={record.id} checked={record.is_manual_withdrawled} onChange={this._checkBatch.bind(this, 'is_manual_withdrawled', record)}>Manual Withdraw</Checkbox>
                    ) : null,
            },
            {
                title: 'Net Profit',
                dataIndex: 'net_profit',
            },
            {
                title: 'Download',
                dataIndex: 'download',
                render: (text, record) => {
                    return (
                        <Button type="primary" icon="download">Download</Button>
                    )
                }
            },
            {
                title: 'Upload',
                dataIndex: 'upload',
                render: (text, record) => {
                    return (
                        <div>
                            <input id="myInput"
                                type="file"
                                ref={(ref) => this.upload = ref}
                                style={{ display: 'none' }}
                                onChange={this.onChangeFile.bind(this)}
                            />
                            <Button type="primary" icon="upload" onClick={() => this.upload.click(this, record)}>Upload</Button>
                        </div >
                    )
                }
            }
        ];
        this.validator = new SimpleReactValidator();
    }

    onChangeFile = (e, data) => {
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];

        this.setState({ file });
    }

    _checkBatch = (e, data, val) => {
        let updatedBatch;
        this.state.allBatches.map((batch) => {
            if (batch.batch_number == data.batch_number) {
                batch[e] = !data[e];
                updatedBatch = batch;
            }
        })
        const { token } = this.props;
        let _this = this;
        let formData = {
            batch_id: updatedBatch.batch_number,
            is_purchased: updatedBatch.is_purchased,
            is_withdrawled: updatedBatch.is_withdrawled,
            is_manual_withdrawled: updatedBatch.is_manual_withdrawled
        }

        _this.setState({ loader: true });
        ApiUtils.updateBatch(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState((prevState) => ({
                        errMsg: true, errMessage: res.message, errType: 'Success',
                        allBatches: [
                            ...prevState.allBatches.slice(0, updatedBatch.batch_number),
                            updatedBatch,
                            ...prevState.allBatches.slice(updatedBatch.batch_number + 1)
                        ]
                    }))
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch((err) => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    handleSave = row => {
        const newData = [...this.state.allBatches];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ allBatches: newData });
    };

    componentDidMount = () => {
        this._getAllBatches();
    }

    _getAllBatches = () => {
        const { token } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllBatches(token, page, limit)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allBatches: res.data.batches, batchCount: res.data.batch_count });
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

    _searchBatch = (val) => {
        this.setState({ searchBatch: val, page: 1 }, () => {
            this._getAllBatches();
        });
    }

    _handleBatchPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllBatches();
        })
    }

    _createBatch = () => {
        const { token } = this.props;
        const { transactionID } = this.state;
        let _this = this;
        let formData = {
            last_transaction_id: transactionID
        }

        _this.setState({ loader: true });
        ApiUtils.createBatch(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'Success' });
                    _this._getAllBatches();
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
                }
                _this.setState({ loader: false, transactionID: '' });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _changeTransID = (field, e) => {
        this.setState({ transactionID: field.target.value })
    }

    render() {
        const { allBatches, loader, errMsg, errType, batchCount, page, limit, transactionID } = this.state;
        let pageSizeOptions = ['20', '30', '40', '50']
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
            <LayoutWrapper>
                <div className="isoLayoutContent scroll-table">
                    <div style={{ "display": "inline-block", "width": "100%" }}>
                        <Form layout="inline" onSubmit={this._createBatch}>
                            <Row type="flex" justify="end">
                                <ColWithPadding sm={6}>
                                    <label>Last Transaction ID</label>
                                </ColWithPadding>
                                <ColWithPadding sm={7}>
                                    <Input
                                        placeholder="Enter Last Transaction ID"
                                        onChange={this._changeTransID.bind(this)}
                                        value={transactionID}
                                    />
                                </ColWithPadding>
                                <ColWithPadding sm={5}>
                                    <Button className="search-btn" type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._createBatch}>Create Batch</Button>
                                </ColWithPadding>
                            </Row>
                        </Form>
                    </div>
                    <Table
                        components={components}
                        bordered
                        dataSource={allBatches}
                        columns={columns}
                        pagination={false}
                    />
                    {batchCount > 0 ?
                        <Pagination
                            style={{ marginTop: '15px' }}
                            className="ant-users-pagination"
                            onChange={this._handleBatchPagination.bind(this)}
                            pageSize={limit}
                            current={page}
                            total={batchCount}
                            showSizeChanger
                            onShowSizeChange={this._changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
                        /> : ''}
                    {loader && <FaldaxLoader />}
                </div>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(BatchBalance);
