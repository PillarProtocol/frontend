import { Component } from 'react';
import { Fade, Card, FormControl, FormHelperText, Box } from '@material-ui/core';
import { FormButton, CancelButton } from '../buttons';
import { style, modalLinkStyle, vaultFactoryCardStyle } from './styles';
import classes from './vaultFactoryFade.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Union from '../../union.svg';
import { approveCollateralOperation } from '../../walletOperations/approveCollateral';
import { createVaultOperation } from '../../walletOperations/createVault';

import {
    COLLATERAL_APPROVED_LABEL,
    COLLATERL_END,
    CREATE_VAULT_LOADING_START,
    CREATE_VAULT_SUCCESS,
    APPROVE_COLLATERAL_LOAD,
    DECIMAL,
    NEW_VAULT_MESSAGE,
    NETWORK,
} from '../../config.js';

import { numberWithCommas } from '../helpers';

const operations = {
    createVault: 'create vault',
    approveCollateral: 'approve collateral',
};
class CreateVaultFade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            operation: operations.createVault,
        };
        this.approveCollateralCallback = this.approveCollateralCallback.bind(this);
        this.createVaultCallback = this.createVaultCallback.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const { data: result } = await axios.get(`${this.props.data_path}`);
        this.setState({
            isLoaded: true,
            result,
        });
    }

    approveCollateralCallback() {
        this.setState((state) => {
            return {
                ...state,
                operation: operations.approveCollateral,
            };
        });
    }

    createVaultCallback() {
        this.setState((state) => {
            return {
                ...state,
                operation: operations.createVault,
                value: null,
            };
        });
    }

    render() {
        //TO_DO Akshay to validate
        let value = this.state.result ? this.state.result.value : 'M';
        if (this.state.operation === operations.createVault) {
            return (
                <Slide1
                    in={this.props.open}
                    value={value}
                    header={this.props.header}
                    description={this.props.description}
                    vaultFactory={this.props.vaultFactory}
                    approve={this.props.approve}
                    cancel={this.props.cancel}
                    cancelCallback={this.props.cancelCallback}
                    approveCollateralCallback={this.approveCollateralCallback}
                />
            );
        } else if (this.state.operation === operations.approveCollateral) {
            return (
                <Slide2
                    in={this.props.open}
                    value={value}
                    header={this.props.approveHeader}
                    description={this.props.approveDescription}
                    vaultFactory={this.props.vaultFactory}
                    backToCreateVault={this.props.backToCreateVault}
                    createVaultCallback={this.createVaultCallback}
                />
            );
        } else {
            this.props.cancelCallback();
            return null;
        }
    }
}

class Slide2 extends Component {
    //TO_DO_AKSHAY
    // replace this.state.loading variable will actual values for loading
    //amount in text box
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            approveDisabled: false,
            loading: false,
            amount: '',
        };
    }

    approveCollateralWalletTransition = (callback) => async () => {
        this.setState({ loading: true });
        // alert(
        //   "Zilpay transaction: approveCollateral will be done after connecting the wallet " +
        //     numberWithCommas(this.state.amount, DECIMAL[this.props.vaultFactory]) +
        //     " " +
        //     this.props.vaultFactory
        // );
        let result = await approveCollateralOperation(window.zilPay, this.props.vaultFactory, '100000000000000000000000000');

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
        return (
            <Fade in={this.props.in} tabIndex={1}>
                <Card style={style}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{this.props.header}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.props.createVaultCallback} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        {!this.state.loading ? (
                            <div className="modalSpacing">
                                {/* <div className={classes.description}>
                  {this.props.description}
                </div> */}
                                <div className={classes.collateralApprovedText} id="filled-helper-text-approve">
                                    {COLLATERAL_APPROVED_LABEL} {numberWithCommas(this.props.value, DECIMAL[this.props.vaultFactory])}{' '}
                                    {this.props.vaultFactory}
                                </div>
                                <FormControl variant="filled" fullWidth={true}>
                                    <FormButton
                                        text={this.props.header}
                                        disabled={this.state.approveDisabled}
                                        clickFunction={this.approveCollateralWalletTransition(this.props.createVaultCallback)}
                                    />

                                    <Box onClick={() => this.props.createVaultCallback()}>
                                        <FormHelperText style={modalLinkStyle} id="filled-helper-text">
                                            {this.props.backToCreateVault}
                                        </FormHelperText>
                                    </Box>
                                </FormControl>
                            </div>
                        ) : (
                            <div className={classes.loading}>
                                <div>
                                    {APPROVE_COLLATERAL_LOAD} {this.props.vaultFactory} {COLLATERL_END}
                                </div>
                                <CircularProgress />
                            </div>
                        )}
                    </div>
                </Card>
            </Fade>
        );
    }
}
class Slide1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            approveDisabled: false,
            loading: false,
            success: false,
            collateralApproved: true,
        };
    }

    createVaultWalletTransition = (callback) => async () => {
        this.setState({ loading: true });
        let result = await createVaultOperation(window.zilPay, this.props.vaultFactory);
        if (!result.receipt.success) {
            alert(
                `Transaction: ${result.ID} has failed. Please try again. Visit https://viewblock.io/zilliqa/tx/0x${result.ID}?network=${NETWORK}`
            );
            window.location.reload();
        }
        this.setState({ loading: false, success: true });
        // callback();
    };

    render() {
        //TO_DO_AKSHAY
        //REMOVE_HARDCODING
        let successContent = (
            <div>
                <div className={classes.vaultCreated}>
                    <CheckCircleOutlineIcon style={{ color: '31AD65', height: '48px', width: '48px' }} />
                    <div>{CREATE_VAULT_SUCCESS}</div>
                    <FormButton
                        style={{ display: 'flex', width: '100%' }}
                        text="Return to Vault Factory"
                        clickFunction={this.props.cancelCallback}
                    />
                    <div className={classes.successPageFooter}>
                        <div className={classes.boldText}>{NEW_VAULT_MESSAGE}</div>
                        <img src={Union} alt="" />
                        {/* <div className={classes.text}>0xE872...dU4B</div> */}
                    </div>
                </div>
            </div>
        );

        let loadingContent = (
            <div>
                <div className={classes.loadingCreateVault}>
                    <CircularProgress />
                    <div>
                        {CREATE_VAULT_LOADING_START} {this.props.vaultFactory} {COLLATERL_END}
                    </div>
                    <div className={classes.footer}>
                        <img src={Union} alt="" />
                    </div>
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
                <Card style={vaultFactoryCardStyle}>
                    <div>
                        <div className={classes.header}>
                            <div className={classes.heading}>{this.props.header}</div>
                            <div className={classes.closeButton} onClick={this.props.cancelCallback}>
                                <IconButton onClick={this.handleClose} style={{ color: '#AAAAAA' }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                        <div className="modalSpacing">
                            {!this.state.loading && !this.state.success ? (
                                <div>
                                    <FormControl variant="filled" fullWidth={true}>
                                        <FormButton
                                            text={this.props.approve}
                                            disabled={this.props.value > '100000000000000000000000'}
                                            clickFunction={() => this.props.approveCollateralCallback()}
                                        />

                                        <FormButton
                                            text={this.props.header}
                                            disabled={this.props.value < '100000000000000000000000'}
                                            clickFunction={this.createVaultWalletTransition(this.props.cancelCallback)}
                                        />

                                        <CancelButton text={this.props.cancel} clickFunction={this.props.cancelCallback} />
                                    </FormControl>
                                </div>
                            ) : (
                                renderOtherContent
                            )}
                        </div>
                    </div>
                </Card>
            </Fade>
        );
    }
}
export { CreateVaultFade };
