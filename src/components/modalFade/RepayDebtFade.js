import { Component } from 'react';
import { addCollateralCardStyle } from './styles';
import { Fade, Card, FormControl, OutlinedInput, InputAdornment, CircularProgress, Box, FormHelperText } from '@material-ui/core';

import { CheckCircleOutline as CheckCircleOutlineIcon } from '@material-ui/icons';

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { CancelButton, FormButton } from '../buttons';
import {
    VAULT_FACTORY,
    ENTER_PILLAR_AMOUNT_TEXT,
    NETWORK,
    DECIMAL,
    PILLAR_SYMBOL,
    REPAY_SUCCESS_START,
    REPAY_SUCCESS_END,
    REPAY_LOADING,
    REPAY_DEBT,
    BACKEND_SERVICE,
    APPROVE_PILLAR,
    APPROVE_PILLAR_DESCRIPTION,
    PILLAR_APPROVERD,
    APPROVE_COLLATERAL_LOAD,
} from '../../config.js';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import classes from './addCollateralFade.module.scss';
import { toBech32Address } from '@zilliqa-js/crypto';
import { BigNumber as BN } from 'bignumber.js';

import { numberWithCommas } from '../helpers';
import { style, modalLinkStyle } from './styles';

import { repayPartialTransition } from '../../walletOperations/repayPartial';

import { approvePillarOperation } from '../../walletOperations/approvePillar';

import axios from 'axios';
import { approvedPillar } from '../routes';

const operations = {
    repay: 'repay',
    approvePillar: 'approve pillar',
};

class RepayDebtFade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operation: operations.repay,
        };

        this.approvePillarCallback = this.approvePillarCallback.bind(this);
        this.repayCallback = this.repayCallback.bind(this);
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

    repayCallback() {
        this.setState((state) => {
            return {
                ...state,
                operation: operations.repay,
            };
        });
    }

    render() {
        if (this.state.operation === operations.repay) {
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
            repayDebtDisabled: true,
        };
    }

    handleAmountInput = (e) => {
        console.log({ value: e.target.value });
        if (!e.target.value || isNaN(e.target.value)) {
            this.setState({
                amount: 0,
                repayDebtDisabled: true,
            });
        } else {
            let actualAmount = new BN(e.target.value).multipliedBy(new BN(10).exponentiatedBy(DECIMAL[PILLAR_SYMBOL])).toNumber();

            this.setState({
                amount: parseInt(actualAmount),
                repayDebtDisabled: false,
            });
        }
    };

    repayDebtWalletTransition = async () => {
        this.setState({ loading: true });
        let result = await repayPartialTransition(window.zilPay, this.props.type, this.props.vaultId, `${this.state.amount}`);

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
                        {REPAY_LOADING} {numberWithCommas(this.state.amount, DECIMAL[PILLAR_SYMBOL])} {PILLAR_SYMBOL}
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
                        {REPAY_SUCCESS_START}: {numberWithCommas(this.state.amount, DECIMAL[PILLAR_SYMBOL])} {PILLAR_SYMBOL}{' '}
                        {REPAY_SUCCESS_END}
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
                            <div className={classes.heading}>{REPAY_DEBT}</div>
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
                                    <div className={classes.amountToAdd}>{ENTER_PILLAR_AMOUNT_TEXT}</div>

                                    <OutlinedInput
                                        id="filled-adornment-add-collateral-amount"
                                        aria-describedby="filled-helper-text-add-collateral-amount"
                                        onChange={this.handleAmountInput}
                                        endAdornment={<InputAdornment position="end">{PILLAR_SYMBOL}</InputAdornment>}
                                    />
                                    <FormButton
                                        text={APPROVE_PILLAR}
                                        disabled={parseInt(this.props.approvedPillar) >= 10000000000000000000000000}
                                        clickFunction={this.props.approvePillarCallback}
                                    />
                                    <FormButton
                                        text={REPAY_DEBT}
                                        disabled={
                                            parseInt(this.props.approvedPillar) < 10000000000000000000000000 || this.state.repayDebtDisabled
                                        }
                                        clickFunction={this.repayDebtWalletTransition}
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

export { RepayDebtFade };
