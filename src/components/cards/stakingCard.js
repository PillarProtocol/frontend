import { Component } from 'react';
import { CardContent, Card, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { cardContentStyles } from './cardContentStyles';
import classes from './dashboardCard.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import { delegation, gzilBalance, userShares, gzilLockedinStakingContract } from '../routes';

import axios from 'axios';

import { DECIMAL, VAULT_FACTORY_REFRESH_INTERVAL, BACKEND_SERVICE, SHARES_SYMBOL, GZIL_SYMBOL } from '../../config';
import { numberWithCommas } from '../helpers';

class CustomCard extends Component {
    render() {
        return (
            <Card elevation={1} style={this.props.style}>
                <CardContent>
                    <Typography style={cardContentStyles.title}>{this.props.header}</Typography>
                    <Typography style={cardContentStyles.mainElement}>{this.props.value}</Typography>
                </CardContent>
            </Card>
        );
    }
}
class StakingCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userShares: 'Loading ...',
            delegationAmount: 'Loading ...',
            gzil: 'Loading ...',
            gzilLockedinStakingContract: 'Loading ...',
        };
    }

    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL);
    }

    async getData() {
        console.log(this.props.content);
        if (this.props.content) {
            // const { data: result2 } = await axios.get(`${BACKEND_SERVICE}${delegation}/${this.props.content.address}`);
            const { data: result3 } = await axios.get(`${BACKEND_SERVICE}${gzilBalance}/${this.props.content.address}`);
            const { data: result4 } = await axios.get(`${BACKEND_SERVICE}${userShares}/${this.props.content.address}`);
            const { data: result5 } = await axios.get(`${BACKEND_SERVICE}${gzilLockedinStakingContract}`);
            this.setState({
                // delegationAmount: `${numberWithCommas(result2.value, DECIMAL.GZIL)} ${SHARES_SYMBOL}`,
                gzil: `${numberWithCommas(result3.value, DECIMAL.GZIL)} ${GZIL_SYMBOL}`,
                userShares: `${numberWithCommas(result4.value, DECIMAL.GZIL)} ${SHARES_SYMBOL}`,
                gzilLockedinStakingContract: `${numberWithCommas(result5.value, DECIMAL.GZIL)} ${GZIL_SYMBOL}`,
            });
            clearInterval(this.intervalId);
        }
    }

    render() {
        return (
            <div className={classes.stakingStyle}>
                <MyGridItem header={'Your gZil Balance'} value={`${this.state.gzil}`} />
                <MyGridItem header={'Total gZil Locked in Pillar Protocol'} value={`${this.state.gzilLockedinStakingContract}`} />
                <MyGridItem header={'My Shares'} value={this.state.userShares} />
                {/* <MyGridItem header={'Shares delegated to me'} value={this.state.delegationAmount} /> */}
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
        this.setState({
            isLoaded: true,
        });
    }

    render() {
        const { isLoaded } = this.state;
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
                <div className={classes.stakingChildBox}>
                    <CustomCard style={cardContentStyles.card2} {...this.props} />
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedStakingCard = connect(mapStateToProps)(StakingCard);

export { connectedStakingCard as StakingCard };
