import { Component } from 'react';
import { connect } from 'react-redux';
import classes from './dashboardHeader.module.scss';

import { TRANSACTIONS_HEADER } from '../../config';

class TransactionHeader extends Component {
    render() {
        return <div className={classes.dashboardHeader}> {TRANSACTIONS_HEADER}</div>;
    }
}

const mapStateToProps = (state) => {
    const { wallet, content } = state.walletConnect;
    return { wallet, content };
};

const connectedTransactionHeader = connect(mapStateToProps)(TransactionHeader);

export { connectedTransactionHeader as TransactionHeader };
