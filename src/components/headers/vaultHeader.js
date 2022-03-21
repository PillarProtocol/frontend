import { Component } from 'react';
// import { Grid, Modal, Backdrop } from "@material-ui/core";
import { Modal, Backdrop } from '@material-ui/core';
import { connect } from 'react-redux';
// import { dashboardHeaderStyle } from "./headerStyles";
// import { FeatureButton, VaultFeatureButton } from "../buttons";
import { VaultFeatureButton, MultiBalanceButton, BalanceButton } from '../buttons';
import { AddCollateralFade } from '../modalFade/addCollateralFade';
import { BorrowPillarFade } from '../modalFade/BorrowPillarFade';
import { RepayDebtFade } from '../modalFade/RepayDebtFade';
import { LiquidateVaultFade } from '../modalFade/liquidateVaultFade';
import { ReleaseCollateralFade } from '../modalFade/releaseCollateralFade';

import CircularProgress from '@material-ui/core/CircularProgress';
import { modal } from '../modalFade/styles';
import classes from './vaultHeader.module.scss';
import { getHexAddress, numberWithoutCommas } from '../helpers';
import { BACKEND_SERVICE, PRICE_SYMBOLS, DASHBOARD_REFRESH_INTERVAL, DECIMAL, PILLAR_SYMBOL } from '../../config';
import { price, pillarBalance, balance } from '../routes';
import axios from 'axios';

// const padding = {
//   padding: "5px 5px 5px 5px",
// };

class VaultHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: false,
        };
    }

    componentDidMount() {
        this.getData();
        this.intervalId = setInterval(this.getData.bind(this), DASHBOARD_REFRESH_INTERVAL);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    async getData() {
        if (this.props.vaultFactory) {
            let path = `${BACKEND_SERVICE}${price}/${this.props.vaultFactory}`;
            const { data: result } = await axios.get(path);
            if (PRICE_SYMBOLS[result.symbol]) {
                this.setState({
                    price: `1 ${this.props.vaultFactory} = ${result.value} ${PRICE_SYMBOLS[result.symbol]}`,
                });
            } else {
                this.setState({
                    price: 'Fetching ...',
                });
            }
        } else {
            this.setState({
                price: 'Loading ...',
            });
        }

        if (this.props.content && this.props.vaultFactory) {
            console.log(this.state);
            let pillarPath = `${BACKEND_SERVICE}${pillarBalance}/${this.props.content.address}`;
            const { data: pillarResult } = await axios.get(pillarPath);

            let vaultFactoryPath = `${BACKEND_SERVICE}${balance}/${this.props.vaultFactory}/${this.props.content.address}`;
            const { data: collateralResult } = await axios.get(vaultFactoryPath);

            this.setState({
                pillarBalance: `${numberWithoutCommas(pillarResult.value, DECIMAL[PILLAR_SYMBOL])} ${PILLAR_SYMBOL}`,
                collateralBalance: `${numberWithoutCommas(collateralResult.value, DECIMAL[this.props.vaultFactory])} ${
                    this.props.vaultFactory
                }`,
            });
        } else {
            this.setState({
                balance: `Bal: Loading...`,
            });
        }
    }

    handleAddCollateral = () => {
        this.setState({
            isModalOpen: true,
            isAddCollateralOpen: true,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: false,
        });
    };

    handleLiquidateVault = () => {
        this.setState({
            isModalOpen: true,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: true,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: false,
        });
    };

    handleBorrowPillar = () => {
        this.setState({
            isModalOpen: true,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: true,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: false,
        });
    };

    handleRepayDebt = () => {
        this.setState({
            isModalOpen: true,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: true,
            isReleaseCollateralOpen: false,
        });
    };

    handleReleaseCollateral = () => {
        this.setState({
            isModalOpen: true,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            isModalOpen: false,
            isAddCollateralOpen: false,
            isLiquidateVaultOpen: false,
            isBorrowPillarOpen: false,
            isRepayDebtOpen: false,
            isReleaseCollateralOpen: false,
        });
    };

    render() {
        let features;
        let userAddress;
        let price = <BalanceButton isPlainText={true} text={this.state.price} />;
        let multiBalance = this.props.content ? (
            <MultiBalanceButton isPlainText={true} texts={[this.state.collateralBalance, this.state.pillarBalance]} />
        ) : null;

        if (!this.props.wallet) {
            features = null;
        } else {
            userAddress = this.props.content.address;
            let ownerFeatures = this.props.ownerFeatures.map((feature) => {
                let handlerFunction;
                if (feature === 'Add Collateral') {
                    handlerFunction = this.handleAddCollateral;
                } else if (feature === 'Borrow Pillar') {
                    handlerFunction = this.handleBorrowPillar;
                } else if (feature === 'Repay Pillar') {
                    handlerFunction = this.handleRepayDebt;
                } else if (feature === 'Liquidate Vault') {
                    handlerFunction = this.handleLiquidateVault;
                } else if (feature === 'Release Collateral') {
                    handlerFunction = this.handleReleaseCollateral;
                }

                return <VaultFeatureButton key={feature} text={feature} handleOpenFunction={handlerFunction} />;
            });
            let nonOwnerFeatures = this.props.nonOwnerFeatures.map((feature) => {
                let handlerFunction;
                if (feature === 'Add Collateral') {
                    handlerFunction = this.handleAddCollateral;
                } else if (feature === 'Liquidate Vault') {
                    handlerFunction = this.handleLiquidateVault;
                }

                return <VaultFeatureButton key={feature} text={feature} handleOpenFunction={handlerFunction} />;
            });

            // replace this with zilcompare
            // remove this after testing
            if (this.props.vaultData) {
                if (getHexAddress(this.props.content.address) === getHexAddress(this.props.vaultData.owner)) {
                    features = [...ownerFeatures];
                } else {
                    features = [...nonOwnerFeatures];
                }
                // features = [...ownerFeatures, ...nonOwnerFeatures];
            } else {
                features = [];
            }
        }

        // console.log({vaultData: this.props.vaultData});
        return (
            <div>
                <div>
                    <div className={classes.vaultHeader}>
                        <div className={classes.vaultHeading}>
                            {this.props.vaultFactory} Vault {this.props.vaultId}
                        </div>
                        <div className={classes.priceButton}>{multiBalance}</div>
                        <div className={classes.priceButton}>{price}</div>
                        <div className={classes.featureButtons}>{features}</div>
                    </div>
                </div>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isAddCollateralOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <AddCollateralFade
                        open={this.state.isAddCollateralOpen}
                        addCollateralRequest={this.props.addCollateralRequest}
                        vaultFactory={this.props.vaultData ? this.props.vaultData.vaultFactory : 'Vault Factory'}
                        type={this.props.vaultData ? this.props.vaultData.type : 'Type'}
                        vaultId={this.props.vaultData ? this.props.vaultData.vaultId : 'Vault ID'}
                        cancelCallback={this.handleClose}
                        doneText={this.props.done}
                    />
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isBorrowPillarOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <BorrowPillarFade
                        open={this.state.isBorrowPillarOpen}
                        vaultAddress={this.props.vaultData ? this.props.vaultData.vaultAddress : 'Vault Address'}
                        cancelCallback={this.handleClose}
                        walletAddress={
                            this.props.wallet ? (
                                this.props.content.address
                            ) : (
                                <div>
                                    <CircularProgress />
                                    <div>Wallet Address Loading...</div>
                                </div>
                            )
                        }
                        pillarData={
                            this.props.vaultData
                                ? {
                                      ...this.props.vaultData,
                                  }
                                : null
                        }
                        wallet={this.props.content}
                        addCollateralCallback={this.handleAddCollateral}
                    />
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isRepayDebtOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <RepayDebtFade
                        open={this.state.isRepayDebtOpen}
                        vaultFactory={this.props.vaultData ? this.props.vaultData.vaultFactory : 'Vault Factory'}
                        type={this.props.vaultData ? this.props.vaultData.type : 'Type'}
                        vaultId={this.props.vaultData ? this.props.vaultData.vaultId : 'Vault ID'}
                        totalDebt={this.props.vaultData ? this.props.vaultData.totalDebt : '0'}
                        walletAddress={this.props.wallet ? this.props.content.address : 'User Address Loading'}
                        cancelCallback={this.handleClose}
                        doneText={this.props.done}
                    />
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isLiquidateVaultOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <LiquidateVaultFade
                        open={this.state.isLiquidateVaultOpen}
                        vaultFactory={this.props.vaultData ? this.props.vaultData.vaultFactory : 'Vault Factory'}
                        type={this.props.vaultData ? this.props.vaultData.type : 'Type'}
                        vaultId={this.props.vaultData ? this.props.vaultData.vaultId : 'Vault ID'}
                        totalDebt={this.props.vaultData ? this.props.vaultData.totalDebt : '0'}
                        walletAddress={this.props.wallet ? this.props.content.address : 'User Address Loading'}
                        cancelCallback={this.handleClose}
                        doneText={this.props.done}
                    />
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isReleaseCollateralOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <ReleaseCollateralFade
                        open={this.state.isReleaseCollateralOpen}
                        vaultData={
                            this.props.vaultData
                                ? {
                                      ...this.props.vaultData,
                                      //over ride any actual data for testing here
                                  }
                                : null
                        }
                        cancelCallback={this.handleClose}
                        base_path={this.props.base_path}
                        userAddress={userAddress}
                        vaultAddress={this.props.vaultData ? this.props.vaultData.vaultAddress : 'Vault Address'}
                        walletAddress={
                            this.props.wallet ? (
                                this.props.content.address
                            ) : (
                                <div>
                                    <CircularProgress />
                                    <div>Wallet Address Loading...</div>
                                </div>
                            )
                        }
                    />
                </Modal>
                {/* </Grid> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedVaultHeader = connect(mapStateToProps)(VaultHeader);

export { connectedVaultHeader as VaultHeader };
