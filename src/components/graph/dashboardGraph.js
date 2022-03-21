import { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@material-ui/core';

// import { Height } from "@material-ui/icons";

import classes from './dashboardGraph.module.scss';
import { numberWithoutCommas } from '../helpers';

const options = {
    scales: {
        xAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    userCallback: function (item, index, items) {
                        if (index === 0 || index === items.length - 1 || index === Math.floor((items.length - 1) / 2)) return item;
                    },
                    autoSkip: false,
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
        ],
    },
    title: {
        display: false,
        text: 'Average Value',
        fontSize: 20,
    },
    legend: {
        display: false,
        position: 'right',
    },

    responsive: true,
    maintainAspectRatio: false,
};

export default class DashboardGraph extends Component {
    render() {
        return (
            <Box>
                <div className={classes.graph}>
                    <Line data={createGraphData(this.props.data, this.props.decimals)} options={options} />
                </div>
            </Box>
        );
    }
}

const createGraphData = (data, decimals = 0) => {
    let value = data.value.map((val) => numberWithoutCommas(val, decimals));
    return {
        labels: data.months,
        datasets: [
            {
                label: 'Value in Dollars (approx)',
                fill: false,
                lineTension: 0.2,
                backgroundColor: '#ffffff',
                borderColor: '#359595',
                borderWidth: 3,
                data: value,
            },
        ],
    };
};
