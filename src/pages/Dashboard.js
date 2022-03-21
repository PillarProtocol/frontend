import { Component } from 'react';
import { Box } from '@material-ui/core';
import { Navbar } from '../components/navbar';
import { DashboardHeader } from '../components/headers/dashboardHeader';
import { DashboardCard } from '../components/cards/dashboardCard';
import { DashboardTable } from '../components/table/dashboardTable';
import Footer from '../components/footer';

import {
    WALLET_CONNECT,
    MY_VAULTS,
    BACKEND_SERVICE,
    COLLATERALS_TEXT,
    COLLATERALS,
    DASHBOARD_HEADER,
    LAST_WEEK_TEXT,
    TOTAL_VALUE_LOCKED_TEXT,
    TOTAL_PILLAR_LOCKED_TEXT,
    ALL_COLLATERALS_TEXT,
    ALL_COLLATERALS,
    RECENT_TRANSACTIONS,
    DASHBOARD_TABLE_COLUMNS,
    VIEW_ALL_TRANSACTIONS,
} from '../config.js';

export default class Dashboard extends Component {
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
                <DashboardHeader text={DASHBOARD_HEADER} />
                <DashboardCard
                    lastWeek={LAST_WEEK_TEXT}
                    totalPillar={TOTAL_PILLAR_LOCKED_TEXT}
                    totalCollateral={TOTAL_VALUE_LOCKED_TEXT}
                    base_path={BACKEND_SERVICE}
                />
                <DashboardTable
                    collateral_text={ALL_COLLATERALS_TEXT}
                    recentTransactionsText={RECENT_TRANSACTIONS}
                    collaterals={ALL_COLLATERALS}
                    headers={DASHBOARD_TABLE_COLUMNS}
                    viewAllTransactions={VIEW_ALL_TRANSACTIONS}
                    base_path={BACKEND_SERVICE}
                />
                <Footer />
            </Box>
        );
    }
}
