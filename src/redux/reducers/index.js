import { combineReducers } from 'redux';
import { CHANGE_DASHBOARD_SELECTOR, CONNECT_WALLET } from '../actionTypes';

const initialState = {
    wallet: false,
};

const dashboardInitialState = {
    select: 'all',
};

function walletConnect(state = initialState, action) {
    if (action.type === CONNECT_WALLET) {
        return {
            ...action,
            wallet: true,
        };
    }
    return initialState;
}

function dashboardSelect(state = dashboardInitialState, action) {
    if (action.type === CHANGE_DASHBOARD_SELECTOR) {
        return {
            select: action.content.collateral,
        };
    }
    return dashboardInitialState;
}

export default combineReducers({ walletConnect, dashboardSelect });
