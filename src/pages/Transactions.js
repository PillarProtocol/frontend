import { Component } from 'react';
import { Box } from '@material-ui/core';
import { Navbar } from '../components/navbar';
import { TransactionHeader } from '../components/headers/transactionHeader';
import { TransactionTable } from '../components/table/transactionTable';

import Footer from '../components/footer';

import { WALLET_CONNECT, MY_VAULTS, BACKEND_SERVICE, COLLATERALS_TEXT, COLLATERALS } from '../config.js';

export default class Transactions extends Component {
    render() {
        return (
            <Box>
                <Navbar
                    wallet_connect_text={WALLET_CONNECT}
                    my_vaults_text={MY_VAULTS}
                    base_path={BACKEND_SERVICE}
                    collateral_text={COLLATERALS_TEXT}
                    collaterals={COLLATERALS}
                />
                <TransactionHeader />
                <TransactionTable vaultFactory={this.props.vaultFactory} vaultId={this.props.vaultId} />
                <Footer />
            </Box>
        );
    }
}
