import { Component } from 'react';
import { Box, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Paper, Link } from '@material-ui/core';

import { allVaults } from '../routes';
import { rowStyle } from './style';
import { timeDifference, transformAddress as transform, numberWithCommas } from '../helpers';
import { DECIMAL, PILLAR_SYMBOL, VAULT_FACTORY_REFRESH_INTERVAL } from '../../config';

import axios from 'axios';
import classes from './vaultFactoryTable.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

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

class VaultFactoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }
    componentDidMount() {
        this.getData();
        this.setState({
            intervalId: setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    async getData() {
        const { data: result } = await axios.get(`${this.props.base_path}${allVaults}${this.props.vaultFactory}`);
        // console.log({result});
        this.setState({
            isLoaded: true,
            result,
        });
    }

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
                        <div className={classes.loadingBox}>
                            <div className={classes.loadingDiv}>
                                <CircularProgress style={{ color: '#C9A46F' }} />
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            );
        } else {
            rowElements = result.map((row, index) => (
                <TableRow key={'row_' + index}>
                    <TableCell key={index + '_' + row.createdAt} style={cell1} align="left">
                        {timeDifference(row.createdAt)}
                    </TableCell>
                    <TableCell key={'vaultId_' + index + '_' + row.vaultId} style={cell23} align="left">
                        <Link target="_blank" rel="noopener" href={`/vault/${this.props.vaultFactory}/${row.vaultId}`} color="inherit">
                            {row.vaultId}
                        </Link>
                    </TableCell>
                    <TableCell key={'collateralLocked_' + index + '_' + row.collateralLocked} style={cell456} align="left">
                        {numberWithCommas(row.collateralLocked, DECIMAL[this.props.vaultFactory])}
                    </TableCell>
                    <TableCell key={'pillar_' + index + '_' + row.pillarBorrowed} style={cell456} align="left">
                        {numberWithCommas(row.pillarBorrowed, DECIMAL[PILLAR_SYMBOL])}
                    </TableCell>
                    <TableCell key={index + '_' + row.owner} style={cell456} align="left">
                        <Link target="_blank" rel="noopener" href={`https://viewblock.io/zilliqa/address/${row.owner}`} color="inherit">
                            {transform(row.owner)}
                        </Link>
                    </TableCell>
                </TableRow>
            ));
        }

        return (
            <Box className={classes.conatinerStyle}>
                <TableContainer component={Paper}>
                    <div className={classes.recentTransactions}>Vault List</div>
                    <Table size="small" aria-label="Factory Table">
                        <TableHead>
                            <TableRow>{tableRowHeaders}</TableRow>
                        </TableHead>
                        <TableBody>{rowElements}</TableBody>
                    </Table>
                </TableContainer>
                {/* <div style={captionStyle}>
          <Link
            target="_blank"
            rel="noopener"
            href="https://www.google.com"
            color="inherit"
          >
            {this.props.viewAllVaults}
          </Link>
        </div> */}
            </Box>
        );
    }
}

export { VaultFactoryTable };
