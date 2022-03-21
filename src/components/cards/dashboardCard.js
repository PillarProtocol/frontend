import { Component } from 'react';
import { CardContent, Grid, Card, Typography, CardMedia } from '@material-ui/core';
import { connect } from 'react-redux';
import DashboardGraph from '../graph/dashboardGraph';
import { totalCollateral, totalPillar } from '../routes';
import axios from 'axios';
import { cardContentStyles } from './cardContentStyles';
import classes from './dashboardCard.module.scss';
import { DECIMAL, DASHBOARD_REFRESH_INTERVAL, DOLLAR_SYMBOL, PILLAR_SYMBOL } from '../../config';
import { numberWithCommas, numberWithoutCommas } from '../helpers';
import CircularProgress from '@material-ui/core/CircularProgress';

// const style = {
//   padding: "0px 120px",
//   background: "linear-gradient(0deg, #ffffff 50%, #153345 50%)",
//   height: "300px",
//   marginBottom: "20px",
// };

// const cardStyle = {
//   padding: "20px 0px",
// };

class CustomCard extends Component {
    render() {
        let { diff, diffPercent } = this.props;
        let PnlElement;
        if (diff > 0) {
            PnlElement = (
                <Typography style={cardContentStyles.profit}>
                    +{numberWithCommas(diff, this.props.decimals)} (+{diffPercent}%)
                </Typography>
            );
        } else {
            PnlElement = (
                <Typography style={cardContentStyles.loss}>
                    {numberWithCommas(diff, this.props.decimals)} ({diffPercent}%)
                </Typography>
            );
        }

        return (
            <Card elevation={1} style={this.props.style}>
                <CardContent>
                    <Typography style={cardContentStyles.title}>{this.props.cardHeader}</Typography>
                    <Typography style={cardContentStyles.mainElement}>
                        {this.props.symbol} {numberWithCommas(this.props.value, this.props.decimals)}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {PnlElement}
                        <Typography style={cardContentStyles.lastWeek}>{this.props.lastWeek}</Typography>
                    </div>
                    <CardMedia style={cardContentStyles.reduceGraphSize}>
                        <Grid container spacing={1} justify="flex-start" style={cardContentStyles.reduceGraphSize}>
                            <Grid item xs={12} md={9} lg={9} xl={9} style={cardContentStyles.reduceGraphSize}>
                                <DashboardGraph data={this.props.graphData} decimals={this.props.decimals} />
                            </Grid>
                        </Grid>
                    </CardMedia>
                </CardContent>
            </Card>
        );
    }
}
class DashboardCard extends Component {
    render() {
        return (
            <div className={classes.style}>
                <MyGridItem
                    cardHeader={this.props.totalPillar}
                    lastWeek={this.props.lastWeek}
                    data_path={`${this.props.base_path}${totalPillar}`}
                    decimals={DECIMAL.PIL}
                    symbol={PILLAR_SYMBOL}
                />
                <MyGridItem
                    cardHeader={this.props.totalCollateral}
                    lastWeek={this.props.lastWeek}
                    data_path={`${this.props.base_path}${totalCollateral}`}
                    decimals={DECIMAL.TOTAL_COLLATERAL}
                    symbol={DOLLAR_SYMBOL}
                />
            </div>
        );
    }
}

class MyGridItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }
    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), DASHBOARD_REFRESH_INTERVAL);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    async getData() {
        const { data: result } = await axios.get(this.props.data_path);
        this.setState({
            isLoaded: true,
            result,
        });
    }

    render() {
        const { isLoaded, result } = this.state;
        if (!isLoaded) {
            return (
                <div className={classes.loadingBox}>
                    <Card>
                        <CircularProgress style={{ color: '#C9A46F' }} />
                    </Card>
                </div>
            );
        } else {
            return (
                <div className={classes.childBox}>
                    <CustomCard
                        diff={result.diff}
                        diffPercent={numberWithoutCommas(result.diffPercent, 0)}
                        cardHeader={this.props.cardHeader}
                        value={result.value}
                        lastWeek={this.props.lastWeek}
                        style={cardContentStyles.card2}
                        graphData={result.historicData}
                        decimals={this.props.decimals}
                        symbol={this.props.symbol}
                    />
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedDashboardCard = connect(mapStateToProps)(DashboardCard);

export { connectedDashboardCard as DashboardCard };
