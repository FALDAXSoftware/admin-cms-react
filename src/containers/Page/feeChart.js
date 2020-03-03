import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class FeeChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { feesLabels, faldaxFees,residualFees } = this.props;
        const data = {
            labels: feesLabels,
            datasets: [
                {
                    label: 'FALDAX Fees',
                    backgroundColor: 'rgb(98, 208, 197)',
                    borderColor: 'rgb(43, 107, 101)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgb(28, 84, 79)',
                    hoverBorderColor: 'rgb(43, 107, 101)',
                    data: faldaxFees
                },
                {
                    label: 'Residual Amount',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: residualFees
                }
            ]
        };

        return (
            <Bar
                data={data}
                options={{
                    maintainAspectRatio: false
                }}
            />
        );
    }
}

export default FeeChart;
