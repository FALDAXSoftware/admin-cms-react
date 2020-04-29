import React, { Component } from "react";
import { TradeHeadRow } from "../../App/tradeStyle";
import { Line } from "react-chartjs-2";
import { Card, Col, Row } from "antd";

class DepthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askData: [],
      bidData: []
    };
  }
  componentDidMount() {
    this.props.io.on("depth-chart-data", (data) => {
      this.updateData(data);
    });
  }
  updateData = (data) => {
    var self = this;
    let askData = [];
    let bidData = [];
    for (let index = 0; index < data.buyDetails.length; index++) {
      let element = data.buyDetails[index];
      bidData.push({
        x: element.price,
        y: element.quantity
      });
    }
    for (let sellIndex = 0; sellIndex < data.sellDetails.length; sellIndex++) {
      let element = data.sellDetails[sellIndex];
      askData.push({
        x: element.price,
        y: element.quantity
      });
    }
    let askDepthTotal = 0;
    let bidDepthTotal = 0;
    let askDataArray = [];
    let bidDataArray = [];
    for (let i = 0; i < askData.length; i++) {
      askDepthTotal += askData[i]["y"];
      askDataArray.push({
        x: askData[i]["x"],
        y: askDepthTotal
      });
    }

    for (let j = 0; j < bidData.length; j++) {
      bidDepthTotal += bidData[j]["y"];
      bidDataArray.push({
        x: bidData[j]["x"],
        y: bidDepthTotal
      });
    }

    self.setState(
      {
        bidData: bidDataArray,
        askData: askDataArray
      },
      () => {
        self.forceUpdate();
        self.refs.chart.chartInstance.update();
      }
    );
  }
  render() {
    var self = this;

    let graphData = {
      type: "line",
      datasets: [
        {
          label: `Bid`,
          backgroundColor: "#dbeed9",
          borderColor: "rgba(93, 193, 78, 1)",
          borderJoinStyle: "miter",
          borderCapStyle: "butt",
          borderWidth: 1,
          lineTension: 0,
          pointHitRadius: 2,
          steppedLine: true,
          pointRadius: 0.2,
          data: [...self.state.bidData]
        },
        {
          label: `Ask`,
          backgroundColor: "#fcd3de",
          borderColor: "rgba(229, 90, 122, 1)",
          borderJoinStyle: "miter",
          borderCapStyle: "butt",
          borderWidth: 1,
          lineTension: 0,
          pointHitRadius: 2,
          pointRadius: 0.2,
          steppedLine: true,
          data: [...this.state.askData]
        }
      ]
    };
    return (
      <>
        <Card className="lessPaddingCard">
          <TradeHeadRow type="flex" justify="space-between">
            <Col span={24}>
              <label>Depth Chart {this.props.crypto}/{this.props.currency}</label>
            </Col>
          </TradeHeadRow>
          <Row>
            <Col span={24}>
              <Line
                height="200"
                data={graphData}
                options={{
                  animation: false,
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [
                      {
                        display: true,
                        type: "linear",
                        position: "bottom",
                        gridLines: {
                          display: false,
                          color: "#FFFFFF"
                        }
                      }
                    ]
                  }
                }}
                ref="chart"
              />
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}
export default DepthChart;
