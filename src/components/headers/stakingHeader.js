import { Component } from 'react';
import { connect } from 'react-redux';
import { FeatureButton } from '../buttons';
import classes from './vaultFactoryHeader.module.scss';
import { modal } from '../modalFade/styles';
import { Modal, Backdrop } from '@material-ui/core';

import {
    STAKING,
    STAKING_FEATURES,
    LOCK_TOKENS,
    BACKEND_SERVICE,
    DELEGATE_STAKE,
    REQUEST_UNLOCK_TOKENS,
    VAULT_FACTORY_REFRESH_INTERVAL,
} from '../../config';
import { LockTokensFade } from '../modalFade/lockTokensFade';
import { DelegationModalFade } from '../modalFade/delegationModal';
import { RequestUnlockFade } from '../modalFade/requestUnlockFade';

import { approvedGzil } from '../routes';
import axios from 'axios';

class StakingHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLockTokensModalOpen: false,
            isDelegateOpen: false,
            isUnlockTokensOpen: false,
            approvedGzilToStakingContract: 0,
            delegationAmount: 'Loading ...',
            gzil: 'Loading ...',
        };
    }

    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), VAULT_FACTORY_REFRESH_INTERVAL);
    }

    async getData() {
        console.log(this.props.content);
        if (this.props.content) {
            const { data: result } = await axios.get(`${BACKEND_SERVICE}${approvedGzil}/${this.props.content.address}`);
            this.setState({
                approvedGzilToStakingContract: result.value,
            });
            clearInterval(this.intervalId);
        }
    }

    handleLockTokensOpen = () => {
        this.setState({
            isLockTokensModalOpen: true,
            isDelegateOpen: false,
            isUnlockTokensOpen: false,
        });
    };

    handleDelegateOpen = () => {
        this.setState({
            isLockTokensModalOpen: false,
            isDelegateOpen: true,
            isUnlockTokensOpen: false,
        });
    };

    handleUnlockTokensOpen = () => {
        this.setState({
            isLockTokensModalOpen: false,
            isDelegateOpen: false,
            isUnlockTokensOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            isLockTokensModalOpen: false,
            isDelegateOpen: false,
            isUnlockTokensOpen: false,
        });
    };

    render() {
        let features;

        if (!this.props.wallet) {
            features = [];
        } else {
            features = STAKING_FEATURES.map((feature) => {
                if (feature === LOCK_TOKENS) {
                    return <FeatureButton key={feature} text={feature} handleOpenFunction={this.handleLockTokensOpen} />;
                }
                // @ uncomment to enable delegation
                //  else if (feature === DELEGATE_STAKE
                else if (feature === REQUEST_UNLOCK_TOKENS) {
                    return <FeatureButton key={feature} text={feature} handleOpenFunction={this.handleUnlockTokensOpen} />;
                } else {
                    return null;
                }
            });
        }
        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isLockTokensModalOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <LockTokensFade
                        open={this.state.isLockTokensModalOpen}
                        cancelCallback={this.handleClose}
                        approvedGzil={this.state.approvedGzilToStakingContract}
                        gzilBalanceText={this.state.gzil}
                    />
                </Modal>

                {/* <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isDelegateOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <DelegationModalFade
                        open={this.state.isDelegateOpen}
                        cancelCallback={this.handleClose}
                        selfShareBalanceText={this.state.delegationAmount}
                    />
                </Modal> */}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isUnlockTokensOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <RequestUnlockFade
                        open={this.state.isUnlockTokensOpen}
                        cancelCallback={this.handleClose}
                        selfShareBalanceText={this.state.delegationAmount}
                    />
                </Modal>

                <div className={classes.stakingHeader}>
                    <div className={classes.vaultFactoryHeading}>{STAKING}</div>
                    <div className={classes.featureButtons}>{features}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedStakingHeader = connect(mapStateToProps)(StakingHeader);

export { connectedStakingHeader as StakingHeader };
