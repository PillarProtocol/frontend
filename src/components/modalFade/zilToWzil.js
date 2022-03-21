import { Component } from 'react';
import { releaseCollateralCardStyle } from './styles';

import { Fade, Card, Typography, FormControl, InputAdornment, OutlinedInput, IconButton, CircularProgress } from '@material-ui/core';

import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Close as CloseIcon,
    //   ErrorOutlineRounded as ErrorOutlineRoundedIcon,
} from '@material-ui/icons';

import { FormButton, CancelButton } from '../buttons';

import classes from './releaseCollateralFade.module.scss';

import { BigNumber as BN } from 'bignumber.js';

import {
    errorStyle,
    // modalLinkStyle,
} from './styles';

import { ZIL_TO_WZIL, CONVERTING, ZIL_SYMBOL, DECIMAL, AMOUNT_TO_CONVERT, CANCEL_TEXT, NETWORK } from '../../config';

import { numberWithCommas } from '../helpers';
import { zilToWzilTransition } from '../../walletOperations/zilToWzil';

class ZilToWzilFade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }

    render() {
        console.log(this.props);
        return (
            <Slide1
                in={this.props.open}
                vaultFactory={this.props.vaultFactory}
                cancelCallback={this.props.cancelCallback}
                vaultAddress={this.props.vaultAddress}
                walletAddress={this.props.walletAddress}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputOk: true,
            errorMessage: `Enter a valid non-zero amount`,
            loading: false,
            success: false,
            amount: '',
        };
    }

    handleAmountInput = (e) => {
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState((state) => {
                return {
                    ...state,
                    inputOk: false,
                    errorMessage: 'Enter a valid non-zero amount',
                    amount: null,
                };
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL[this.props.vaultFactory])).toNumber();

            this.setState((state) => {
                return {
                    ...state,
                    inputOk: true,
                    amount: parseInt(actualAmount),
                    errorMessage: '',
                };
            });
        }
    };

    convertZilTransition = (callback) => async () => {
        this.setState({ loading: true });

        let result = await zilToWzilTransition(window.zilPay, this.state.amount);

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }

        // alert(
        //   `Zilpay transaction: borrowPillar will be done after connecting the wallet
        //   ${this.state.walletAddress} with amount ${numberWithCommas(
        //     this.state.amount,
        //     DECIMAL.PIL
        //   )}`
        // );

        this.setState({ loading: false, success: true });
    };

    render() {
        let loadingContent = (
            <div>
                <div className={classes.loadingBorrowPillar}>
                    <CircularProgress />
                    <div>
                        {CONVERTING} {numberWithCommas(this.state.amount, DECIMAL[this.props.vaultFactory])} {ZIL_SYMBOL}
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
                        Converted: {numberWithCommas(this.state.amount, DECIMAL[this.props.vaultFactory])} {ZIL_SYMBOL}{' '}
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
                <Card style={releaseCollateralCardStyle}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{ZIL_TO_WZIL}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div>
                                <div className="modalSpacing">
                                    <div>
                                        <FormControl variant="filled" fullWidth={true}>
                                            <div className={classes.amountToReleaseLabel}>{AMOUNT_TO_CONVERT}</div>
                                            <OutlinedInput
                                                id="filled-adornment-release-collateral-amount"
                                                aria-describedby="filled-helper-text-release-collateral-amount"
                                                onChange={this.handleAmountInput}
                                                endAdornment={<InputAdornment position="end">{ZIL_SYMBOL}</InputAdornment>}
                                            />
                                            <FormButton
                                                disabled={!this.state.inputOk || !this.state.amount}
                                                text={ZIL_TO_WZIL}
                                                clickFunction={this.convertZilTransition(this.props.cancelCallback)}
                                            />
                                            <CancelButton text={CANCEL_TEXT} clickFunction={this.props.cancelCallback} />
                                            <Typography style={errorStyle}>{this.state.errorMessage}</Typography>
                                        </FormControl>
                                    </div>
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

export { ZilToWzilFade };
