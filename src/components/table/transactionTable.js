import { Component } from 'react';
import {
    RECENT_TRANSACTIONS,
    COLLATERALS,
    BACKEND_SERVICE,
    DASHBOARD_TABLE_COLUMNS,
    NETWORK,
    ADD_COLLATERAL_OPERATION,
    REMOVE_COLLATERAL_OPERATION,
    DECIMAL,
    REPAY_OPERATION,
    PILLAR_SYMBOL,
    PRINCIPLE,
    INTEREST,
} from '../../config';

import { transactions, vaultTransactions } from '../routes';

import { timeDifference, transformTransactionHash as transform, numberWithCommas } from '../helpers';

import {
    Card,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TextField,
    TableFooter,
    TableCell,
    CircularProgress,
    Link,
} from '@material-ui/core';

import { TransactionsDropDownButton, PreviousButton, NextButton } from '../buttons';

import classes from './transactionTable.module.scss';

import { rowStyle } from './style';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import axios from 'axios';

const cell = {
    fontFamily: 'Karla',
    fontStyle: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    alignItems: 'center',
    padding: '16px 24px',
};

const cell1 = {
    ...cell,
    fontWeight: 'normal',
    color: '#666666',
};

const cell23 = {
    ...cell,
    fontWeight: '600',
    color: '#359595',
};

const cell456 = {
    ...cell,
    fontWeight: 'normal',
    color: '#222222',
};

const primarySearch = {
    All: 'All',
    Vaults: 'Vaults',
};

const searchPlacerHolder = {
    All: 'Disabled',
    Vaults: 'example: WZIL-14',
};

class TransactionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            pageLimit: 10,
            primarySearchField: COLLATERALS.includes(props.vaultFactory) ? primarySearch.Vaults : primarySearch.All,
            disablePrimaryInputField: !COLLATERALS.includes(props.vaultFactory),
            secondrySearchField: COLLATERALS.includes(props.vaultFactory) ? props.vaultFactory : primarySearch.All,
            vaultId: props.vaultId,
            placeholder: COLLATERALS.includes(props.vaultFactory) ? searchPlacerHolder.Vaults : searchPlacerHolder.All,
            rows: [],
        };
    }

    componentDidMount() {
        if (this.state.primarySearchField === primarySearch.All) {
            this.getData();
        } else {
            this.getDataVault();
        }
    }

    componentWillUnmount() {}

    updatePrimaryFilter = async (selectedFilterOption) => {
        if (selectedFilterOption === primarySearch.All) {
            this.setState({
                disablePrimaryInputField: true,
                primarySearchField: primarySearch.All,
                secondrySearchField: primarySearch.All,
                placeholder: searchPlacerHolder.All,
            });
            await this.loadAllTransactions();
        } else {
            this.setState({
                disablePrimaryInputField: false,
                primarySearchField: primarySearch.Vaults,
                secondrySearchField: primarySearch.All,
                placeholder: searchPlacerHolder.Vaults,
            });
        }
    };
    handleLoad = async (e) => {
        if (e.key === 'Enter') {
            this.setState({ page: 0 });
            await this.loadTransaction();
        } else {
            this.setState({ vaultFullName: e.target.value });
        }
    };

    loadAllTransactions = async () => {
        this.setState({
            page: 0,
        });
        await this.getData();
    };

    async getDataVault() {
        this.setState({
            isLoaded: false,
            rows: [],
        });
        const { data: result } = await axios.get(
            `${BACKEND_SERVICE}${vaultTransactions}${this.state.secondrySearchField}/${this.state.vaultId}?page=${this.state.page}&pageLimit=${this.state.pageLimit}`
        );
        this.setState({
            isLoaded: true,
            rows: result,
        });
    }

    async getData() {
        this.setState({
            isLoaded: false,
            rows: [],
        });
        const { data: result } = await axios.get(
            `${BACKEND_SERVICE}${transactions}?page=${this.state.page}&pageLimit=${this.state.pageLimit}`
        );
        this.setState({
            isLoaded: true,
            rows: result,
        });
    }

    nextPage = async () => {
        this.setState({
            isLoaded: false,
            rows: [],
        });
        let url;
        if (this.state.primarySearchField === primarySearch.All) {
            url = `${BACKEND_SERVICE}${transactions}?page=${this.state.page + 1}&pageLimit=${this.state.pageLimit}`;
        } else {
            url = `${BACKEND_SERVICE}${vaultTransactions}${this.state.secondrySearchField}/${this.state.vaultId}?page=${
                this.state.page + 1
            }&pageLimit=${this.state.pageLimit}`;
        }
        const { data: result } = await axios.get(url);
        this.setState((state) => {
            return {
                ...state,
                isLoaded: true,
                rows: result,
                page: state.page + 1,
            };
        });
    };

    previousPage = async () => {
        this.setState({
            isLoaded: false,
            rows: [],
        });

        let url;
        if (this.state.primarySearchField === primarySearch.All) {
            url = `${BACKEND_SERVICE}${transactions}?page=${this.state.page - 1}&pageLimit=${this.state.pageLimit}`;
        } else {
            url = `${BACKEND_SERVICE}${vaultTransactions}${this.state.secondrySearchField}/${this.state.vaultId}?page=${
                this.state.page - 1
            }&pageLimit=${this.state.pageLimit}`;
        }
        const { data: result } = await axios.get(url);
        this.setState((state) => {
            return {
                ...state,
                isLoaded: true,
                rows: result,
                page: state.page - 1,
            };
        });
    };

    loadTransaction = async (e) => {
        let vaultFullName = this.state.vaultFullName.trim();
        let [factory, vaultId] = vaultFullName.split('-');
        if (factory && vaultId && vaultFullName.split('-').length === 2) {
            if (COLLATERALS.includes(factory)) {
                this.setState({
                    isLoaded: false,
                    rows: [],
                });
                const { data: result } = await axios.get(
                    `${BACKEND_SERVICE}${vaultTransactions}${factory}/${vaultId}?page=${this.state.page}&pageLimit=${this.state.pageLimit}`
                );
                this.setState({
                    isLoaded: true,
                    rows: result,
                    secondrySearchField: factory,
                    vaultId,
                });
            } else {
                alert('Unsupported collateral type');
            }
        } else {
            console.log({ vaultFullName });
            alert('Incorrect vault name format. Example: (WZIL-12)');
        }
    };

    formatAmount(operation, collateral, amount, details) {
        if (operation === ADD_COLLATERAL_OPERATION || operation === REMOVE_COLLATERAL_OPERATION) {
            return `${numberWithCommas(amount, DECIMAL[collateral])} ${collateral}`;
        } else if (operation === REPAY_OPERATION) {
            return (
                <div>
                    <div>{`${numberWithCommas(amount, DECIMAL.PIL)} ${PILLAR_SYMBOL}`}</div>
                    <div className={classes.repayOperationCell}>
                        {`${numberWithCommas(details.principleCleared, DECIMAL.PIL)}`} {PRINCIPLE}
                        {`, `}
                        {`${numberWithCommas(details.interestCleared, DECIMAL.PIL)}`} {INTEREST}
                    </div>
                </div>
            );
        } else {
            return `${numberWithCommas(amount, DECIMAL.PIL)} ${PILLAR_SYMBOL}`;
        }
    }

    render() {
        // console.log(this.state);
        let tableRowHeaders;
        let rowElements;

        tableRowHeaders = DASHBOARD_TABLE_COLUMNS.map((header, index) => (
            <TableCell key={'header_' + index} align="left" style={rowStyle}>
                {header}
            </TableCell>
        ));

        let { isLoaded, rows } = this.state;
        if (!isLoaded) {
            rowElements = (
                <TableRow key={'random index not to be used'}>
                    <TableCell>
                        <div className={classes.loadingDashboardTable}>
                            <CircularProgress />
                        </div>
                    </TableCell>
                </TableRow>
            );
        } else {
            // console.log(rows);
            rowElements = rows.map((row, index) => (
                <TableRow key={index}>
                    <TableCell key={index + '_' + row.timestamp} style={cell1} align="left">
                        {timeDifference(row.timestamp)}
                    </TableCell>
                    <TableCell key={index + '_' + row.transactionHash} style={cell23} align="left">
                        <Link
                            target="_blank"
                            rel="noopener"
                            href={`https://viewblock.io/zilliqa/tx/0x${row.transactionHash}?network=${NETWORK}`}
                            color="inherit"
                        >
                            {transform(row.transactionHash)}
                        </Link>
                    </TableCell>
                    <TableCell key={index + '_' + row.vaultId} style={cell23} align="left">
                        <Link
                            target="_blank"
                            rel="noopener"
                            href={`/vault/${row.collateral || this.state.secondrySearchField}/${row.vaultId}`}
                            color="inherit"
                        >
                            {row.vaultId}
                        </Link>
                    </TableCell>
                    <TableCell key={index + '_amount_' + row.amount} style={cell456} align="left">
                        {this.formatAmount(row.operation, row.collateral || row.type, row.amount, row.details)}
                    </TableCell>
                    <TableCell key={index + '_' + row.collateral + '_' + row.transactionHash} style={cell456} align="left">
                        {row.collateral || row.type}
                    </TableCell>
                    <TableCell key={index + '_' + row.operation + '_' + row.transactionHash} style={cell456} align="left">
                        {row.operation}
                    </TableCell>
                </TableRow>
            ));
        }
        return (
            <div className={classes.tablePadding}>
                <div className={classes.primaryInputPadding}>
                    <TransactionsDropDownButton
                        defaultSelection={this.state.primarySearchField}
                        collaterals={[primarySearch.All, primarySearch.Vaults]}
                        updateFilter={this.updatePrimaryFilter}
                    />
                    <TextField
                        placeholder={this.state.placeholder}
                        variant="outlined"
                        size="small"
                        disabled={this.state.disablePrimaryInputField}
                        onKeyUp={this.handleLoad}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton
                                        className={classes.searchIconColor}
                                        onClick={() => this.loadTransaction()}
                                        disabled={this.state.disablePrimaryInputField}
                                    >
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <Card>
                    <div className={classes.alignTableTitle}>
                        <div className={classes.text}>{RECENT_TRANSACTIONS}</div>
                    </div>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="Transactions Table">
                            <TableHead>
                                <TableRow>{tableRowHeaders}</TableRow>
                            </TableHead>
                            <TableBody>{rowElements}</TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell align="left">
                                        <PreviousButton
                                            disabled={this.state.page === 0}
                                            text={'Previous'}
                                            clickFunction={this.previousPage}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <NextButton
                                            disabled={this.state.rows.length < this.state.pageLimit}
                                            text={'Next'}
                                            clickFunction={this.nextPage}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Card>
            </div>
        );
    }
}

export { TransactionTable };
