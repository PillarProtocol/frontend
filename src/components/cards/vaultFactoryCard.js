import { Component } from 'react';
import { Card } from '@material-ui/core';
import { connect } from 'react-redux';
import { factoryDetails } from '../routes';
import axios from 'axios';

import classes from './vaultFactoryCard.module.scss';
import { DECIMAL, PILLAR_SYMBOL, VAULT_FACTORY_REFRESH_INTERVAL } from '../../config';
import { numberWithCommas } from '../helpers';
import CircularProgress from '@material-ui/core/CircularProgress';

class VaultFactoryCard extends Component {
    render() {
        if (this.props.collaterals.includes(this.props.vaultFactory)) {
            return (
                <MyGridItem
                    data_path={`${this.props.base_path}${factoryDetails}${this.props.vaultFactory}`}
                    totalCollateral={this.props.totalCollateral}
                    totalPillar={this.props.totalPillar}
                    totalPillarRepaid={this.props.totalPillarRepaid}
                    minimumCollateral={this.props.minimumCollateral}
                    interestRate={this.props.interestRate}
                    liquidationRatio={this.props.liquidationRatio}
                    totalVaults={this.props.totalVaults}
                    vaultsOccupied={this.props.vaultsOccupied}
                    vaultsRemaining={this.props.vaultsRemaining}
                    vaultFactory={this.props.vaultFactory}
                />
            );
        } else {
            return (
                <div>
                    <div className={classes.loadingBox}>
                        <Card>
                            <CircularProgress style={{ color: '#C9A46F' }} />
                        </Card>
                    </div>
                </div>
            );
        }
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
        this.intervalId = setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    async getData() {
        const { data: result } = await axios.get(this.props.data_path);
        // console.log({ path: this.props.data_path, result });
        this.setState({
            isLoaded: true,
            result,
        });
    }

    render() {
        const { isLoaded, result } = this.state;
        if (!isLoaded) {
            return (
                <div className={classes.cardStyle}>
                    <div className={classes.loadingBox}>
                        <Card>
                            <CircularProgress style={{ color: '#C9A46F' }} />
                        </Card>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={classes.cardStyle}>
                    <Card>
                        <div className={classes.bigContainer}>
                            <div style={{ flex: 1, borderRight: '1px solid #EEEEEE' }}>
                                <div className={classes.bigCardHeading}>{this.props.totalCollateral}</div>
                                <div className={classes.bigCardText}>
                                    {numberWithCommas(result.totalCollateral, DECIMAL[this.props.vaultFactory])}{' '}
                                    <div className={classes.usdText}>
                                        USD {numberWithCommas(result.collateralLockedInCents, DECIMAL.TOTAL_COLLATERAL)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className={classes.bigCardHeading}>{this.props.totalPillar}</div>
                                <div className={classes.bigCardText}>
                                    {numberWithCommas(result.totalPillar, DECIMAL[PILLAR_SYMBOL])} {PILLAR_SYMBOL}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className={classes.bigCardHeading}>{this.props.totalPillarRepaid}</div>
                                <div className={classes.bigCardText}>
                                    {numberWithCommas(result.totalPillarRepaid, DECIMAL[PILLAR_SYMBOL])} {PILLAR_SYMBOL}
                                </div>
                            </div>
                        </div>

                        <div className={classes.bottomContainer}>
                            <div>
                                <div className={classes.smallCardHeading}>{this.props.totalVaults}</div>
                                <div className={classes.smallCardText}>{result.totalVaults}</div>
                            </div>

                            <div>
                                <div className={classes.smallCardHeading}>{this.props.interestRate}</div>
                                <div className={classes.smallCardText}>{`${numberWithCommas(result.interestRate, 0)} %`}</div>
                            </div>

                            <div>
                                <div className={classes.smallCardHeading}>{this.props.liquidationRatio}</div>
                                <div className={classes.smallCardText}>
                                    {`${numberWithCommas(result.liquidationRatio, DECIMAL.COL_RATIO)} %`}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedVaultFactoryCard = connect(mapStateToProps)(VaultFactoryCard);

export { connectedVaultFactoryCard as VaultFactoryCard };
