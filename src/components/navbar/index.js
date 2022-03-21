import { Component } from 'react';
import Logo from '../../logo.svg';
// import { AppBar, Toolbar, Grid, Button } from "@material-ui/core";
import { Grid, Button } from '@material-ui/core';
import { NavbarButton, DisabledButton, DropDownButton, BalanceButton } from '../buttons';
import { connect } from 'react-redux';
import { getMyVaults } from '../routes';
import { Link } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import classes from './style.module.scss';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
//import useMediaQuery from "@material-ui/core/useMediaQuery";

const HeaderButton = styled(Button)({
    height: '100%',
    borderRight: '1px solid #2c4756',
    paddingLeft: 32,
    paddingRight: 32,
    fontSize: 13,
    color: '#FFFFFF',
});
const FirstHeaderButton = styled(HeaderButton)({
    paddingLeft: 0,
    paddingRight: 37,
});

class MyNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    handleDrawerClose = () => {
        this.setState({ open: false });
    };
    render() {
        let collaterals;
        let staking;
        const { wallet_connect_text, my_vaults_text } = this.props;

        const elementsRemaining = (isWalletConnected, content) => {
            if (!isWalletConnected) {
                return (
                    <Grid item>
                        <NavbarButton text={wallet_connect_text} path={`${this.props.base_path}${getMyVaults}`} />
                    </Grid>
                );
            } else {
                return (
                    <Grid item>
                        <Grid container spacing={1}>
                            <DropDownButton text={my_vaults_text} vaults={content.vaults} />
                            {content ? <BalanceButton text={content.balance.result.balance} /> : null}
                            <DisabledButton text={content.address} />
                        </Grid>
                    </Grid>
                );
            }
        };

        if (this.props.collateral_text) {
            collaterals = this.props.collaterals.map((collateral) => (
                // <Grid item key={collateral} style={RestSubNavStyle}>
                // moved the to button inside link
                <Link to={'/vaultFactory/' + collateral} style={{ textDecoration: 'none', color: 'white' }} key={collateral}>
                    <HeaderButton>{collateral}</HeaderButton>
                </Link>
                // </Grid>
            ));
            staking = (
                <Link to={'/staking'} style={{ textDecoration: 'none', color: 'white' }} key={staking}>
                    <HeaderButton>{'Staking'}</HeaderButton>
                </Link>
            );
        }

        return (
            <div>
                <div className={classes.headerTop}>
                    <div>
                        <Link to="/">
                            <img src={Logo} alt="logo" />
                        </Link>
                    </div>
                    <div className="mobileOnly">
                        <IconButton style={{ color: '#C9A46F' }} aria-label="open drawer" edge="end" onClick={this.handleDrawerOpen}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <div className="desktopOnly">{elementsRemaining(this.props.wallet, this.props.content)} </div>
                </div>
                {/* <Toolbar>
          <Grid justify="flex-start" container spacing={1}>
            <Grid item style={FirstSubNavStyle}>
              <Button>
                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    opacity: '0.5',
                  }}
                >
                  {this.props.collateral_text}
                </Link>
              </Button>
            </Grid>
            {collaterals}
          </Grid>
        </Toolbar> */}
                <Drawer
                    variant="persistent"
                    anchor="top"
                    open={this.state.open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.mobileNavigation}>
                        <Link to="/">
                            <img src={Logo} alt="logo" />
                        </Link>

                        <IconButton onClick={this.handleDrawerClose} style={{ color: '#C9A46F' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div className={classes.connectWallet}>
                        <NavbarButton text={wallet_connect_text} path={`${this.props.base_path}${getMyVaults}`} />
                        <div className={classes.mobileCollateralText}>
                            <Link
                                to="/"
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                    opacity: '0.5',
                                }}
                            >
                                {this.props.collateral_text}
                            </Link>
                        </div>

                        {this.props.collateral_text ? (
                            <div className={classes.mobileCollateralOptions}>
                                {this.props.collaterals.map((collateral) => (
                                    <div key={collateral} className={classes.mobileCollateralOption}>
                                        <Link to={'/vaultFactory/' + collateral} style={{ textDecoration: 'none', color: 'white' }}>
                                            {collateral}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </Drawer>

                <div className={`${classes.header} desktopOnly`}>
                    <FirstHeaderButton>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                opacity: '0.5',
                            }}
                        >
                            {this.props.collateral_text}
                        </Link>
                    </FirstHeaderButton>
                    {collaterals}
                    {staking}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedNavBar = connect(mapStateToProps)(MyNavbar);

export { connectedNavBar as Navbar };
