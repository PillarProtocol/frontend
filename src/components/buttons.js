import { Button, Box, Menu, MenuItem } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { connectWallet, changeDashboardSelector } from '../redux/actions';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { transformAddress as transformText, numberWithoutCommas } from './helpers';
import { DECIMAL, ZIL_SYMBOL } from '../config';

const StyledFormControl = styled(FormControl)({
    '& .MuiInputBase-root': {
        height: 42,
    },
});

const StyledMenu = styled(Menu)({
    '& ul': {
        padding: '0px',
    },
    '& .MuiPaper-root': {
        borderRadius: '0px',
    },
});

class TransactionsDropDownButton extends Component {
    state = {
        filter: this.props.collaterals.includes(this.props.defaultSelection) ? this.props.defaultSelection : this.props.collaterals[0],
    };

    handleChange = (event) => {
        this.setState({ filter: event.target.value });
        // this.props.changeDashboardSelector(event.target.value);
        this.props.updateFilter(event.target.value);
    };

    wrapper = createRef();

    render() {
        // const { text } = this.props;
        // const style = {
        //   margin: "0px 5px",
        //   padding: "8px 16px",
        //   fontFamily: "Karla",
        //   fontStyle: "normal",
        //   fontWeight: "600",
        //   fontSize: "17px",
        //   lineHeight: "20px",
        //   alignItems: "center",
        //   color: "#222222",
        // };

        const style1 = {
            fontFamily: 'Karla',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '17px',
            lineHeight: '20px',
            alignItems: 'center',
            color: '#222222',
        };

        let collaterals;
        if (this.props.collaterals) {
            collaterals = this.props.collaterals.map((collateral, index) => (
                <MenuItem key={index} value={collateral} style={style1}>
                    {collateral}
                </MenuItem>
            ));
        }

        return (
            <Box itemRef={this.wrapper}>
                {/* <Button
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          style={style}
        >
          {text} <ArrowDropDownIcon fontSize={"inherit"} />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {collaterals}
        </Menu> */}

                <StyledFormControl variant="outlined" style={{ minWidth: '120px', textAlgn: 'center' }}>
                    <Select
                        value={this.state.filter}
                        onChange={this.handleChange}
                        inputProps={{ 'aria-label': 'Without label' }}
                        displayEmpty
                    >
                        {collaterals}
                    </Select>
                </StyledFormControl>
            </Box>
        );
    }
}
class DropDownButton extends Component {
    state = {
        anchorEl: null,
    };
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    wrapper = createRef();

    openNewTab = (path) => () => {
        // alert(path);
        let win = window.open(path, '_blank');
        win.focus();
    };
    render() {
        const { anchorEl } = this.state;
        const { text } = this.props;
        const style = {
            margin: '0px 5px',
            padding: '8px 16px',
            background: '#1c4358',
            color: 'white',
        };

        const menuStyle = {
            background: 'white',
            color: 'black',
        };

        const vaultTypeStyle = {
            color: '#359595',
        };

        let vaults;
        if (this.props.vaults) {
            vaults = this.props.vaults.map((vault, index) => (
                <MenuItem key={index} onClick={this.handleClose} style={menuStyle}>
                    <Box style={menuStyle} onClick={this.openNewTab(`/vault/${vault.type}/${vault.id}`)}>
                        <span style={vaultTypeStyle}>{vault.type} </span>Vault {vault.id}
                    </Box>
                </MenuItem>
            ));
        }

        return (
            <Box itemRef={this.wrapper}>
                <Button aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleClick} style={style}>
                    {text} <ArrowDropDownIcon fontSize={'inherit'} />
                </Button>
                <StyledMenu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                    {vaults}
                </StyledMenu>
            </Box>
        );
    }
}

class DisabledButton extends Component {
    copyToClipboard(e) {
        e.preventDefault();
        navigator.clipboard.writeText(e.currentTarget.value);
    }

    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#1c4358',
            color: 'white',
            textTransform: 'none',
        };
        return (
            <Button disableElevation={false} onClick={this.copyToClipboard} style={style} value={text}>
                {transformText(text)} <FileCopyOutlinedIcon fontSize={'inherit'} />
            </Button>
        );
    }
}

class BalanceButton extends Component {
    render() {
        const { text, isPlainText } = this.props;
        const style = {
            padding: '8px 20px',
            background: '#1c4358',
            marginRight: '4px',
            color: 'white',
            textTransform: 'none',
        };
        return (
            <Button disableElevation={false} disabled={true} style={style} value={text}>
                {isPlainText ? text : numberWithoutCommas(text, DECIMAL.ZIL) + ' ' + ZIL_SYMBOL}
            </Button>
        );
    }
}

class MultiBalanceButton extends Component {
    render() {
        let { texts } = this.props;
        texts = texts.filter((text) => text);

        const style = {
            padding: '8px 20px',
            background: '#1c4358',
            color: 'white',
            textTransform: 'none',
        };
        const lastButtonStyle = {
            ...style,
            marginRight: '4px',
        };
        const balanceStyle = {
            padding: '8px 20px',
            background: '#1c4358',
            marginLeft: '4px',
            color: 'white',
            textTransform: 'none',
            opacity: '0.6',
        };
        let balance = (
            <Button disableElevation={false} disabled={true} style={balanceStyle} key={'balance-key'}>
                {'Bal:'}
            </Button>
        );

        let balances = texts.map((text, index) => {
            if ((index = texts.length - 1)) {
                return (
                    <Button disableElevation={false} disabled={true} style={style} key={text}>
                        {text}
                    </Button>
                );
            } else {
                return (
                    <Button disableElevation={false} disabled={true} style={lastButtonStyle} key={text}>
                        {text}
                    </Button>
                );
            }
        });
        let allButtons = [balance, ...balances];
        return (
            // <Button
            //   disableElevation={false}
            //   disabled={true}
            //   style={style}
            //   value={texts[0]}
            // >
            //   {texts[0]}
            // </Button>
            <div>{allButtons}</div>
        );
    }
}

class FormButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '12px 16px',
            background: this.props.disabled ? '#C2DFDF' : '#359595',
            color: 'white',
            fontFamily: 'Karla',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '17px',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'right',
            margin: '24px 0px 8px',
        };

        return (
            <Button disableElevation={false} style={style} onClick={this.props.clickFunction} disabled={this.props.disabled}>
                {text}
            </Button>
        );
    }
}

class CancelButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '12px 16px',
            background: '#ffffff',
            color: '#666666',
            fontFamily: 'Karla',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '17px',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'right',
            border: '1px solid #CACACA',
            margin: '8px 0px',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.clickFunction}>
                {text}
            </Button>
        );
    }
}

class NavbarButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            let zilpay = window.zilPay;
            if (zilpay && zilpay.wallet && zilpay.wallet.isConnect && zilpay.wallet.isEnable) {
                this.openWallet();
            }
        }, 1000);
    }

    async handleClick(e) {
        e.preventDefault();
        if (window.zilPay) {
            await window.zilPay.wallet.connect();
            await this.openWallet();
        } else {
            alert('Please add zilPay chrome extension');
        }
    }

    async openWallet() {
        const address = window.zilPay.wallet.defaultAccount.bech32;
        const balance = await window.zilPay.blockchain.getBalance(address);
        const result = await axios.get(`${this.props.path}/${address}`);
        this.props.connectWallet({ address, balance, vaults: result.data });
        clearInterval(this.interval);
        return;
    }

    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#359595',
            color: 'white',
            width: '100%',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.handleClick}>
                {text}
            </Button>
        );
    }
}

class FeatureButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#359595',
            color: 'white',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.handleOpenFunction}>
                {text}
            </Button>
        );
    }
}

class CancelUnlockButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#666666',
            color: 'white',
            marginLeft: '4px',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.handleOpenFunction}>
                {text}
            </Button>
        );
    }
}

class PreviousButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#359595',
            color: 'white',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.clickFunction} disabled={this.props.disabled}>
                <ArrowBackIcon /> {text}
            </Button>
        );
    }
}

class NextButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#359595',
            color: 'white',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.clickFunction} disabled={this.props.disabled}>
                <ArrowForwardIcon /> {text}
            </Button>
        );
    }
}

class VaultFeatureButton extends Component {
    render() {
        const { text } = this.props;
        const style = {
            padding: '8px 16px',
            background: '#153343',
            color: 'white',
            border: '1px solid #2c4756',
        };
        return (
            <Button disableElevation={false} style={style} onClick={this.props.handleOpenFunction}>
                {text}
            </Button>
        );
    }
}

const connectedNavbarButton = connect(null, { connectWallet })(NavbarButton);
const connectedDisabledButton = connect(null, { connectWallet })(DisabledButton);
const connectedDropDownButton = connect(null, { connectWallet })(DropDownButton);

const connectedTransactionsDropDownButton = connect(null, {
    changeDashboardSelector,
})(TransactionsDropDownButton);

export {
    connectedNavbarButton as NavbarButton,
    connectedDisabledButton as DisabledButton,
    connectedDropDownButton as DropDownButton,
    connectedTransactionsDropDownButton as TransactionsDropDownButton,
    FeatureButton,
    FormButton,
    CancelButton,
    VaultFeatureButton,
    PreviousButton,
    NextButton,
    BalanceButton,
    MultiBalanceButton,
    CancelUnlockButton,
};
