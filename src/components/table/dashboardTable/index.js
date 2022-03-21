import { Component } from 'react';
import {
    // Grid,
    Card,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Link,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { TransactionsDropDownButton } from '../../buttons';
import { transactions } from '../../routes';
import { rowStyle } from '../style';

import { timeDifference, transformTransactionHash as transform, numberWithCommas } from '../../helpers';

import classes from './style.module.scss';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    ADD_COLLATERAL_OPERATION,
    REMOVE_COLLATERAL_OPERATION,
    PILLAR_SYMBOL,
    NETWORK,
    DECIMAL,
    REPAY_OPERATION,
    DASHBOARD_REFRESH_INTERVAL,
    PRINCIPLE,
    INTEREST,
} from '../../../config';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import IconButton from '@material-ui/core/IconButton';

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

class DashboardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            selectedFilterOption: 'ALL',
        };
    }

    componentDidMount() {
        this.getData();
        this.setState({
            intervalId: setInterval(this.getData.bind(this), DASHBOARD_REFRESH_INTERVAL),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    async getData() {
        const { data: result } = await axios.get(`${this.props.base_path}${transactions}?page=0&pageLimit=10`);
        this.setState({
            isLoaded: true,
            result,
        });
    }

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

    updateFilter = (selectedFilterOption) => {
        this.setState({ selectedFilterOption });
    };
    render() {
        let tableRowHeaders;

        if (this.props.headers) {
            tableRowHeaders = this.props.headers.map((header, index) => (
                <TableCell key={'header_' + index} align="left" style={rowStyle}>
                    {header}
                </TableCell>
            ));
        }
        let rowElements;
        let { isLoaded, result } = this.state;

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
            // console.log(this.state.result);
            result = result.filter((row) => {
                if (this.state.selectedFilterOption.toUpperCase() !== 'ALL') {
                    return row.collateral === this.state.selectedFilterOption;
                }
                return true;
            });
            rowElements = result.map((row, index) => (
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
                        <Link target="_blank" rel="noopener" href={`/vault/${row.collateral}/${row.vaultId}`} color="inherit">
                            {row.vaultId}
                        </Link>
                    </TableCell>
                    <TableCell key={index + '_amount_' + row.amount} style={cell456} align="left">
                        {this.formatAmount(row.operation, row.collateral, row.amount, row.details)}
                    </TableCell>
                    <TableCell key={index + '_' + row.collateral + '_' + row.transactionHash} style={cell456} align="left">
                        {row.collateral}
                    </TableCell>
                    <TableCell key={index + '_' + row.operation + '_' + row.transactionHash} style={cell456} align="left">
                        {row.operation}
                    </TableCell>
                </TableRow>
            ));
        }

        return (
            <div className={classes.tablePadding}>
                <Card>
                    {/* <Grid justify="space-between" container spacing={1}>
          <Grid item style={style1}>
            {this.props.recentTransactionsText}
          </Grid>
          <Grid item>
            <TransactionsDropDownButton
              text={this.props.collateral_text}
              collaterals={this.props.collaterals}
            />
          </Grid>
        </Grid> */}

                    <div className={classes.alignTableTitle}>
                        <div className={classes.text}>{this.props.recentTransactionsText}</div>
                        <div>
                            <TransactionsDropDownButton
                                text={this.props.collateral_text}
                                collaterals={this.props.collaterals}
                                updateFilter={this.updateFilter}
                            />
                        </div>
                    </div>

                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="Transactions Table">
                            <TableHead>
                                <TableRow>{tableRowHeaders}</TableRow>
                            </TableHead>
                            <TableBody>{rowElements}</TableBody>
                        </Table>
                    </TableContainer>
                    <div className={classes.captionStyle}>
                        <Link target="_blank" rel="noopener" href={`${transactions}/xxxx`} color="inherit">
                            {this.props.viewAllTransactions}
                            <IconButton style={{ color: '#359595' }}>
                                <ArrowRightAltIcon />
                            </IconButton>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { select } = state.dashboardSelect;
    return { select };
};

const connectedDashboardTable = connect(mapStateToProps)(DashboardTable);

export { connectedDashboardTable as DashboardTable };
