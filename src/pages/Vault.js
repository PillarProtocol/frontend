import { Component } from 'react';
import { Box } from '@material-ui/core';
import { Navbar } from '../components/navbar';
import { VaultHeader } from '../components/headers/vaultHeader';
import { VaultCard } from '../components/cards/vaultCard';
import { VaultTable } from '../components/table/vaultTable';
import axios from 'axios';
import { vault, vaultTransactions, factoryDetails } from '../components/routes';

import {
    WALLET_CONNECT,
    MY_VAULTS,
    BACKEND_SERVICE,
    COLLATERALS_TEXT,
    COLLATERALS,
    VAULT_NON_OWNER_FEATURES,
    VAULT_OWNER_FEATURES,
    VIEW_ALL_TRANSACTIONS,
    VAULT_TABLE_COLUMNS,
    TOTAL_COLLATERAL_LOCKED_TEXT,
    TOTAL_PILLAR_LOCKED_TEXT,
    TOTAL_DEBT,
    OWNER_ADDRESS,
    INTEREST_ACCUMULATED,
    INTEREST_RATE,
    LIQUIDATION_RATIO,
    ADD_COLLATERAL_REQUEST_TEXT,
    ADD_COLLATERAL_DONE,
} from '../config.js';

export default class Vault extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }
    async componentDidMount() {
        const { data: result } = await axios.get(`${BACKEND_SERVICE}${vault}${this.props.vaultFactory}/${this.props.vaultId}`);
        const { data: vaultTxns } = await axios.get(
            `${BACKEND_SERVICE}${vaultTransactions}${this.props.vaultFactory}/${this.props.vaultId}`
        );
        const { data: factory } = await axios.get(`${BACKEND_SERVICE}${factoryDetails}${this.props.vaultFactory}`);

        this.setState({
            isLoaded: true,
            result: {
                ...result,
                pillarForBurn: 0,
                vaultFactory: factory.vaultFactory,
            },
            vaultTxns,
        });
    }

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
                <VaultHeader
                    ownerFeatures={VAULT_OWNER_FEATURES}
                    nonOwnerFeatures={VAULT_NON_OWNER_FEATURES}
                    vaultId={this.props.vaultId}
                    vaultFactory={this.props.vaultFactory}
                    vaultData={this.state.result}
                    addCollateralRequest={ADD_COLLATERAL_REQUEST_TEXT}
                    done={ADD_COLLATERAL_DONE}
                    base_path={BACKEND_SERVICE}
                />
                <VaultCard
                    vaultData={this.state.result}
                    collateralLocked={TOTAL_COLLATERAL_LOCKED_TEXT}
                    pillarBorrowed={TOTAL_PILLAR_LOCKED_TEXT}
                    totalDebt={TOTAL_DEBT}
                    ownerAddress={OWNER_ADDRESS}
                    liquidationRatio={LIQUIDATION_RATIO}
                    interestRate={INTEREST_RATE}
                    interestAccumulated={INTEREST_ACCUMULATED}
                />
                <VaultTable
                    vaultData={this.state.result}
                    vaultTransactions={this.state.vaultTxns}
                    viewAllTransactions={VIEW_ALL_TRANSACTIONS}
                    headers={VAULT_TABLE_COLUMNS}
                    vaultFactory={this.props.vaultFactory}
                />
            </Box>
        );
    }
}
