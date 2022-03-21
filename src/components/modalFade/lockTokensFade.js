import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CancelButton, FormButton } from '../buttons';
import {
    ADD_GZIL_TOKENS,
    ENTER_GZIL_TOKEN,
    NETWORK,
    DECIMAL,
    LOCKING_TOKENS,
    LOCKED_TOKENS,
    LOCK_TOKENS_DONE,
    LOCK_TOKENS,
    GZIL_SYMBOL,
    GZIL_TOKEN_ADDRESS,
    APPROVE_GZIL,
} from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';
import { toBech32Address } from '@zilliqa-js/crypto';
import { BigNumber as BN } from 'bignumber.js';

import { numberWithCommas } from '../helpers';
import { approveGzilTransition } from '../../walletOperations/approveGzil';
import { lockTokenTransition } from '../../walletOperations/lockTokens';

class LockTokensFade extends Component {
    render() {
        return (
            <Slide1
                header={LOCK_TOKENS}
                in={this.props.open}
                cancelCallback={this.props.cancelCallback}
                cancel={LOCK_TOKENS_DONE}
                approvedGzil={this.props.approvedGzil}
                gzilBalanceText={this.props.gzilBalanceText}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lockTokenDisabled: true,
            approveGzilDisabled: true,
            amount: 0,
            loading: false,
            success: false,
        };
    }

    handleAmountInput = (e) => {
        console.log({ value: e.target.value, approvedGzil: this.props.approvedGzil });
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState({
                amount: 0,
                lockTokenDisabled: true,
                approveGzilDisabled: true,
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL.GZIL)).toNumber();

            if (new BN(this.props.approvedGzil).gte(actualAmount) && actualAmount !== 0) {
                this.setState({
                    amount: parseInt(actualAmount),
                    lockTokenDisabled: false,
                    approveGzilDisabled: true,
                });
            } else {
                this.setState({
                    amount: parseInt(actualAmount),
                    lockTokenDisabled: true,
                    approveGzilDisabled: false,
                });
            }
        }
    };

    lockTokensWalletTransition = async () => {
        this.setState({ loading: true });
        let result = await lockTokenTransition(window.zilPay, this.state.amount);

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }
        this.setState({ loading: false, success: true });
        window.location.reload();
    };

    approveGzilToStakingContract = async () => {
        this.setState({ loading: true });
        let result = await approveGzilTransition(window.zilPay, this.state.amount);

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }
        this.setState({ loading: false, success: true });
        window.location.reload();
    };

    render() {
        let loadingContent = (
            <div>
                <div className={classes.loadingAddCollateral}>
                    <CircularProgress />
                    <div>
                        {LOCKING_TOKENS} {numberWithCommas(this.state.amount, DECIMAL.GZIL)} {GZIL_SYMBOL}
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
                        {LOCKED_TOKENS}: {numberWithCommas(this.state.amount, DECIMAL.GZIL)} {GZIL_SYMBOL}{' '}
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
                            <div className={classes.heading}>{ADD_GZIL_TOKENS}</div>
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
                                    <div className={classes.vaultAddressText}>{GZIL_SYMBOL} Contract</div>
                                    <div className={classes.vaultAddressValue}>
                                        {toBech32Address(GZIL_TOKEN_ADDRESS)}
                                        <FileCopyOutlinedIcon
                                            fontSize={'inherit'}
                                            onClick={() => navigator.clipboard.writeText(toBech32Address(GZIL_TOKEN_ADDRESS))}
                                        />
                                    </div>
                                </div>
                                {/* start working here */}
                                <FormControl variant="filled" fullWidth={true}>
                                    <div className={classes.amountToAdd}>{ENTER_GZIL_TOKEN}</div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleAmountInput}
                                        endAdornment={<InputAdornment position="end">{GZIL_SYMBOL}</InputAdornment>}
                                    />
                                    <div className={classes.amountToLock}>{this.props.gzilBalanceText}</div>

                                    <FormButton
                                        text={APPROVE_GZIL}
                                        disabled={this.state.approveGzilDisabled}
                                        clickFunction={this.approveGzilToStakingContract}
                                    />

                                    <FormButton
                                        text={ADD_GZIL_TOKENS}
                                        disabled={this.state.lockTokenDisabled}
                                        clickFunction={this.lockTokensWalletTransition}
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

export { LockTokensFade };
