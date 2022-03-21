import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import { CancelButton, FormButton } from '../buttons';
import { NETWORK, GZIL_DELEGATION } from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';

import { toBech32Address } from '@zilliqa-js/crypto';
import { withdrawTokensTransition } from '../../walletOperations/withdrawStakedTokens';

class WithdrawFade extends Component {
    render() {
        return (
            <Slide1
                header={`Delegation Contract: ${toBech32Address(GZIL_DELEGATION)}`}
                in={this.props.open}
                cancelCallback={this.props.cancelCallback}
                cancel={'Done'}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            requestId: null,
            loading: false,
            success: false,
        };
    }

    handleRequestInput = (e) => {
        console.log({ value: e.target.value });
        // console.log(this.state);
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState({
                requestId: null,
                isValid: false,
            });
        } else {
            this.setState({
                requestId: e.target.value,
                isValid: true,
            });
        }
    };

    withdrawTransition = async () => {
        this.setState({ loading: true });
        let result = await withdrawTokensTransition(window.zilPay, this.state.requestId);

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
                        {'Withdrawing Request: '} {this.state.requestId}
                    </div>
                </div>
            </div>
        );

        let successContent = (
            <div>
                <div className={classes.successModal}>
                    <CheckCircleOutlineIcon style={{ color: '31AD65', height: '48px', width: '48px' }} />
                    {/* TO_DO_AKSHAY */}
                    {'Withdrawed Request: '} {this.state.requestId}
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
                            <div className={classes.heading}>{'Withdraw Shares/Tokens'}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div className="modalSpacing">
                                <div className={classes.headerDescription}>{this.props.header}</div>
                                {/* start working here */}
                                <FormControl variant="filled" fullWidth={true}>
                                    <div className={classes.amountToAdd}>{'Enter the request ID to unlock the shares from'}</div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleRequestInput}
                                        endAdornment={<InputAdornment position="end">{'Request ID'}</InputAdornment>}
                                    />

                                    <FormButton
                                        text={'Withdraw Tokens from request'}
                                        disabled={!this.state.isValid}
                                        clickFunction={this.withdrawTransition}
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

export { WithdrawFade };
