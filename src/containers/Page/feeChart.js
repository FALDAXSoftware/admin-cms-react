import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class FeeChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { feeSymbols, feeSum } = this.props;
        const data = {
            labels: feeSymbols,
            datasets: [
                {
                    label: 'Pair wise fees',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: feeSum
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
