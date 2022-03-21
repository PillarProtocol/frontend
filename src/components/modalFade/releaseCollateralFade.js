import { Component } from 'react';
import { releaseCollateralCardStyle } from './styles';

import { Fade, Card, Typography, FormControl, InputAdornment, OutlinedInput, IconButton, CircularProgress } from '@material-ui/core';

import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Close as CloseIcon,
    ErrorOutlineRounded as ErrorOutlineRoundedIcon,
} from '@material-ui/icons';

import { FormButton, CancelButton } from '../buttons';

import {
    errorStyle,
    // modalLinkStyle,
} from './styles';

import {
    RELEASE_COLLATERAL_TEXT,
    LOADING_RELEASE,
    DECIMAL,
    YOUR_WALLET_ADDRESS,
    USE_YOUR_OWN_VAULT,
    AMOUNT_TO_RELEASE,
    CANCEL_TEXT,
    RECOMMENDED_RELEASE_COLLATERAL_TEXT,
    RELEASE_COLLATERAL_WARNING,
    NETWORK,
} from '../../config';

import { numberWithCommas, toBech32, transformAddress as transform, isValidAddress } from '../helpers';

import classes from './releaseCollateralFade.module.scss';

import { BigNumber as BN } from 'bignumber.js';

import { releaseCollateralTransition } from '../../walletOperations/releaseCollateral';

class ReleaseCollateralFade extends Component {
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
                vaultData={this.props.vaultData}
                cancelCallback={this.props.cancelCallback}
                walletAddress={this.props.walletAddress}
                type={this.props.vaultData ? this.props.vaultData.type : 'Type'}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressOk: true,
            inputOk: true,
            errorMessage: `Please Enter Address to receive ${this.props.vaultData.type} and amount`,
            loading: false,
            success: false,
            amount: '',
            walletAddress: '',
        };
    }

    handleAmountInput = (maxWithdrawableCollateral) => (e) => {
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState((state) => {
                return {
                    ...state,
                    inputOk: false,
                    errorMessage: 'Enter a valid non-zero amount',
                    maxWithdrawableCollateral,
                    amount: null,
                };
            });
        } else {
            let actualAmount = new BN(e.target.value)
                .multipliedBy(new BN(10).exponentiatedBy(DECIMAL[this.props.vaultData.type]))
                .toNumber();

            this.setState((state) => {
                if (state.addressOk) {
                    return {
                        ...state,
                        inputOk: true,
                        errorMessage: '',
                        maxWithdrawableCollateral,
                        amount: parseInt(actualAmount),
                    };
                } else {
                    return {
                        ...state,
                        inputOk: true,
                        errorMessage: 'Enter a valid address to receive pil',
                        maxWithdrawableCollateral,
                        amount: parseInt(actualAmount),
                    };
                }
            });
        }
    };

    handleAddressInput = (e) => {
        // check for zilliqa compatible address here
        if (!e.target.value || !isValidAddress(e.target.value)) {
            this.setState((state) => {
                return {
                    ...state,
                    addressOk: false,
                    errorMessage: 'Enter a valid address to receive pil',
                    walletAddress: null,
                };
            });
        } else {
            //To Validate: setting the walletAddress in state
            this.setState((state) => {
                if (state.inputOk) {
                    return {
                        ...state,
                        addressOk: true,
                        errorMessage: '',
                        walletAddress: e.target.value,
                    };
                } else {
                    return {
                        ...state,
                        addressOk: true,
                        errorMessage: 'Enter a valid non-zero amount',
                        walletAddress: null,
                    };
                }
            });
        }
    };

    recommendedCollateralValue = (data) => {
        if (data) {
            if (data.liquidationValue.toNumber() < parseInt(data.totalDebt)) {
                return 0;
            } else {
                let nc = new BN(data.collateralLocked).multipliedBy(data.totalDebt).dividedBy(data.liquidationValue);
                let diff = new BN(data.collateralLocked).minus(nc);
                return parseInt(diff.dividedBy(1.5).toNumber());
            }
        } else {
            return (
                <div>
                    <CircularProgress />
                </div>
            );
        }
    };

    handleCopy = () => {
        navigator.clipboard.writeText(this.props.walletAddress);
    };

    releaseCollateralWalletTransition = (callback) => async () => {
        //TO_DO_AKSHAY
        //to replace with actual API call

        this.setState({ loading: true });

        let result = await releaseCollateralTransition(
            window.zilPay,
            this.props.type,
            this.props.vaultData.vaultId,
            this.state.walletAddress,
            `${this.state.amount}`
        );

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
        let loadingContent = (
            <div>
                <div className={classes.loadingBorrowPillar}>
                    <CircularProgress />
                    <div>
                        {LOADING_RELEASE} {numberWithCommas(this.state.amount, DECIMAL[this.props.vaultData.type])}{' '}
                        {this.props.vaultData.type}
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
                        Amount Released: {numberWithCommas(this.state.amount, DECIMAL[this.props.vaultData.type])}{' '}
                        {this.props.vaultData.type}{' '}
                    </div>
                    <div>From Vault: {this.props.vaultData.vaultId}</div>
                    <div>To Address: {isValidAddress(this.state.walletAddress) ? toBech32(this.state.walletAddress) : null}</div>
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
                            <div className={classes.heading}>{RELEASE_COLLATERAL_TEXT}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div>
                                <div className="modalSpacing">
                                    <div className={classes.vaultAddress}>
                                        <div className={classes.vaultAddressText}>{YOUR_WALLET_ADDRESS}</div>
                                        <div className={classes.vaultAddressValue}>
                                            {`Connected Wallet: ${transform(this.props.walletAddress)}`}
                                            <div className={classes.useThisAddress} onClick={this.handleCopy}>
                                                {USE_YOUR_OWN_VAULT}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.temp}>
                                        <FormControl variant="filled" fullWidth={true}>
                                            <OutlinedInput
                                                id="filled-adornment-release-collateral-address"
                                                aria-describedby="filled-helper-text-release-collateral-address"
                                                onChange={this.handleAddressInput}
                                            />
                                        </FormControl>
                                    </div>

                                    <div>
                                        <FormControl variant="filled" fullWidth={true}>
                                            <div className={classes.amountToReleaseLabel}>{AMOUNT_TO_RELEASE}</div>
                                            <OutlinedInput
                                                id="filled-adornment-release-collateral-amount"
                                                aria-describedby="filled-helper-text-release-collateral-amount"
                                                onChange={this.handleAmountInput(this.recommendedCollateralValue(this.props.vaultData))}
                                                endAdornment={<InputAdornment position="end">{this.props.vaultData.type}</InputAdornment>}
                                            />

                                            <FormButton
                                                disabled={
                                                    !this.state.addressOk ||
                                                    !this.state.inputOk ||
                                                    !this.state.walletAddress ||
                                                    !this.state.amount
                                                }
                                                text={RELEASE_COLLATERAL_TEXT}
                                                clickFunction={this.releaseCollateralWalletTransition(this.props.cancelCallback)}
                                            />
                                            <CancelButton text={CANCEL_TEXT} clickFunction={this.props.cancelCallback} />
                                            <Typography style={errorStyle}>{this.state.errorMessage}</Typography>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className={classes.warningBox}>
                                    <div className={classes.warningMsg}>
                                        <ErrorOutlineRoundedIcon fontSize={'inherit'} />
                                        {RELEASE_COLLATERAL_WARNING}
                                    </div>
                                    <div className={classes.recommended}>
                                        <div className={classes.text}>{RECOMMENDED_RELEASE_COLLATERAL_TEXT}:</div>
                                        <div className={classes.value}>
                                            {numberWithCommas(
                                                this.recommendedCollateralValue(this.props.vaultData),
                                                DECIMAL[this.props.vaultData ? this.props.vaultData.type : 2]
                                            )}{' '}
                                            {this.props.vaultData ? this.props.vaultData.type : 'Collateral Loading ...'}
                                        </div>
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

export { ReleaseCollateralFade };
