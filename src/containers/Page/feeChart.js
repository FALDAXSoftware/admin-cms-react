import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class FeeChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { label,datasets } = this.props;
        const data = {
            labels: label,
            datasets:datasets 
            
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
