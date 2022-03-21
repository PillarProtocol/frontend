import { Component } from 'react';
import { Box } from '@material-ui/core';
import { Navbar } from '../components/navbar';
import { VaultFactoryHeader } from '../components/headers/vaultFactoryHeader';
import { VaultFactoryCard } from '../components/cards/vaultFactoryCard';
import { VaultFactoryTable } from '../components/table/vaultFactoryTable';

import {
    WALLET_CONNECT,
    MY_VAULTS,
    BACKEND_SERVICE,
    COLLATERALS_TEXT,
    COLLATERALS,
    TOTAL_COLLATERAL_LOCKED_TEXT,
    TOTAL_PILLAR_LOCKED_TEXT,
    MINIMUM_COLLATERAL,
    INTEREST_RATE,
    LIQUIDATION_RATIO,
    TOTAL_VAULTS,
    VAULTS_OCCUPIED,
    VAULTS_REMAINING,
    FACTORY_FEATURES,
    FACTORY_TABLE_COLUMNS,
    VIEW_ALL_VAULTS,
    CREATE_VAULT_TEXT,
    ENTER_COLLATERAL_AMOUNT_TEXT,
    APPROVE_COLLATERAL_TEXT,
    COLLATERAL_APPROVED_TEXT,
    CANCEL_TEXT,
    APPROVE_COLLATERAL_DESC,
    BACK_TO_CREATE_VAULT,
    TOTAL_PILLAR_REPAID_TEXT,
} from '../config.js';

export default class VaultFactory extends Component {
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
                <VaultFactoryHeader
                    text={this.props.vaultFactory}
                    features={FACTORY_FEATURES}
                    createVault={CREATE_VAULT_TEXT}
                    enterCollateral={ENTER_COLLATERAL_AMOUNT_TEXT}
                    approveCollateral={APPROVE_COLLATERAL_TEXT}
                    collateralApproved={COLLATERAL_APPROVED_TEXT}
                    cancel={CANCEL_TEXT}
                    base_path={BACKEND_SERVICE}
                    approveDescription={APPROVE_COLLATERAL_DESC}
                    approveHeader={APPROVE_COLLATERAL_TEXT}
                    backToCreateVault={BACK_TO_CREATE_VAULT}
                />
                <VaultFactoryCard
                    vaultFactory={this.props.vaultFactory}
                    collaterals={COLLATERALS}
                    base_path={BACKEND_SERVICE}
                    totalPillar={TOTAL_PILLAR_LOCKED_TEXT}
                    totalPillarRepaid={TOTAL_PILLAR_REPAID_TEXT}
                    totalCollateral={TOTAL_COLLATERAL_LOCKED_TEXT}
                    minimumCollateral={MINIMUM_COLLATERAL}
                    interestRate={INTEREST_RATE}
                    liquidationRatio={LIQUIDATION_RATIO}
                    totalVaults={TOTAL_VAULTS}
                    vaultsOccupied={VAULTS_OCCUPIED}
                    vaultsRemaining={VAULTS_REMAINING}
                />
                <VaultFactoryTable
                    base_path={BACKEND_SERVICE}
                    vaultFactory={this.props.vaultFactory}
                    headers={FACTORY_TABLE_COLUMNS}
                    viewAllVaults={VIEW_ALL_VAULTS}
                />
            </Box>
        );
    }
}
