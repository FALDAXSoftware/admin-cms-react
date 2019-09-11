import { Table } from 'antd';
import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

class PurchaseBatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseBatchData: [],
            batchDetails: this.props.batchDetails
        }
        this.columns = [
            {
                title: 'Transaction #',
                dataIndex: 'transaction_id',
                key: 'transaction_id',
            },
            {
                title: 'Transaction Date/Time',
                dataIndex: 'transaction_time',
                key: 'transaction_time',
            },
            {
                title: 'Pair',
                dataIndex: 'pair',
                key: 'pair',
            },
            {
                title: 'User ID',
                dataIndex: 'user_id',
                key: 'user_id',
            },
            {
                title: 'Asset 1 Volume',
                dataIndex: 'asset_1_amount',
                key: 'asset_1_amount',
            },
            {
                title: 'Asset 1 Value',
                dataIndex: 'asset_1_value',
                key: 'asset_1_value',
            },
            {
                title: 'Asset 2 Volume',
                dataIndex: 'asset_2_amount',
                key: 'asset_2_amount',
            },
            {
                title: 'Asset 2 Value',
                dataIndex: 'asset_2_value',
                key: 'asset_2_value',
            },
            {
                title: 'Transaction Value',
                dataIndex: 'transaction_value',
                key: 'transaction_value',
            },
            // {
            //     title: 'Network Fee',
            //     dataIndex: 'faldax_usd_fees',
            //     key: 'faldax_usd_fees',
            // },
            // {
            //     title: 'Network Fee Value',
            //     dataIndex: 'faldax_usd_fees',
            //     key: 'faldax_usd_fees',
            // },
            {
                title: 'FALDAX Fee',
                dataIndex: 'faldax_fees',
                key: 'faldax_fees',
            },
            {
                title: 'Network Fee Value',
                dataIndex: 'faldax_fee_usd_value',
                key: 'faldax_fee_usd_value',
            },
        ];
    }

    componentDidMount = () => {
        this._getPurchaseOfBatch();
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props != nextProps) {
            this.setState({ batchDetails: nextProps.batchDetails }, () => {
                this._getPurchaseOfBatch();
            });
        }
    }

    _getPurchaseOfBatch = () => {
        const { token } = this.props;
        const { batchDetails: { transaction_end, transaction_start } } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getPurchaseOfBatch(token, transaction_start, transaction_end)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ purchaseBatchData: res.data });
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

    render() {
        const { loader } = this.state;
        const columns = this.columns.map(col => {
            return col;
        });

        return (
            <div className="isoLayoutContent">
                <Table
                    columns={columns}
                    dataSource={this.state.purchaseBatchData}
                    bordered
                    pagination={false}
                />
                {loader && <FaldaxLoader />}
            </div>
        )
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(PurchaseBatch);
