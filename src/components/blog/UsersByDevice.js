import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  FormSelect,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "shards-react";

import Chart from "../../utils/chart";
import Select from 'react-select'


class UsersByDevice extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  state = {
    focus: this.props.chartData.datasets.map((x) => x.title)[0],
  };


  handleChange(selectedOption) {
    const f = selectedOption.label
    this.setState({focus: f})
    this.componentDidMount()
  }

  componentDidMount() {
    const cd = JSON.parse(JSON.stringify(this.props.chartData));
    var focus = this.state.focus
    cd.datasets = cd.datasets.filter(function(value, index, arr){ return value.title === focus;})
    cd.labels = cd.datasets.filter(function(value, index, arr){ return value.title === focus;})[0].labels;
    const chartConfig = {
      type: "pie",
      data: cd,
      options: {
        ...{
          legend: {
            position: "bottom",
            labels: {
              padding: 25,
              boxWidth: 20
            }
          },
          cutoutPercentage: 0,
          tooltips: {
            custom: false,
            mode: "index",
            position: "nearest"
          }
        },
        ...this.props.chartOptions
      }
    };

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="d-flex py-0">
          <canvas
            height="220"
            ref={this.canvasRef}
            className="blog-users-by-device m-auto"
          />
        </CardBody>
        <CardFooter>
          <div style={{width: '300px', zIndex: 2}}>
            <Select placeholder={this.state.focus} value={this.state.focus} style={{ width: 42}} onChange={this.handleChange.bind(this)} options={this.props.chartData.datasets.map((x, i) => ({key: i, label: x.title}))}/>
          </div>
        </CardFooter>
      </Card>
    );
  }
}

UsersByDevice.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart config object.
   */
  chartConfig: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
  /**
   * The chart data.
   */
  chartData: PropTypes.object
};

UsersByDevice.defaultProps = {
  title: "Users by device",
  chartData: {
    datasets: [
      {
        hoverBorderColor: "#ffffff",
        data: [68.3, 24.2, 7.5],
        backgroundColor: [
          "rgba(0,123,255,0.9)",
          "rgba(0,123,255,0.5)",
          "rgba(0,123,255,0.3)"
        ]
      }
    ],
    labels: ["Desktop", "Tablet", "Mobile"]
  }
};

export default UsersByDevice;
