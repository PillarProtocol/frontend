import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CancelButton, FormButton } from '../buttons';
import {
    ADD_COLLATERAL_TEXT,
    VAULT_FACTORY,
    ENTER_COLLATERAL_AMOUNT_TEXT,
    NETWORK,
    DECIMAL,
    ADDING_COLLATERAL,
    ADDED_COLLATERAL,
} from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';
import { toBech32Address } from '@zilliqa-js/crypto';
import { BigNumber as BN } from 'bignumber.js';

import { numberWithCommas } from '../helpers';

import { addCollateralOperation } from '../../walletOperations/addCollateral';
class AddCollateralFade extends Component {
    render() {
        return (
            <Slide1
                header={this.props.addCollateralRequest}
                in={this.props.open}
                vaultFactory={this.props.vaultFactory}
                cancelCallback={this.props.cancelCallback}
                cancel={this.props.doneText}
                type={this.props.type}
                vaultId={this.props.vaultId}
            />
        );
    }
}

class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addCollateralDisabled: true,
            amount: 0,
            loading: false,
            success: false,
        };
    }

    handleAmountInput = (e) => {
        console.log({ value: e.target.value });
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState({
                amount: 0,
                addCollateralDisabled: true,
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL[this.props.type])).toNumber();

            this.setState({
                amount: parseInt(actualAmount),
                addCollateralDisabled: false,
            });
        }
    };

    addCollateralWalletTransition = async () => {
        this.setState({ loading: true });
        let result = await addCollateralOperation(window.zilPay, this.props.vaultId, this.props.type, this.state.amount);

        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }
        this.setState({ loading: false, success: true });
    };

    render() {
        let loadingContent = (
            <div>
                <div className={classes.loadingAddCollateral}>
                    <CircularProgress />
                    <div>
                        {ADDING_COLLATERAL} {numberWithCommas(this.state.amount, DECIMAL[this.props.type])} {this.props.type}
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
                        {ADDED_COLLATERAL}: {numberWithCommas(this.state.amount, DECIMAL[this.props.type])} {this.props.type}{' '}
                    </div>
                    <div>To Vault: {this.props.vaultId}</div>
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
                            <div className={classes.heading}>{ADD_COLLATERAL_TEXT}</div>
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
                                    <div className={classes.amountToAdd}>{ENTER_COLLATERAL_AMOUNT_TEXT}</div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleAmountInput}
                                        endAdornment={<InputAdornment position="end">{this.props.type}</InputAdornment>}
                                    />
                                    <FormButton
                                        text={ADD_COLLATERAL_TEXT}
                                        disabled={this.state.addCollateralDisabled}
                                        clickFunction={this.addCollateralWalletTransition}
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

export { AddCollateralFade };
