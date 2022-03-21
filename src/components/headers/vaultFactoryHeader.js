import { Component } from 'react';
// import { Grid, Modal, Backdrop } from "@material-ui/core";
import { Modal, Backdrop } from '@material-ui/core';
import { connect } from 'react-redux';
// import { dashboardHeaderStyle } from "./headerStyles";
import { FeatureButton, BalanceButton } from '../buttons';
import { CreateVaultFade } from '../modalFade/vaultFactoryFade';
import { ZilToWzilFade } from '../modalFade/zilToWzil';
import { WzilToZilFade } from '../modalFade/wzilToZil';

import { approvedCollateral } from '../routes';
import { modal } from '../modalFade/styles';
import classes from './vaultFactoryHeader.module.scss';
import { WZIL_SPECIFIC_FEATURES, ZIL_TO_WZIL, BACKEND_SERVICE, DASHBOARD_REFRESH_INTERVAL, PRICE_SYMBOLS, DECIMAL } from '../../config';
import { price, balance } from '../routes';
import axios from 'axios';

import { numberWithoutCommas } from '../helpers';

// const padding = {
//   padding: "5px 35px 5px 5px",
// };

class VaultFactoryHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreateVaultModalOpen: false,
            isZilToWzilOpen: false,
            isWzilToZilOpen: false,
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
        if (this.props.text) {
            let path = `${BACKEND_SERVICE}${price}/${this.props.text}`;
            const { data: result } = await axios.get(path);
            // console.log({path, result});
            if (PRICE_SYMBOLS[result.symbol]) {
                this.setState({
                    price: `1 ${this.props.text} = ${result.value} ${PRICE_SYMBOLS[result.symbol]}`,
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

        if (this.props.text && this.props.content) {
            let path = `${BACKEND_SERVICE}${balance}/${this.props.text}/${this.props.content.address}`;
            const { data: result } = await axios.get(path);
            // console.log({path, result});
            this.setState({
                balance: `Bal: ${numberWithoutCommas(result.value, DECIMAL[this.props.text])} ${this.props.text}`,
            });
        } else {
            this.setState({
                balance: `Bal: Loading...`,
            });
        }
    }

    handleCreateVaultOpen = () => {
        this.setState({
            isCreateVaultModalOpen: true,
            isZilToWzilOpen: false,
            isWzilToZilOpen: false,
        });
    };

    handleZilToWzilOpen = () => {
        this.setState({
            isCreateVaultModalOpen: false,
            isZilToWzilOpen: true,
            isWzilToZilOpen: false,
        });
    };

    handleWzilToZilOpen = () => {
        this.setState({
            isCreateVaultModalOpen: false,
            isZilToWzilOpen: false,
            isWzilToZilOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            isCreateVaultModalOpen: false,
            isZilToWzilOpen: false,
            isWzilToZilOpen: false,
        });
    };

    render() {
        let features;
        let wzilFeatures;
        let address;
        let data_path;
        let price = <BalanceButton isPlainText={true} text={this.state.price} />;
        let balance = <BalanceButton isPlainText={true} text={this.state.balance} />;

        if (!this.props.wallet) {
            features = [];
        } else {
            features = this.props.features.map((feature) => (
                <FeatureButton key={feature} text={feature} handleOpenFunction={this.handleCreateVaultOpen} />
            ));
            address = this.props.content.address;
            data_path = `${this.props.base_path}${approvedCollateral}${this.props.text}/${this.props.content.address}`;

            if (this.props.text && this.props.text === 'WZIL') {
                wzilFeatures = WZIL_SPECIFIC_FEATURES.map((wf) => (
                    <FeatureButton
                        key={wf}
                        text={wf}
                        handleOpenFunction={wf === ZIL_TO_WZIL ? this.handleZilToWzilOpen : this.handleWzilToZilOpen}
                    />
                ));
            }
        }
        return (
            <div>
                {/* <Grid container spacing={1} style={dashboardHeaderStyle}>
          <Grid item xs={12} md={9} lg={9} xl={9} style={padding}>
            {`${this.props.text} Factory`}
          </Grid>
          {features} */}
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isZilToWzilOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <ZilToWzilFade open={this.state.isZilToWzilOpen} cancelCallback={this.handleClose} vaultFactory={this.props.text} />
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isWzilToZilOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <WzilToZilFade open={this.state.isWzilToZilOpen} cancelCallback={this.handleClose} vaultFactory={this.props.text} />
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={modal}
                    open={this.state.isCreateVaultModalOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <CreateVaultFade
                        open={this.state.isCreateVaultModalOpen}
                        header={this.props.createVault}
                        description={this.props.enterCollateral}
                        vaultFactory={this.props.text}
                        address={address}
                        data_path={data_path}
                        cancel={this.props.cancel}
                        approve={this.props.approveCollateral}
                        cancelCallback={this.handleClose}
                        approveDescription={this.props.approveDescription}
                        approveHeader={this.props.approveHeader}
                        backToCreateVault={this.props.backToCreateVault}
                    />
                </Modal>
                {/* </Grid>  */}
                <div className={classes.vaultFactoryHeader}>
                    <div className={classes.vaultFactoryHeading}>{`${this.props.text} Factory`}</div>
                    <div className={classes.priceButton}>{balance}</div>
                    <div className={classes.priceButton}>{price}</div>
                    <div className={classes.featureButtons}>
                        {wzilFeatures}
                        {features}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedVaultFactoryHeader = connect(mapStateToProps)(VaultFactoryHeader);

export { connectedVaultFactoryHeader as VaultFactoryHeader };
