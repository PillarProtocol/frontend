import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import { CancelButton, FormButton } from '../buttons';
import { NETWORK, DECIMAL, SHARES_SYMBOL, GZIL_DELEGATION } from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';

import { numberWithCommas } from '../helpers';
import { toBech32Address } from '@zilliqa-js/crypto';
import { BigNumber as BN } from 'bignumber.js';
import { unlockTokenRequestTransition } from '../../walletOperations/unlockRequest';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

class RequestUnlockFade extends Component {
    render() {
        return (
            <Slide1
                header={'Delegation'}
                delegationContract={`${toBech32Address(GZIL_DELEGATION)}`}
                in={this.props.open}
                cancelCallback={this.props.cancelCallback}
                cancel={'Done'}
                selfShareBalanceText={this.props.selfShareBalanceText}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValidShare: false,
            sharesToUnlock: null,
            loading: false,
            success: false,
        };
    }

    handleAmountInput = (e) => {
        console.log({ value: e.target.value });
        // console.log(this.state);
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState({
                sharesToUnlock: 0,
                isValidShare: false,
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL.GZIL)).minus(1).toNumber();
            this.setState({ sharesToUnlock: actualAmount, isValidShare: true });
        }
    };

    requestUnlockTransition = async () => {
        this.setState({ loading: true });
        // alert(`${this.state.sharesToUnlock}`)
        let result = await unlockTokenRequestTransition(window.zilPay, this.state.sharesToUnlock);

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
                        {'Unlocking Shares'} {numberWithCommas(this.state.sharesToUnlock, DECIMAL.GZIL)} {SHARES_SYMBOL}
                    </div>
                </div>
            </div>
        );

        let successContent = (
            <div>
                <div className={classes.successModal}>
                    <CheckCircleOutlineIcon style={{ color: '31AD65', height: '48px', width: '48px' }} />
                    {/* TO_DO_AKSHAY */}
                    {'Unlocked Shares'} {numberWithCommas(this.state.sharesToUnlock, DECIMAL.GZIL)} {SHARES_SYMBOL}
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
                            <div className={classes.heading}>{'Request unlock shares'}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div className="modalSpacing">
                                {/* start working here */}
                                <FormControl variant="filled" fullWidth={true}>
                                    <div className={classes.vaultAddress}>
                                        <div className={classes.vaultAddressText}>{this.props.header} Contract</div>
                                        <div className={classes.vaultAddressValue}>
                                            {this.props.delegationContract}
                                            <FileCopyOutlinedIcon
                                                fontSize={'inherit'}
                                                onClick={() => navigator.clipboard.writeText(this.props.delegationContract)}
                                            />
                                        </div>
                                    </div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleAmountInput}
                                        endAdornment={<InputAdornment position="end">{SHARES_SYMBOL}</InputAdornment>}
                                    />

                                    <FormButton
                                        text={'Request Unlock'}
                                        disabled={!this.state.isValidShare}
                                        clickFunction={this.requestUnlockTransition}
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

export { RequestUnlockFade };
