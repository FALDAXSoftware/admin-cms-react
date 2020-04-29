import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import authAction from "../../../redux/auth/actions";
import { Card, Col, Row, Form, InputNumber, Table, Input, Popconfirm } from 'antd';
import { TradeHeadRow } from '../../App/tradeStyle';
import ApiUtils from '../../../helpers/apiUtills';
const { logout } = authAction;
const EditableContext = React.createContext();
class BotConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            loader: true
        }
        this.columns = [
            {
                title: 'pair',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Minimum Quantity of Order placement (USD)',
                dataIndex: 'crypto_minimum',
                key: 'crypto_minimum',
                editable: true,
                width: 300
            },
            {
                title: 'Maximum Quantity of Order placement (USD)',
                dataIndex: 'crypto_maximum',
                key: 'crypto_maximum',
                editable: true,
                width: 300
            },
            {
                title: 'Action',
                dataIndex: 'Action',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        onClick={() => this.save(form, record)}
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
                            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                                Edit
                            </a>
                        );
                },
            },
        ]
    }
    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save = (form, record) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            this.setState({ loader: true });
            ApiUtils.updatePairsForBot(this.props.token, { id: record.encript_id, min_crypto: row.crypto_minimum, max_crypto: row.crypto_maximum }).then((response) => response.json()).then((res) => {
                this.getData()

            })

        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    componentDidMount() {
        this.getData()
    }
    getData = () => {
        this.setState({ loader: true });
        ApiUtils.getPairsForBot(this.props.token).then((response) => response.json()).then((res) => {
            console.log("-------------------", res);
            let data = []
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                data.push({
                    ...element,
                    key: element.encript_id
                })
            }
            this.setState({ data: data, editingKey: '', loader: false });
        })
    }
    render() {
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
                    inputType: 'number',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <Card>

                <TradeHeadRow gutter={16}>
                    <Col span={12}>
                        <label>Trade Bot Configurations</label>
                    </Col>
                </TradeHeadRow>
                <Row>
                    <Col span={24}>
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                components={components}
                                bordered
                                dataSource={this.state.data}
                                columns={columns}
                                rowClassName="editable-row"
                                pagination={false}
                                loading={this.state.loader}
                            />
                        </EditableContext.Provider>
                    </Col>
                </Row>
            </Card>
        );
    }
}



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
export default withRouter(
    connect(
        (state) => ({
            token: state.Auth.get("token"),
            user: state.Auth.get("user"),
        }),
        { logout }
    )(Form.create()(BotConfig))
);