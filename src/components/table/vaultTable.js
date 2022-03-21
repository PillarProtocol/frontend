import { Component } from 'react';
import { Box, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Paper, Link } from '@material-ui/core';
import { rowStyle, captionStyle } from './style';
import { timeDifference, transformTransactionHash as transform, numberWithCommas } from '../helpers';

import {
    ADD_COLLATERAL_OPERATION,
    REMOVE_COLLATERAL_OPERATION,
    REPAY_OPERATION,
    LIQUIDATE_OPERATION,
    PILLAR_SYMBOL,
    NETWORK,
    DECIMAL,
    PRINCIPLE,
    INTEREST,
} from '../../config';
import classes from './vaultTable.module.scss';

// const style = {
//   padding: "0px 120px",
// };

const cell = {
    fontFamily: 'Karla',
    fontStyle: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    alignItems: 'center',
    padding: '16px 0px 16px 24px',
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

class VaultTable extends Component {
    formatAmount(operation, collateral, amount, details) {
        if (operation === ADD_COLLATERAL_OPERATION || operation === REMOVE_COLLATERAL_OPERATION) {
            return `${numberWithCommas(amount, DECIMAL[collateral])} ${collateral}`;
        } else if (operation === REPAY_OPERATION || operation === LIQUIDATE_OPERATION) {
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
        let tableRowHeaders;
        let collateralType;
        let vaultId;
        if (this.props.headers) {
            tableRowHeaders = this.props.headers.map((header, index) => (
                <TableCell key={'header_' + index} align="left" style={rowStyle}>
                    {header}
                </TableCell>
            ));
        }
        let rowElements;
        if (this.props.vaultTransactions) {
            if (this.props.vaultTransactions.length > 0) {
                collateralType = this.props.vaultTransactions[0].type;
                vaultId = this.props.vaultTransactions[0].vaultId;
            }
            rowElements = this.props.vaultTransactions.map((row, index) => (
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
                    <TableCell key={index + '_' + row.operation + '_' + row.transactionHash} style={cell456} align="left">
                        {row.operation}
                    </TableCell>
                    <TableCell key={index + '_' + row.amount} style={cell456} align="left">
                        {this.formatAmount(row.operation, row.type, row.amount, row.details)}
                    </TableCell>
                </TableRow>
            ));
        }
        return (
            <Box className={classes.conatinerStyle}>
                <TableContainer component={Paper}>
                    <div className={classes.recentTransactions}>Recent Transactions</div>
                    <Table size="small" aria-label="Factory Table">
                        <TableHead>
                            <TableRow>{tableRowHeaders}</TableRow>
                        </TableHead>
                        <TableBody>{rowElements}</TableBody>
                    </Table>
                </TableContainer>
                <div style={captionStyle}>
                    <Link target="_blank" rel="noopener" href={`/transactions/${collateralType}/${vaultId}`} color="inherit">
                        {this.props.viewAllTransactions}
                    </Link>
                </div>
            </Box>
        );
    }
}

export { VaultTable };
