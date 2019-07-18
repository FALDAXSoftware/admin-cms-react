import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class TransactionMapChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { transactionSymbols, transactionCount } = this.props;
        const data = {
            labels: transactionSymbols,
            datasets: [
                {
                    label: 'Transactions',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: transactionCount
                }
            ]
        };
        return (
            <Line data={data} />
        );
    }
}

export default TransactionMapChart;
