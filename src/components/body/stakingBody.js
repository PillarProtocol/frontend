import { Box, Grid, Paper, TableContainer, TableCell, TableRow, Table, TableHead, TableBody, Link } from '@material-ui/core';
import { Component } from 'react';
import classes from './stakingBody.module.scss';
import {
    VAULT_FACTORY_REFRESH_INTERVAL,
    STAKING_TOP_DELEGATOR_TABLE_HEADERS,
    BACKEND_SERVICE,
    SHARES_SYMBOL,
    DECIMAL,
    TOKEN_ADDRESS_TO_NAME_MAP,
} from '../../config';
import { rowStyle } from '../table/style';
import { delegatorList, rewardList, unlockingRequestUrl } from '../routes';
import axios from 'axios';
import RedeemIcon from '@material-ui/icons/Redeem';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import { CancelUnlockButton, FeatureButton } from '../buttons';
import { cancelUnlockRequestTransition } from '../../walletOperations/cancelUnlockRequest';
import { withdrawTokensTransition } from '../../walletOperations/withdrawStakedTokens';
import { claimRewardTransition } from '../../walletOperations/claimReward';
import { numberWithCommas, toBech32, toChecksumAddress } from '../helpers';

import { connect } from 'react-redux';

const cell = {
    fontFamily: 'Karla',
    fontStyle: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    alignItems: 'center',
    padding: '16px 0px 16px 24px',
};

const cell1 = {
    ...cell,
    fontWeight: 'normal',
    color: '#666666',
};

const cell456 = {
    ...cell,
    fontWeight: 'normal',
    color: '#222222',
};

const cellReward = {
    ...cell,
    fontWeight: '600',
    fontSize: '17px',
    color: '#31AD65',
};

class StakingBody extends Component {
    render() {
        return (
            <Box className={classes.conatinerStyle}>
                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                        <TopDelegators />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                        <div style={{ marginBottom: '20px' }}>
                            <Rewards address={this.props.content ? this.props.content.address : null} />
                        </div>
                        <UnlockRequests address={this.props.content ? this.props.content.address : null} />
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

class UnlockRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unlockingRequests: [],
        };
    }

    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    async getData() {
        if (this.props.address) {
            const { data: result } = await axios.get(`${BACKEND_SERVICE}${unlockingRequestUrl}/${this.props.address}`);
            this.setState({
                unlockingRequests: result,
            });
            clearInterval(this.intervalId);
        }
    }

    onClickCancel = (unlockRequest) => async () => {
        await cancelUnlockRequestTransition(window.zilPay, unlockRequest.requestId);
    };

    onClickUnlock = (unlockRequest) => async () => {
        await withdrawTokensTransition(window.zilPay, unlockRequest.requestId);
    };

    render() {
        let unlockElements;
        unlockElements = this.state.unlockingRequests.map((unlockRequests, index) => {
            return (
                <TableRow key={'row_unlockRequest' + index}>
                    <TableCell key={'row_unlockRequest' + index + '' + index} align="left">
                        <div style={{ fontSize: '17px', color: '#222222' }}>
                            <span style={{ fontSize: '14px' }}>{numberWithCommas(unlockRequests.shares, DECIMAL.GZIL)}</span>{' '}
                            <span style={{ fontSize: '14px', color: '#AAAAAA' }}>{SHARES_SYMBOL}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#AAAAAA' }}>ID: {unlockRequests.requestId}</p>
                        <p style={{ fontSize: '17px', color: '#AAAAAA' }}>{unlockRequests.block + 100} BLOCK</p>
                    </TableCell>
                    <TableCell key={'row_unlockRequest' + index + 'accept'} align="right">
                        <FeatureButton text={'Unlock'} handleOpenFunction={this.onClickUnlock(unlockRequests)} />
                        <CancelUnlockButton text={'Cancel'} handleOpenFunction={this.onClickCancel(unlockRequests)} />
                    </TableCell>
                </TableRow>
            );
        });

        return (
            <TableContainer component={Paper} className={classes.smallTableStyle}>
                <div className={classes.recentTransactions}>
                    {' '}
                    <LockOpenIcon /> {`Unlock Requests (${this.state.unlockingRequests.length})`}
                </div>

                <Table size="small" aria-label="Reward Table">
                    <TableBody>{unlockElements}</TableBody>
                </Table>
            </TableContainer>
        );
    }
}

class Rewards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rewards: [],
        };
    }
    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    onClickClaimReward = (reward) => async () => {
        await claimRewardTransition(window.zilPay, reward.epoch);
    };

    async getData() {
        if (this.props.address) {
            const { data: result } = await axios.get(`${BACKEND_SERVICE}${rewardList}/${this.props.address}`);
            this.setState({
                rewards: result,
            });
            clearInterval(this.intervalId);
        }
    }

    render() {
        let rewardElements;
        rewardElements = this.state.rewards.map((reward, index) => {
            let symbolToDisplay = TOKEN_ADDRESS_TO_NAME_MAP[reward.token] || reward.token.slice(0, 6);
            let decimal = DECIMAL[symbolToDisplay] || 12;
            return (
                <TableRow key={'row_reward' + index}>
                    <TableCell key={'row_reward' + index + '' + index} style={cellReward} align="left">
                        {numberWithCommas(reward.amount, decimal)} {symbolToDisplay}
                    </TableCell>
                    <TableCell key={'row_reward' + index + 'accept'} align="right">
                        <FeatureButton text={'Accept'} handleOpenFunction={this.onClickClaimReward(reward)} />
                    </TableCell>
                </TableRow>
            );
        });

        return (
            <TableContainer component={Paper} className={classes.smallTableStyle}>
                <div className={classes.recentTransactions}>
                    {' '}
                    <RedeemIcon /> {`Rewards (${this.state.rewards.length})`}
                </div>

                <Table size="small" aria-label="Reward Table">
                    <TableBody>{rewardElements}</TableBody>
                </Table>
            </TableContainer>
        );
    }
}
class TopDelegators extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delegators: [],
        };
    }
    componentDidMount() {
        this.getData();
        this.setState({
            intervalId: setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL * 10),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    async getData() {
        const { data: result } = await axios.get(`${BACKEND_SERVICE}${delegatorList}`);
        console.log({ result });
        this.setState({
            delegators: [...result],
        });
    }

    render() {
        let headers;
        headers = STAKING_TOP_DELEGATOR_TABLE_HEADERS.map((header, index) => {
            return (
                <TableCell key={'header_staking_' + index} align="left" style={rowStyle}>
                    {header}
                </TableCell>
            );
        });
        let rowElements;
        rowElements = this.state.delegators.map((staker, index) => {
            return (
                <TableRow key={'row_staking' + index}>
                    <TableCell key={'row_staking' + index + '' + index} style={cell1} align="left">
                        {index + 1}
                    </TableCell>
                    <TableCell key={'row_staking' + index + '' + staker.user} style={cell456} align="left">
                        <Link target="_blank" rel="noopener" href={`https://viewblock.io/zilliqa/address/${staker.user}`} color="inherit">
                            {toBech32(toChecksumAddress(staker.user))}
                        </Link>
                    </TableCell>
                    <TableCell key={'row_staking' + index + '' + staker.stake} style={cell1} align="left">
                        {numberWithCommas(staker.stake, DECIMAL.GZIL)} {SHARES_SYMBOL}
                    </TableCell>
                </TableRow>
            );
        });
        return (
            <TableContainer component={Paper} className={classes.tableStyle}>
                <div className={classes.recentTransactions}>Top Delegates</div>
                <Table size="small" aria-label="Staking Table">
                    <TableHead>
                        <TableRow>{headers}</TableRow>
                    </TableHead>
                    <TableBody>{rowElements}</TableBody>
                </Table>
            </TableContainer>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedStakingBody = connect(mapStateToProps)(StakingBody);

export { connectedStakingBody as StakingBody };
