import { Table } from 'antd';
import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import FaldaxLoader from '../faldaxLoader';

const { logout } = authAction;

class SummaryBatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summaryBatchData: [],
            batchDetails: this.props.batchDetails
        }
        this.columns = [
            {
                title: 'Purchases',
                dataIndex: 'coin',
                key: 'coin',
                render: text => <a>{text}</a>,
            },
            {
                title: 'Asset Bought',
                dataIndex: 'buy_detail',
                key: 'buy_detail',
            },
            {
                title: 'Asset Sold',
                dataIndex: 'sell_detail',
                key: 'sell_detail',
            },
            {
                title: 'Asset Net',
                dataIndex: 'asset_net',
                key: 'asset_net',
            },
            {
                title: '# Of TX(Bought)',
                dataIndex: 'buy_tx',
                key: 'buy_tx',
            },
            {
                title: '# Of TX(Sold)',
                dataIndex: 'sell_tx',
                key: 'sell_tx',
            },
            // {
            //     title: 'Network Fee',
            //     dataIndex: 'buy_tx',
            //     key: 'buy_tx',
            // },
            // {
            //     title: 'Network Fee Value',
            //     dataIndex: 'sell_tx',
            //     key: 'sell_tx',
            // },
            {
                title: 'FALDAX Fee',
                dataIndex: 'faldax_fees',
                key: 'faldax_fees',
            },
            {

                title: 'Network Fee Value',

                dataIndex: 'faldax_usd_fees',

                key: 'faldax_usd_fees',
            },
        ];
    }


    componentWillReceiveProps = (nextProps) => {
        if (this.props != nextProps) {
            this.setState({ batchDetails: nextProps.batchDetails }, () => {
                this._getSummaryOfBatch();
            });
        }
    }

    _getSummaryOfBatch = () => {
        const { token } = this.props;
        const { batchDetails: { transaction_end, transaction_start } } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getSummaryOfBatch(token, transaction_start, transaction_end)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ summaryBatchData: res.data });
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
                    dataSource={this.state.summaryBatchData}
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
    }), { logout })(SummaryBatch);
