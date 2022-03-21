import { Component } from 'react';
import { Box } from '@material-ui/core';
import { Navbar } from '../components/navbar';
import Footer from '../components/footer';
import { StakingHeader } from '../components/headers/stakingHeader';
import { StakingCard } from '../components/cards/stakingCard';
import { WALLET_CONNECT, MY_VAULTS, BACKEND_SERVICE, COLLATERALS_TEXT, COLLATERALS } from '../config.js';
import { StakingBody } from '../components/body/stakingBody';

export default class Staking extends Component {
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
                <StakingHeader />
                <StakingCard />
                <StakingBody />
                <Footer />
            </Box>
        );
    }
}
