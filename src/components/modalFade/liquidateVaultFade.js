import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, CircularProgress, Box, FormHelperText } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CancelButton, FormButton } from '../buttons';
import {
    VAULT_FACTORY,
    NETWORK,
    DECIMAL,
    PILLAR_SYMBOL,
    BACKEND_SERVICE,
    APPROVE_PILLAR,
    APPROVE_PILLAR_DESCRIPTION,
    PILLAR_APPROVERD,
    APPROVE_COLLATERAL_LOAD,
    LIQUIDATE_OPERATION,
    LIQUIDATING,
    LIQUIDATION_SUCCESS,
} from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';
import { toBech32Address } from '@zilliqa-js/crypto';

import { numberWithCommas } from '../helpers';
import { style, modalLinkStyle } from './styles';

import { liquidateVaultOperation } from '../../walletOperations/liquidateVault';

import { approvePillarOperation } from '../../walletOperations/approvePillar';

import axios from 'axios';
import { approvedPillar } from '../routes';

const operations = {
    liquidate: 'liquidate',
    approvePillar: 'approve pillar',
};

class LiquidateVaultFade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operation: operations.liquidate,
        };

        this.approvePillarCallback = this.approvePillarCallback.bind(this);
        this.liquidateCallback = this.liquidateCallback.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        let { vaultId, type, walletAddress } = this.props;
        if (vaultId && type && walletAddress) {
            const { data: result } = await axios.get(`${BACKEND_SERVICE}${approvedPillar}${type}/${vaultId}/${walletAddress}`);

            this.setState({
                approvedPillar: `${result.value}`,
            });
        }
    }

    approvePillarCallback() {
        this.setState((state) => {
            return {
                ...state,
                operation: operations.approvePillar,
            };
        });
    }

    liquidateCallback() {
        this.setState((state) => {
            return {
                ...state,
                operation: operations.liquidate,
            };
        });
    }

    render() {
        if (this.state.operation === operations.liquidate) {
            return (
                <Slide1
                    in={this.props.open}
                    vaultFactory={this.props.vaultFactory}
                    cancelCallback={this.props.cancelCallback}
                    cancel={this.props.doneText}
                    type={this.props.type}
                    vaultId={this.props.vaultId}
                    approvedPillar={this.state.approvedPillar}
                    approvePillarCallback={this.approvePillarCallback}
                />
            );
        } else {
            return (
                <Slide2
                    type={this.props.type}
                    in={this.props.open}
                    value={this.state.approvedPillar}
                    repayCallback={this.repayCallback}
                    cancelCallback={this.props.cancelCallback}
                    cancel={this.props.doneText}
                />
            );
        }
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            loading: false,
            success: false,
        };
    }

    liquidatetWalletTransition = async () => {
        this.setState({ loading: true });
        let result = await liquidateVaultOperation(window.zilPay, this.props.type, this.props.vaultId);

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        } else {
            this.setState({ loading: false, success: true });
        }
    };

    render() {
        console.log({ props: this.props });
        let loadingContent = (
            <div>
                <div className={classes.loadingRepayDebt}>
                    <CircularProgress />
                    <div>
                        {LIQUIDATING}
                        {' Vault: '}
                        {this.props.vaultId}
                    </div>
                </div>
            </div>
        );

        let successContent = (
            <div>
                <div className={classes.successModal}>
                    <CheckCircleOutlineIcon style={{ color: '31AD65', height: '48px', width: '48px' }} />
                    {/* TO_DO_AKSHAY */}
                    <div>
                        {LIQUIDATION_SUCCESS}
                        {' Vault: '}
                        {this.props.vaultId}
                    </div>
                    <FormButton text="Done" clickFunction={() => window.location.reload()} />
                </div>
            </div>
        );

        let renderOtherContent;
        if (this.state.success) {
            renderOtherContent = successContent;
        } else if (this.state.loading) {
            renderOtherContent = loadingContent;
        }

        return (
            <Fade in={this.props.in} tabIndex={1}>
                <Card style={addCollateralCardStyle}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{LIQUIDATE_OPERATION}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div className="modalSpacing">
                                <div className={classes.headerDescription}>{this.props.header}</div>

                                <div className={classes.vaultAddress}>
                                    <div className={classes.vaultAddressText}>{VAULT_FACTORY}</div>
                                    <div className={classes.vaultAddressValue}>
                                        {toBech32Address(this.props.vaultFactory)}
                                        <FileCopyOutlinedIcon
                                            fontSize={'inherit'}
                                            onClick={() => navigator.clipboard.writeText(toBech32Address(this.props.vaultFactory))}
                                        />
                                    </div>
                                </div>
                                {/* start working here */}
                                <FormControl variant="filled" fullWidth={true}>
                                    <FormButton
                                        text={APPROVE_PILLAR}
                                        disabled={parseInt(this.props.approvedPillar) >= 10000000000000000000000000}
                                        clickFunction={this.props.approvePillarCallback}
                                    />
                                    <FormButton
                                        text={LIQUIDATE_OPERATION}
                                        disabled={parseInt(this.props.approvedPillar) < 10000000000000000000000000}
                                        clickFunction={this.liquidatetWalletTransition}
                                    />
                                </FormControl>

                                <div className={classes.doneButton}>
                                    <CancelButton text={this.props.cancel} clickFunction={this.props.cancelCallback} />
                                </div>
                            </div>
                        ) : (
                            <div className="modalSpacing"> {renderOtherContent}</div>
                        )}
                    </div>
                </Card>
            </Fade>
        );
    }
}

class Slide2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            approveDisabled: false,
            loading: false,
            amount: '',
        };
    }

    approvePillarWalletTransition = (callback) => async () => {
        this.setState({ loading: true });

        let result = await approvePillarOperation(window.zilPay, this.props.type, '100000000000000000000000000');

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }

        this.setState({ loading: false });
        callback();
    };

    render() {
        let loadingContent = (
            <div>
                <div className={classes.loadingRepayDebt}>
                    <CircularProgress />
                    <div>
                        {APPROVE_COLLATERAL_LOAD} {PILLAR_SYMBOL}
                    </div>
                </div>
            </div>
        );

        return (
            <Fade in={this.props.in} tabIndex={1}>
                <Card style={style}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{this.props.header}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.props.cancelCallback} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading ? (
                            <div className="modalSpacing">
                                <div className={classes.description}>{APPROVE_PILLAR_DESCRIPTION}</div>

                                <div className={classes.pillarApprovedText} id="filled-helper-text-approve-pillar">
                                    {PILLAR_APPROVERD} {numberWithCommas(this.props.value, DECIMAL[PILLAR_SYMBOL])} {PILLAR_SYMBOL}
                                </div>
                                <FormControl variant="filled" fullWidth={true}>
                                    <FormButton
                                        text={APPROVE_PILLAR}
                                        disabled={this.state.approveDisabled}
                                        clickFunction={this.approvePillarWalletTransition(this.props.repayCallback)}
                                    />

                                    <Box onClick={() => this.props.repayCallback()}>
                                        <FormHelperText style={modalLinkStyle} id="filled-helper-text">
                                            {'Back to Repay'}
                                        </FormHelperText>
                                    </Box>
                                </FormControl>
                            </div>
                        ) : (
                            { loadingContent }
                        )}
                    </div>
                </Card>
            </Fade>
        );
    }
}

export { LiquidateVaultFade };
