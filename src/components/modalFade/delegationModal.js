import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import { CancelButton, FormButton } from '../buttons';
import { NETWORK, GZIL_DELEGATION } from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';

import { getHexAddress, isValidAddress } from '../helpers';
import { toBech32Address } from '@zilliqa-js/crypto';
import { changeDelegationTransition } from '../../walletOperations/changeDelegation';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

class DelegationModalFade extends Component {
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
            isValidAddress: false,
            addressToDelegate: null,
            loading: false,
            success: false,
        };
    }

    handleAddressInput = (e) => {
        console.log({ value: e.target.value });
        if (isValidAddress(e.target.value)) {
            this.setState({ isValidAddress: true, addressToDelegate: getHexAddress(e.target.value) });
        } else {
            this.setState({ isValidAddress: false, addressToDelegate: null });
        }
    };

    delegateTransition = async () => {
        this.setState({ loading: true });
        let result = await changeDelegationTransition(window.zilPay, this.state.addressToDelegate);

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
                        <div>{`Delegating Tokens to ${this.state.addressToDelegate}`}</div>
                    </div>
                </div>
            </div>
        );

        let successContent = (
            <div>
                <div className={classes.successModal}>
                    <CheckCircleOutlineIcon style={{ color: '31AD65', height: '48px', width: '48px' }} />
                    {/* TO_DO_AKSHAY */}
                    <div>{`Delegated Tokens to ${this.state.addressToDelegate}`}</div>
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
                            <div className={classes.heading}>{'Delegate gzil tokens'}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading && !this.state.success ? (
                            <div className="modalSpacing">
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

                                {/* start working here */}
                                <FormControl variant="filled" fullWidth={true}>
                                    <div className={classes.amountToAdd}>{'Address to delegate'}</div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleAddressInput}
                                        endAdornment={<InputAdornment position="end">{'bech32/base16'}</InputAdornment>}
                                    />
                                    <div className={classes.amountToLock}>{this.props.selfShareBalanceText}</div>

                                    <FormButton
                                        text={'Delegate'}
                                        disabled={!this.state.isValidAddress}
                                        clickFunction={this.delegateTransition}
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

export { DelegationModalFade };
