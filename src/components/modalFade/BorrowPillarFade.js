import { Component } from 'react';
import { borrowCardStyle } from './styles';
import {
    Fade,
    Card,
    Typography,
    FormControl,
    // FormHelperText,
    InputAdornment,
    OutlinedInput,
} from '@material-ui/core';
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded';
import { FormButton, CancelButton } from '../buttons';
import {
    // modalLinkStyle,
    errorStyle,
} from './styles';

import { transformAddress as transform, toBech32, getHexAddress } from '../helpers';

import {
    BORROW_PILLAR_TEXT,
    YOUR_WALLET_ADDRESS,
    USE_YOUR_OWN_VAULT,
    AMOUNT_TO_BORROW,
    PILLAR_SYMBOL,
    CANCEL_TEXT,
    MINT_PILLAR_WARNING,
    RECOMMENDED_PILLAR_MINT_TEXT,
    ADD_COLLATERAL_TEXT,
    DECIMAL,
    LOADING_BORROW,
    NETWORK,
} from '../../config.js';
import classes from './borrowPillarFade.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { numberWithCommas } from '../helpers';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { BigNumber as BN } from 'bignumber.js';
import { isValidAddress } from '../helpers';
import { borrowPillarTransaction } from '../../walletOperations/borrowPillar';
class BorrowPillarFade extends Component {
    render() {
        return (
            <Slide1
                in={this.props.open}
                cancelCallback={this.props.cancelCallback}
                walletAddress={this.props.walletAddress}
                pillarData={this.props.pillarData}
                addCollateralCallback={this.props.addCollateralCallback}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        //TO_DO_AKSHAY
        // replace this variable will actual values loading, success, and amount, walletAddress
        //value: value in textbox amount, walletAddress
        this.state = {
            addressOk: true,
            inputOk: true,
            errorMessage: 'Please Enter Address to receive PIL and amount',
            loading: false,
            success: false,
            amount: '',
            walletAddress: '',
        };
    }

    handleCopy = () => {
        navigator.clipboard.writeText(this.props.walletAddress);
    };

    borrowPillarWalletTransition = (callback) => async () => {
        //TO_DO_AKSHAY
        //to replace with actual API call

        this.setState({ loading: true });

        let result = await borrowPillarTransaction(
            window.zilPay,
            this.props.pillarData.type,
            this.props.pillarData.vaultId,
            getHexAddress(this.state.walletAddress),
            `${this.state.amount}`
        );

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
            // console.log(result);
        } else {
            this.setState({ loading: false, success: true });
            // callback();
        }
    };

    handleAmountInput = (maxMintablePillar) => (e) => {
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState((state) => {
                return {
                    ...state,
                    inputOk: false,
                    errorMessage: 'Enter a valid non-zero amount',
                    maxMintablePillar,
                    amount: null,
                };
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL.PIL)).toNumber();

            this.setState((state) => {
                if (state.addressOk) {
                    return {
                        ...state,
                        inputOk: true,
                        errorMessage: '',
                        maxMintablePillar,
                        amount: parseInt(actualAmount),
                    };
                } else {
                    return {
                        ...state,
                        inputOk: true,
                        errorMessage: 'Enter a valid address to receive pil',
                        maxMintablePillar,
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
                    console.log(`Wallet address to mint pillar ${e.target.value}`);
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
                    };
                }
            });
            console.log(this.state);
        }
    };

    recommendedPillarValue = (data) => {
        if (data) {
            let result = new BN(data.collateralLockedInCents)
                .multipliedBy(100000000)
                .dividedBy(data.liquidationRatio)
                .minus(data.totalDebt)
                .dividedBy(1.5);

            return parseInt(Math.ceil(result.toNumber()));
        } else {
            return (
                <div>
                    <CircularProgress />
                </div>
            );
        }
    };

    render() {
        let addCollateralButton =
            this.state.maxMintablePillar && this.state.amount && this.state.maxMintablePillar < this.state.amount ? (
                <FormButton disabled={false} text={ADD_COLLATERAL_TEXT} clickFunction={this.props.addCollateralCallback} />
            ) : null;

        let loadingContent = (
            <div>
                <div className={classes.loadingBorrowPillar}>
                    <CircularProgress />
                    <div>
                        {LOADING_BORROW} {numberWithCommas(this.state.amount, DECIMAL.PIL)} {PILLAR_SYMBOL}
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
                        Pillar Borrowed: {numberWithCommas(this.state.amount, DECIMAL.PIL)} {PILLAR_SYMBOL}{' '}
                    </div>
                    <div>From Vault: {this.props.pillarData.vaultId}</div>
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
                <Card style={borrowCardStyle}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{BORROW_PILLAR_TEXT}</div>
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
                                                id="filled-adornment-borrow-pillar-address"
                                                aria-describedby="filled-helper-text-borrow-pillar-address"
                                                // onChange={this.handleAddressInput}
                                                onKeyUp={this.handleAddressInput}
                                            />
                                        </FormControl>
                                    </div>

                                    <div>
                                        <FormControl variant="filled" fullWidth={true}>
                                            <div className={classes.amountToBorrowLabel}>{AMOUNT_TO_BORROW}</div>

                                            <OutlinedInput
                                                id="filled-adornment-borrow-pillar-amount"
                                                aria-describedby="filled-helper-text-borrow-pillar-amount"
                                                onChange={this.handleAmountInput(this.recommendedPillarValue(this.props.pillarData))}
                                                endAdornment={<InputAdornment position="end">{PILLAR_SYMBOL}</InputAdornment>}
                                            />
                                            {addCollateralButton}
                                            <FormButton
                                                disabled={
                                                    !this.state.addressOk ||
                                                    !this.state.inputOk ||
                                                    !this.state.walletAddress ||
                                                    !this.state.amount
                                                }
                                                text={BORROW_PILLAR_TEXT}
                                                clickFunction={this.borrowPillarWalletTransition(this.props.cancelCallback)}
                                            />
                                            <CancelButton text={CANCEL_TEXT} clickFunction={this.props.cancelCallback} />
                                            <Typography style={errorStyle}>{this.state.errorMessage}</Typography>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className={classes.warningBox}>
                                    <div className={classes.warningMsg}>
                                        <ErrorOutlineRoundedIcon fontSize={'inherit'} />
                                        {MINT_PILLAR_WARNING}
                                    </div>
                                    <div className={classes.recommended}>
                                        <div className={classes.text}>{RECOMMENDED_PILLAR_MINT_TEXT}:</div>
                                        <div className={classes.value}>
                                            {numberWithCommas(this.recommendedPillarValue(this.props.pillarData), DECIMAL.PIL)}{' '}
                                            {PILLAR_SYMBOL}
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

export { BorrowPillarFade };
